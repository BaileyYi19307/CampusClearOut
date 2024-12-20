import "./config.mjs";
import express from "express";
import mongoose from "mongoose";
import { Listing, User, Request, Notification } from "./db.mjs";
import cors from "cors";
import bcrypt from "bcryptjs";
import session from "express-session";
import mongoSanitize from 'express-mongo-sanitize';
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { Server } from "socket.io";
import uploadMiddleware from "./uploadMiddleware.js";

//connect to mongodb
mongoose.connect(process.env.DSN);
const app = express();
const server = createServer(app);
// initialize Socket.IO server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// mapping userId to socketId
const userSockets = {};

//when server object connects:
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // handle the register event
  socket.on("connectUser", (userId) => {
    userSockets[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // find userId associated with disconnected socket ID and remove mapping
    const userId = Object.keys(userSockets).find(
      (key) => userSockets[key] === socket.id
    );
    if (userId) {
      delete userSockets[userId];
    }
  });
});

//parse JSON bodies
app.use(express.json());
// configure and use session management middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 86400000,
    },
  })
);

// enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


// add mongo-sanitize middleware
app.use(
  mongoSanitize({
    replaceWith: "_", // Replaces $ and .
  })
);


//adding protected routes here
const authRequiredPaths = [
  "/api/current-user",
  "/api/create-listing",
  "/api/my-listings",
  "/api/my-requests",
  "/api/incoming-requests",
  "/api/approve-request/:requestId",
  "/api/deny-request/:requestId",
  "/api/delete-request/:requestId",
  "/api/approved-requests",
  "/api/delete-listing/:id",
];

