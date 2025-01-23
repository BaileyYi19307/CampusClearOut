Milestone 04 - Final Project Documentation
===

NetID
---
bzy203

Name
---
Bailey Yi

Repository Link
---
https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307

URL for deployed site 
---
http://linserv1.cims.nyu.edu:24452

URL for form 1 (from previous milestone) 
---
http://linserv1.cims.nyu.edu:24452/#/register

Special Instructions for Form 2
---
To test the user registration and verification process:

1. Navigate to the [Registration Page](http://linserv1.cims.nyu.edu:24452/#/register).
2. Fill out the form with:
   - **Username**: Choose a unique username.
   - **Email**: Use a valid, accessible email address.
   - **Password**: Enter a password longer than 8 characters.
3. Submit the form. A success message will confirm the submission, and a verification email will be sent.
4. Check your email for a message from **CampusClearOut**. Click the **Verify My Email** button in the email to confirm your account.
5. After clicking the verification link, you'll be redirected to a success page.
6. From the success page, click the **Login** button or go to the login page.
7. Log in with your username and password. Once logged in, you’ll be redirected to the dashboard.

URL for form 2 (from previous milestone)
---
http://linserv1.cims.nyu.edu:24452/#/dashboard/mylistings/create

Special Instructions for Form 2
---
To create and manage listings

1. **Ensure You Are Logged In**:
   - If you are not logged in, navigate to the [Login Page](http://linserv1.cims.nyu.edu:24452/#/login).
   - Use the following credentials if needed:
     - **Email**: `user1@gmail.com`
     - **Password**: `user1password`

2. **Navigate to the Dashboard**:
   - After logging in, go to the [Dashboard](http://linserv1.cims.nyu.edu:24452/#/dashboard).

3. **Create a New Listing**:
   - Click on **Go to Listings** from the Dashboard.
   - Click on **Create New Listing**.
   - Fill in the input fields with the title, description, price, and upload an image.
   - Click **Submit Listing**. 
   - You will be redirected to the [My Listings page](http://linserv1.cims.nyu.edu:24452/#/dashboard/mylistings), where the new listing will be displayed.

4. **View Listings**:
   - The new listing will also appear on the [Main Listings page](http://linserv1.cims.nyu.edu:24452/#/).

5. **Deleting Listings**:
   - Listings can be deleted directly from the [My Listings page](http://linserv1.cims.nyu.edu:24452/#/dashboard/mylistings).


URL for form 3 (for current milestone) 
---
See special instructions down below 

Special Instructions for Form 3
---
Meetup Request and Live Notifications for Approved and Denied Requests

#### Step 1: Submit a Meetup Request
1. **Log into User 1's Account**:
   - Navigate to a listing, for example: [Desk Chair Listing](http://linserv1.cims.nyu.edu:24452/#/listings/675617b39bfabfcfbfdbccd8).
   - Click on **Request Item**.
   - Fill in the **Make A Request** form with:
     - Date of Meetup
     - Time of Meetup
     - Location
   - Submit the form. You should be redirected to the dashboard with a success message.
   - Go to **Dashboard → My Requests** at [My Requests Page](http://linserv1.cims.nyu.edu:24452/#/dashboard/myrequests) to view the request you made.

#### Step 2: Review the Request as User 2
1. **Log into User 2's Account in an Incognito Window**:
   - Use the following credentials:
     - **Email**: `user2@gmail.com`
     - **Password**: `user2password`
   - Navigate to **Dashboard → My Listings** at [My Listings Page](http://linserv1.cims.nyu.edu:24452/#/dashboard/mylistings).
   - Click on the **Pending Requests to Review** tab. It should display User 1's request.

#### Step 3: Notifications and Approval
1. **Keep Both User Accounts Open**:
   - For **User 1**, navigate to the **Dashboard** at [Dashboard](http://linserv1.cims.nyu.edu:24452/).
   - Open the **Notifications Dropdown** tab.

2. **Approve the Request as User 2**:
   - On User 2's **My Listings** page, click **Approve** for User 1's pending request.

3. **Receive Live Notification**:
   - As soon as User 2 approves the request, User 1 should see a live notification appear in the **Notifications Dropdown** tab.

First link to github line number(s) for constructor, HOF, etc.
---
1) https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/CampusClearOut/src/pages/MyListings.jsx#L160C1-L163

Second link to github line number(s) for constructor, HOF, etc.
---
2) https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/CampusClearOut/src/pages/Listings.jsx#L61-L84

Short description for links above
---
1) When a request to deny a specific request (requestId) is made, **filter** loops through the approvedRequests array and keeps only the requests where request.id does not match the requestId that was denied, which ensures an updated list of approved requests).

2) map iterates over the listings array, transforming each listing into a Listing React component

Link to github line number(s) for schemas (db.js or models folder)
---
https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/db.mjs

Description of research topics above with points
---
- **4 points** - Used React as the frontend framework across the entire project in CampusClearOut folder 
- **2 points** - Used `bootstrap-react` as a CSS framework to develop frontend - can see in all pages within CampusClearOut folder
- **1 point** - Used `express-session` for user authentication and session management  
- **2 points** - Used `socket.io` for real-time notifications when sellers approve buyer requests to meetup
- **1 point** - Used `nodemailer` to send email verification upon registration
- **1 point** - Used `multer` middleware and `cloudinary` for image uploads when creating listings  

### Total Points: **11/10 required points**

Links to github line number(s) for research topics described above (one link per line)
---
1. **React Example**: [Listings Component](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/CampusClearOut/src/pages/Listings.jsx)  
2. **Bootstrap Example**: [Breadcrumb Example in ListingDetails Component](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/CampusClearOut/src/pages/ListingDetails.jsx#L55-L64)  
3. **express-session Example**: [Session Middleware Configuration](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/app.mjs#L102-L110)  
4. **socket.io Example**: [Real-time Notifications](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/app.mjs#L533-L537)  
5. **nodemailer Example**: [Email Verification Implementation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/app.mjs#L225-L277)  
6. **multer and Cloudinary Example**: [Image Upload Middleware](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/uploadMiddleware.js)  

Attributions
---

1. **NavBar Component**  
   - Based on the [React Bootstrap Navbar tutorial](https://react-bootstrap.netlify.app/docs/components/navbar/#home).  
   - My implementation: [NavBar.jsx, lines 34-52](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/CampusClearOut/src/components/NavBar.jsx#L34-L52).

2. **Multipage Routing**  
   - Adapted from [this YouTube tutorial](https://www.youtube.com/watch?v=qi32YwjoN2U).  
   - My implementation: [App.jsx, lines 1-110](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/CampusClearOut/src/components/NavBar.jsx#L1-L110).


3. **Authentication**  
   - Based on express-session setup from Homework 5.  
   - My implementation: [app.mjs, lines 382-424](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/app.mjs#L382-L424).

4. **File Uploads with Cloudinary and Multer**  
   - Referenced [this article](https://salmasaaiou.medium.com/file-uploads-using-cloudinary-and-multer-eb22bf928f18).  
   - My implementation: [uploadMiddleware.js](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/uploadMiddleware.js).

5. **Email Notifications with Nodemailer**  
   - Adapted from [Nodemailer Documentation](https://www.nodemailer.com/).  
   - My implementation: [app.mjs, lines 225-277](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/app.mjs#L225-L277).

6. **React Context for Authentication**  
   - Followed [this YouTube tutorial](https://www.youtube.com/watch?v=2-6K-TMA-nw).  
   - My implementation: [Auth.jsx](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/CampusClearOut/src/pages/Auth.jsx).

