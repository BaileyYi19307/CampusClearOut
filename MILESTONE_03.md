Milestone 03
===

Repository Link
---
https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307

URL for deployed site 
---
http://linserv1.cims.nyu.edu:24452

URL for form 1 (from previous milestone) 
---
http://linserv1.cims.nyu.edu:24452/#/dashboard/mylistings/create

Special Instructions for Form 1
---
- **Create a Listing**: Navigate to the form at [Create New Listing](http://linserv1.cims.nyu.edu:24452/#/dashboard/mylistings/create) to submit a new listing. After submission, the listing will appear on both the [My Listings page](http://linserv1.cims.nyu.edu:24452/#/dashboard/mylistings) and the [Main Listings page](http://linserv1.cims.nyu.edu:24452/#/).

- **Deleting Listings**: Listings can be deleted directly from the [My Listings page](http://linserv1.cims.nyu.edu:24452/#/dashboard/mylistings).

URL for form 2 (for current milestone)
---
http://linserv1.cims.nyu.edu:24452/#/register

Special Instructions for Form 2
---
Registering a New User: To create a new account, navigate to the [Registration page](http://linserv1.cims.nyu.edu:24452/#/register). Fill in the required fields for Username, Email Address, and Password. Once submitted, the registration will be successful, and you will immediately see a list of all registered users, including the newly registered user.

URL(s) to github repository with commits that show progress on research
--- 
Link to Registration Page Development:
[View the code for the Registration Page](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-BaileyYi19307/blob/master/CampusClearOut/src/pages/Register.jsx#L1-L63)
- Continued working on React for frontend development, focusing on the registration page. Used useState and useEffect hooks to manage form data and submission flow.
- Continued integrating Bootstrap for styling the registration form

I spent a lot of time researching authentication and CORS issues when connecting the frontend and backend. I managed to get everything working locally by setting up a proxy server with Vite and using React Context for global state management, which handled the login and registration process. However, I ran into issues when trying to deploy it—CORS problems stopped the authentication flow from working as expected in production. I’m planning to either ask for more help to figure it out or look into switching to Next.js, which might handle these issues better in a deployed environment.

Attempt at User Authentication Setup (Local Development Only)
What was done:
- Implemented user authentication using React for local development.
- Used a proxy server with Vite to redirect fetch calls to the backend running on `localhost:3000`.
- Set up global state for user registration, login, and logout using `AuthContext` to store and manage the user's login status.
- Created an `AuthProvider` component to provide authentication state to the whole app.
- Used `express-session` to handle session management (instead of Passport.js).
- When the app starts, it checks if the user is logged in by calling the `/api/current-user` endpoint.


## Steps to Test the App:

1. **Clone the Repository**:  
   Clone the repository to your local machine using the following command:  
   [GitHub Repository](https://github.com/BaileyYi19307/final-project-duplicate).

2. **Install Dependencies**:  
   Navigate to the project folder and install the necessary dependencies by running:  
   ```bash
   npm install
   ```

3. **Set Up the .env File**:  
   The `.env` file is tracked in the repository and should contain the correct configuration for connecting to the MongoDB database. The database is named `final-project-duplicate`.

4. **Run the Backend**:  
   Open a terminal window, navigate to the project directory, and start the backend by running:  
   ```bash
   node app.mjs
   ```

5. **Run the Frontend**:  
   In another terminal window, navigate to the `CampusClearOut` directory, then start the frontend by running:  
   ```bash
   npm run dev
   ```

6. **Test User Registration**:  
   On the frontend, click the **Register** button to create a new account.

7. **Login**:  
   After registering, you will be redirected to the login page. Enter the correct credentials for the newly registered account.

8. **Homepage**:  
   Once logged in successfully, you will be redirected to the homepage. The username should appear in the top right corner of the page.

9. **Logout**:  
   Clicking on the username in the top right corner will display a logout option. Clicking the **Logout** button will log you out and redirect you back to the login page.


References 
---
