import mongoose from "mongoose";
mongoose.connect(process.env.DSN);

// User schema
// stores information about users, including their posted listings, initiated requests, and ratings as both a seller and a buyer
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isVerified:{type:Boolean,default:false},
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }], // references to listings posted by the user
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }], // references to requests made by the user
  createdAt: { type: Date, default: Date.now },
});

// Listing schema
// represents items posted by users for sale or giveaway
// includes references to the seller and requests associated with the listing

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }], //store image URLS
  // status: { type: String, enum: ['Available', 'Reserved', 'Sold'], default: 'Available' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // reference to the user (seller)
  postedAt: { type: Date, default: Date.now }
});

// Request schema
// represents potential meetups for transactions, with references to the buyer, seller, and associated listing
// also includes fields for ratings and feedback between users

const requestSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  }, // reference to the associated listing
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // reference to the user (buyer)
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // reference to the user (seller)
  scheduledDate: { type: Date, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Completed", "Denied","No-show"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const notificationSchema = new mongoose.Schema({
  recipient: {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  message: {type:String,required:true},
  seen: { type: Boolean, default: true }, //track whether a notification is new or not
  createdAt: {type:Date,default:Date.now()},
})


export const User = mongoose.model("User", userSchema);
export const Listing = mongoose.model("Listing", listingSchema);
export const Request = mongoose.model("Request", requestSchema);
export const Notification= mongoose.model("Notification",notificationSchema);
