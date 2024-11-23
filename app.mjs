import "./config.mjs";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { Listing,User} from "./db.mjs";
import cors from "cors";
import bcrypt from 'bcryptjs';

mongoose.connect(process.env.DSN);
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

//post a listing
app.post("/listings", async (req, res) => {
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
app.get("/listings", async (req, res) => {
  console.log("Getting all listings...");
  const listings = await Listing.find();
  console.log("Found these listings", listings);
  res.status(200).json(listings);
});

//get a specific listing by id
app.get("/listings/:postId", async (req, res) => {
  const postId = req.params.postId;
  const listing = await Listing.findById(postId);
  res.json(listing);
});


//delete specific listing by id
app.delete("/listings/:id", async (req, res) => {
  const listingId = req.params.id;
  await Listing.findByIdAndDelete(listingId);
  res.status(200).json({ message: "Listing deleted successfully" });
});



// //post a listing
// app.post("/listings", async (req, res) => {
//   console.log("received data:", req.body);
//   try {
//     const listing = new Listing(req.body);
//     const savedListing = await listing.save();
//     console.log("saved listing:", savedListing);
//     res.status(201).json(savedListing);
//   } catch (error) {
//     console.error("error saving listing:", error);
//     res.status(500).json({ error: "failed to create listing" });
//   }
// });


//handle basic registration
app.post("/register", async (req, res) => {
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

app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); 
    res.json(users); // send the users data back
  } catch (err) {
    console.error(err);
    res.status(500).send('server error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
