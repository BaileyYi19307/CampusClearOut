

# CampusClearOut

## Overview

CampusClearOut is a web platform designed for university students to buy, sell, or give away furniture and other items at the end of the semester. Managing multiple listings across various platforms can be overwhelming and annoying. CampusClearOut makes this process easier by providing a single spot where students can easily post their items, browse available listings, and coordinate meetups for pickups.

Once students have registered and logged in, they can list their items, browse others’ posts, and schedule meetups to exchange goods. The platform is intended to feature a built-in rating system, allowing sellers and buyers to rate each other’s reliability, including marking "no-shows" for missed meetups to keep things transparent for other students.

## Data Model
The application will store three main types of documents: Users, Listings, and Requests


1. **Users**
   - Represents students who use the platform to buy or sell their leftover semester items
   - **Relationships**:
     - Users can create multiple Listings (via references)
     - Users can initiate multiple Requests (via references)

2. **Listings**
   - Represents items that students post for sale or giveaway
   - **Relationships**:
     - Listings can have multiple Requests associated with them (via references)

3. **Requests**
   - Represents potential meetup agreements between buyers and sellers for purchasing or picking up items
   - **Relationships**:
     - Each Request is linked to only one Listing (via references)

**Relationship Summary**:
- **Users** → Can create multiple **Listings** and initiate multiple **Requests**
- **Listings** → Can have multiple **Requests**
- **Requests** → Are linked to one **Listing**

An Example User:

```javascript
{
  username: "student123",
  email: "student123@example.com",
  passwordHash: "hashedpassword",
  listings: ["listingId1", "listingId2"], // references to listings posted by user
  requests: ["requestId1", "requestId2"], // references to requests made by user
  ratings: {
    asSeller: {
      totalScore: 45, // total score from all ratings as a seller
      count: 10 // number of ratings received as a seller
    },
    asBuyer: {
      totalScore: 35, // total score from all ratings as a buyer
      count: 7 // number of ratings received as a buyer
    }
  },
  createdAt: //date and time created
}

```

An Example Listing:

```javascript
{
  title: "Desk",
  description: "A wooden desk in good condition.",
  price: 50,
  images: ["image1.jpg", "image2.jpg"],
  status: "Available",
  seller: "userId123", // reference to the user (seller)
  requests: ["requestId1", "requestId3"], // references to requests made for this listing
  postedAt: //date and time posted
}

```

An Example Request:

```javascript
{
  listing: "listingId1", 
  buyer: "userId456", 
  seller: "userId123", 
  scheduledDate: //date and time for proposed meetup,
  location: "Dorm Lobby",
  status: "Completed",
  buyerRating: {
    score: 4, // rating given by the seller to the buyer after meetup
    feedback: "Buyer was easy to deal with."
  },
  sellerRating: {
    score: 5, // Rating given by the buyer to the seller after meetup
    feedback: "Great seller, item as described."
  },
  createdAt: //time created 
}

```

## [Click Here for Commented First Draft Schema](db.mjs) 


## Wireframes

/login - page for users to log into their accounts
![login](documentation/login.png)

/register - page for users to create a new account
![register](documentation/register.png)

/listings - homepage displaying all available listings
![listings](documentation/listings.png)

/listings/:postId - page for showing a specific listing post
![listings postId](documentation/listingspostId.png)

/listings/:postId/makeRequest - page for requesting a specific listing (item listed)
![listings postId makeRequest](documentation/listingspostIdmakeRequest.png)

/dashboard - page for displaying overview of account activities
![dashboard](documentation/dashboard.png)

/dashboard/my-listings - page showing all listings created by user
![dashboard mylistings](documentation/dashboardmylistings.png)

/dashboard/my-listings/create - page for users to create a new listing
![dashboard mylistings create](documentation/dashboardmylistingscreate.png)

/dashboard/my-listings/:listingId/requests - page showing all requests others have made on a specific listing of the user
![dashboard mylistings listingId requests](documentation/dashboardmylistingslistingIdrequests.png)

/dashboard/my-listings/:listingId/requests/:requestId/rate - page for the user to rate a specific request on one of their listings (e.g., rating "0 stars - no show" when a requester fails to pick up an item).
![dashboard mylistings listingId requests requestId rate](documentation/dashboardmyrequestsrequestIdrate.png)

/dashboard/my-requests - page displaying all requests submitted by the user
![dashboard myrequests](documentation/dashboardmyrequests.png)

/dashboard/my-requests/:requestId - page for viewing details of a specific request made by the user
![dashboard myrequests requestId](documentation/dashboardmyrequestsrequestId.png)

/dashboard/my-requests/:requestId/rate - page for the user to rate a specific request (e.g., rating "0 stars - no show" when the seller fails to show up with the item)
![dashboard myrequests requestId rate](documentation/dashboardmyrequestsrequestIdrate.png)


## Site map
![Site Map](documentation/site-map.png)


## User Stories or Use Cases

1. As a non-registered user, I can register a new account with the site
2. As a user, I can log in to the site
3. As a user, I can browse all available listings on the homepage
4. As a user, I can create a new listing to sell or give away an item from my dashboard
5. As a user, I can view all of the listings I have created on the "My Listings" page
6. As a user, I can edit or remove an existing listing I created from my "My Listings" page
7. As a user, I can view detailed information about any listing I am interested in
8. As a user, I can submit a request to schedule a meetup for a specific listing
9. As a user, I can view and manage requests for my listings on a page dedicated to each listing's requests
10. As a user, I can approve, decline, or suggest changes to a proposed meetup for a request on one of my listings
11. As a user, I can view all of my submitted requests in a single list on the "My Requests" page
12. As a user, I can check the status of my submitted requests, including approved, pending, or declined
13. As a user, I can report a no-show after the scheduled meetup
14. As a user, I can rate and review the other party (buyer or seller) after a completed or missed meetup


## Research Topics

- **(4 points) Using React as the frontend framework**
  - React is a JavaScript library for building user interfaces using reusable components, making frontend development modular
  - Because I haven’t worked with React before, I’m assigning it 4 points due to the learning curve

- **(2 points) Bootstrap to help develop the frontend**
  - Bootstrap is a CSS framework that provides pre-styled components and a responsive grid system to design and build responsive web applications faster
  - I have also never worked with it before, so I’m assigning it 2 points for learning and integration

- **(2 points) Integrate user authentication**
  - I will be using express-sessions for handling user authentication

- **(2 points) Integrate real-time notifications and updates**
  - I plan to use Socket.IO to integrate real-time notifications and updates for buyers when sellers respond to requests or update meetings and vice versa
  - Socket.IO is a JavaScript library that enables real-time, bidirectional communication between the server and clients

- **(1 point) Google Maps API**
  - I will use the Google Maps API to indicate pickup locations and enable users to view items by proximity
  - Google Maps API is a service that allows developers to embed maps and location-based functionalities into web applications

- **(1 point) Email notifications**
  - I will use Nodemailer, a Node.js library, to send email notifications like welcome emails and password reset links
  - Nodemailer is a module that simplifies sending emails from a Node.js application

**Total Points**: 12 points out of 10 required points

## [Click Here for Initial Main Project File](app.mjs) 
- Check the repository for the added files (i.e. views folder, .gitignore, package.json, etc)

## Annotations / References Used

None so far

