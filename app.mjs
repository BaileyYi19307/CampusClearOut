import "./config.mjs";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { Listing,User} from "./db.mjs";
import cors from "cors";
import bcrypt from 'bcryptjs';
import session from "express-session";

mongoose.connect(process.env.DSN);
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    httpOnly: false, 
    saveUninitialized: true,
    sameSite: 'none',
    cookie: { 
      secure: process.env.NODE_ENV === 'production', //setting to secure only in production
      maxAge: 86400000 },
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
	  credentials: true,
  })
);

//adding protected routes here
const authRequiredPaths = ["/api/current-user"];

//check if the user is authenticated before accessing protected routes
app.use((req, res, next) => {
  if (authRequiredPaths.includes(req.path)) {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
  next();
});

//post a listing
app.post("/api/listings", async (req, res) => {
  console.log("received data:", req.body);
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

//retrieve all listings from database
app.get("/api/listings", async (req, res) => {
  console.log("Getting all listings...");
  const listings = await Listing.find();
  res.status(200).json(listings);
});

//get a specific listing by id
app.get("/api/listings/:postId", async (req, res) => {
  const postId = req.params.postId;
  const listing = await Listing.findById(postId);
  res.json(listing);
});


//delete specific listing by id
app.delete("/api/listings/:id", async (req, res) => {
  const listingId = req.params.id;
  await Listing.findByIdAndDelete(listingId);
  res.status(200).json({ message: "Listing deleted successfully" });
});



//post a listing
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


//handle basic registration
app.post("/api/register", async (req, res) => {
  console.log("user is attempting to register");
  console.log("received data:",req.body); //currently only has the username
  const {username,emailAddress,password}=req.body;

  if (!username || !emailAddress || !password) {
    return res.status(400).json({ message: 'all fields are required' });
  }
  //hash the password
  //store their credentials into the database  
  try{
    const hashedPassword=await bcrypt.hash(password,10);
    const user=new User({
      username:username,
      email:emailAddress,
      passwordHash:hashedPassword,
      createdAt:Date.now()
    });
    const savedUser = await user.save();
    console.log("saved User:", savedUser);
    res.status(201).json(savedUser);
  }
  catch(error){
    console.error("error saving user:", error);
    res.status(500).json({ error: "failed to save user" });
  }
});


//endpoint to fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); 
    res.json(users); // send the users data back
  } catch (err) {
    console.error(err);
    res.status(500).send('server error');
  }
});


//adding route to login 
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("The req body is", req.body);
  //check that both email and password are available
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  //find user
  try {
    const user = await User.findOne({ email });
    console.log("The user is", user);
    //if user doesn't exist
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordsMatch = bcrypt.compareSync(password, user.passwordHash);

    //if passwords don't match
    if (!passwordsMatch) {
      return res.status(401).json({ message: "Password does not match" });
    }
    
    req.session.user = { id: user._id, username: user.username };
    console.log("The req.session.user is", req.session.user);
    res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

//adding route to logout
app.post("/api/logout",(req,res)=>{
  //destroy session for user
  req.session.destroy((err)=>{
    if (err){
      return res.status(500).json({message:"Logout failed"});
    }
    res.clearCookie("connect.sid");
    res.status(200).json({message:"Logged out successfully"});
  })
})

//endpoint to return currently logged in user's details based on session
app.get('/api/current-user',(req,res)=>{
  if(req.session.user){
    console.log("Logged in user:", req.session.user);
    return res.status(200).json({user:req.session.user});
  }
  else{
    console.log("No user is logged in");
    return res.status(401).json({message:"No user is logged in"});
  }
})


const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;
app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});