//middleware to check if the user is authenticated before accessing protected routes
app.use((req, res, next) => {
  if (authRequiredPaths.includes(req.path)) {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
  next();
});



app.get('/api/debug-session', (req, res) => {
  res.json({ session: req.session });
});

app.post('/api/test-sanitize', (req, res) => {
  console.log('Received sanitized request:', req.body);
  res.status(200).json({
    sanitizedBody: req.body,
    sanitizedQuery: req.query,
    sanitizedParams: req.params,
  });
});

//save listing files uploaded to "listings" folder in Cloudinary
const upload = uploadMiddleware("listings");

//route to create a listing
//only allow one image to be uploaded
app.post("/api/create-listing", upload.single("image"), async (req, res) => {
  // console.log("received data:", req.body);

  //get userId
  const userId = req.session.user.id;

  //destructure data received
  const { title, description, price } = req.body;

  //get url of uploaded image
  //req.file.path gets the cloudinary URL of the uploaded image
  //either url returned by cloudinary or null if no image uploaded
  const imageUrl = req.file ? req.file.path : null;

  try {
    const listing = new Listing({
      title,
      description,
      price,
      images: imageUrl ? [imageUrl] : [],
      seller: userId,
    });
    const savedListing = await listing.save();
    // console.log("listing created and saved:", savedListing);
    res.status(201).json(savedListing);
  } catch (error) {
    console.error("error saving listing:", error);
    res.status(500).json({ error: "failed to create listing" });
  }
});

//route to retrieve all listings from database
app.get("/api/listings", async (req, res) => {
  console.log("Getting all listings...");
  const listings = await Listing.find().populate("seller", "username");
  res.status(200).json(listings);
});

//route to get a specific listing by id
app.get("/api/listings/:postId", async (req, res) => {
  const postId = req.params.postId;
  const listing = await Listing.findById(postId).populate("seller", "username");
  res.status(200).json(listing);
});

//retrive all listings created by currently logged in user
app.get("/api/my-listings", async (req, res) => {
  const userId = req.session.user.id;
  try {
    //only retrive listings created by logged in user
    const listings = await Listing.find({ seller: userId });
    res.status(200).json(listings || []);
  } catch (error) {
    console.error("Error fetching user listings:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//route to delete specific listing by id
app.delete("/api/listings/:id", async (req, res) => {
  const listingId = req.params.id;
  await Listing.findByIdAndDelete(listingId);
  res.status(200).json({ message: "Listing deleted successfully" });
});

//route to save a listing
app.post("/api/listings", async (req, res) => {
  try {
    const listing = new Listing(req.body);
    const savedListing = await listing.save();
    console.log("saved listing:", savedListing);
    res.status(201).json(savedListing);
  } catch (error) {
    console.error("error saving listing:", error);
    res.status(500).json({ error: "failed to create listing" });
  }
});

//configure email transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// JWT secret for generating email verification tokens
const JWT_SECRET = process.env.JWT_SECRET;

//function to send verification email using Node mailer
export async function sendVerificationEmail(email, userId) {
  try {
    // generate JWT token with 15 minute expiration
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
    const verificationLink = `${process.env.BACKEND_URL}/api/verify-email/${token}`;

    // send email with verification link
    const info = await transporter.sendMail({
      from: '"CampusClearOut" <no-reply@campusclearout.com>',
      to: email,
      subject: "Verify Your Email for CampusClearOut",
      text: `Please verify your email by clicking the following link: ${verificationLink}`, // Plain text for fallback
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50;">Welcome to CampusClearOut!</h2>
        <p>
          Thank you for registering with CampusClearOut. To complete your registration, please verify your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationLink}" style="
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: #ffffff;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
          ">
            Verify My Email
          </a>
        </div>
        <p>If the button doesn't work, you can also verify your email by copying and pasting this link into your browser:</p>
        <p style="word-wrap: break-word;">
          <a href="${verificationLink}" style="color: #3498db;">${verificationLink}</a>
        </p>
        <p style="margin-top: 30px;">
          If you didn't sign up for CampusClearOut, you can safely ignore this email.
        </p>
        <p style="color: #aaa; font-size: 12px; margin-top: 20px;">
          &copy; ${new Date().getFullYear()} CampusClearOut.
        </p>
      </div>
    `,
    });

    console.log("Verification email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
}

// route to verify user email
app.get("/api/verify-email/:token", async (req, res) => {
  const token = req.params.token;

  try {
    // verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // find the user
    const user = await User.findById(decoded.userId);
    if (!user) {
      // Redirect to React with "notfound" status
      return res.redirect(
        `${process.env.FRONTEND_URL}/#/email-verification-result?status=notfound`
      );
    }

    // check if the user is already verified
    if (user.isVerified) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/#/email-verification-result?status=alreadyverified`
      );
    }

    // mark the user as verified
    user.isVerified = true;
    await user.save();

    return res.redirect(
      `${process.env.FRONTEND_URL}/#/email-verification-result?status=success`
    );
  } catch (error) {
    console.error("Verification error:", error.message);

    return res.redirect(
      `${process.env.FRONTEND_URL}/#/email-verification-result?status=error`
    );
  }
});

//route to handle user registration
app.post("/api/register", async (req, res) => {
  console.log("user is attempting to register");
  console.log("received data:", req.body); //currently only has the username
  const { username, emailAddress, password } = req.body;

  //hash the password
  //store their credentials into the database
  try {
    //checking for all fields
    if (!username || !emailAddress || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //checking for a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    //check that the user doesn't already exist
    const existingUser = await User.findOne({
      $or: [{ username }, { email: emailAddress }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username: username,
      email: emailAddress,
      passwordHash: hashedPassword,
      createdAt: Date.now(),
    });

    const savedUser = await user.save();
    console.log("saved User:", savedUser);

    //send verification email
    await sendVerificationEmail(emailAddress, savedUser._id);

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("error saving user:", error);
    res.status(500).json({ error: "failed to save user" });
  }
});

//route to fetch all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users); // send the users data back
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
});

//route to login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log("The req body is", req.body);
  //check that both email and password are available
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  //find user
  try {
    const user = await User.findOne({ email });
    console.log(user.username, "logged in");

    //if user doesn't exist
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // check if the email is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({
          message:
            "Email not verified. Please check your email and verify your account to log in.",
        });
    }
    //compare hashes
    const passwordsMatch = bcrypt.compareSync(password, user.passwordHash);
    //if passwords don't match
    if (!passwordsMatch) {
      return res.status(401).json({ message: "Password does not match" });
    }
    //store user id in the session
    req.session.user = { id: user._id, username: user.username };
    console.log("The req.session.user is", req.session.user.username);
    res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

//route to logout
app.post("/api/logout", (req, res) => {
  //destroy session for user
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

//route to return currently logged in user's details based on session
app.get("/api/current-user", (req, res) => {
  if (req.session.user) {
    console.log("Logged in user:", req.session.user);
    return res.status(200).json({ user: req.session.user });
  } else {
    console.log("No user is logged in");
    return res.status(401).json({ message: "No user is logged in" });
  }
});

//route to submit a request for an item
app.post("/api/make-request", async (req, res) => {
  console.log(req.body);
  //store in database
  try {
    const request = new Request(req.body);
    const savedRequest = await request.save();
    console.log("Succeessfuly saved request");
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error("error saving request:", error);
    res.status(500).json({ error: "failed to create request" });
  }
});

// rout to fetch all requests made by the logged-in user
app.get("/api/my-requests", async (req, res) => {
  //get user ID from the session
  const userId = req.session.user.id;

  // find all requests where logged in user is buyer
  const userRequests = await Request.find({ buyer: userId }).populate(
    "listing",
    "title"
  );
  res.status(200).json(userRequests);
});

//route to get incoming requests others have submitted to seller
app.get("/api/incoming-requests", async (req, res) => {
  //get the user id
  const userId = req.session.user.id;
  const incomingRequests = await Request.find({ seller: userId })
    .populate("listing", "title")
    .populate("buyer", "username");

  //find all the requests where the seller is the user id
  res.status(200).json(incomingRequests);
});

// route to fetch all notifications for a specific user
app.get("/api/notifications", async (req, res) => {
  console.log("HERE req.query is.....",req.query);
  const { userId } = req.query;

  console.log("HERE userId is.....",userId);

  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log("Fetching notifications.....");
    // fetch notifications for given user ID,  most recent first
    const notifications = await Notification.find({ recipient: userId }).sort({
      createdAt: -1,
    });
    console.log("THE NOTIFICATIONS FOUND ARE....",notifications)

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

//function for saving notification in backend
const saveNotification = async (userId, message) => {
  try {
    const notification = new Notification({
      recipient: userId,
      message: message,
    });
    await notification.save();
    console.log("Notification saved:", notification);
  } catch (error) {
    console.error("Error saving notification:", error);
  }
};

//function for sending notification to recipient
const sendNotification = async (buyerId, message) => {
  console.log("sending notification");
  try {
    if (userSockets[buyerId]) {
      // send live notification to recipient if so
      io.to(userSockets[buyerId]).emit("notification", { message });
    } else {
      console.log(
        `User ${buyerId} is offline. Notification saved to the database.`
      );
    }
    //otherwise save notification to database
    console.log("now saving.......");
    await saveNotification(buyerId, message);
  } catch (error) {
    console.log("Error sending notification:", error);
  }
};

//route for approving requests and updating status
app.post("/api/approve-request/:requestId", async (req, res) => {
  //receive the request id in requestId;
  const requestId = req.params.requestId;
  console.log("This is the request id", requestId);
  try {
    //find request in database
    const request = await Request.findOne({ _id: requestId }).populate(
      "listing",
      "title"
    );
    //change it's status
    request.status = "Approved";
    const savedRequest = await request.save();
    console.log("The saved request was", savedRequest);

    //update the listing to "On Hold"
    const listing = await Listing.findById(request.listing._id);
    listing.status = "On Hold";
    await listing.save();

    const buyerId = savedRequest.buyer;
    console.log("The buyer id was", buyerId);
    const message = `Your request for ${savedRequest.listing.title} was approved by the seller.`;

    //send notification
    await sendNotification(buyerId, message);

    console.log("The request is....", request);
    return res.status(200).json(request);
  } catch (error) {
    console.log("Error approving request", error);
    return res.status(500).json({ error: "Error approving request" });
  }
});

//route for the seller to deny requests
app.post("/api/deny-request/:requestId", async (req, res) => {
  //delete the request
  const requestId = req.params.requestId;
  try {
    const request = await Request.findOne({ _id: requestId }).populate(
      "listing",
      "title"
    );
    //create message
    const buyerId = request.buyer;
    const message = `Your request for ${request.listing.title} was denied by the seller.`;

    //update status
    request.status = "Denied";
    const updatedRequest = await request.save();
    console.log("The request being denied is", updatedRequest);

    // update listing's status back to "Available"
    const listing = await Listing.findById(request.listing._id);
    listing.status = "Available";
    await listing.save();

    // send notification
    await sendNotification(buyerId, message);

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("Error denying request", error);
    return res.status(500).json({ error: "Error deleting request" });
  }
});

//route to delete a request
app.delete("/api/delete-request/:requestId", async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const request = await Request.findById(requestId).populate(
      "listing",
      "_id"
    );

    // update listing's status back to "Available"
    const listing = await Listing.findById(request.listing._id);
    if (listing.status === "On Hold") {
      listing.status = "Available";
      await listing.save();
    }
    //delete the request
    const deletedRequest = await Request.findByIdAndDelete(requestId);
    console.log("Request deleted:", deletedRequest);

    //confirm the deletion
    res
      .status(200)
      .json({
        message: "Request deleted successfully and listing status updated",
        deletedRequest,
      });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ error: "Failed to delete request" });
  }
});

// route to get all approved requests for the buyer
app.get("/api/approved-requests", async (req, res) => {
  const sellerId = req.session.user.id;
  try {
    //return approved requests by seller
    const approvedRequests = await Request.find({
      seller: sellerId,
      status: "Approved",
    })
      .populate("listing", "title")
      .populate("buyer", "username");

    res.status(200).json(approvedRequests);
  } catch (error) {
    console.error("Error fetching approved requests:", error);
    res.status(500).json({ error: "Error fetching approved requests" });
  }
});

// const HOST = process.env.HOST || "127.0.0.1";
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, HOST, () => {
//   console.log(`Server is running at http://${HOST}:${PORT}`);
// });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running at port${PORT}`);
});