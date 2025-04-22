# Assignment 6 Web API

## Overview

This project is a RESTful API built with Node.js, Express, and MongoDB that provides user authentication and management functionalities.

## Features

- User authentication (signup, login, token refresh)
- Role-based access control (user, moderator, admin)
- User profile management
- Password reset functionality
- Rate limiting for security

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository

   ```
   git clone <repository-url>
   cd Assignment-6-web
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/jwt
   JWT_SECRET=your_access_token_secret
   REFRESH_TOKEN=your_refresh_token_secret
   JWT_EXPIRATION=1h
   JWT_REFRESH_EXPIRATION=1d
   ```

### Setting Up dotenv

The project uses the `dotenv` package to manage environment variables. Here's how to set it up properly:

1. Install dotenv (already included in dependencies):

   ```
   npm install dotenv
   ```

2. Create a `.env` file in the project root directory with the required variables:

   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/yourdatabase
   JWT_SECRET=your_secret_key
   JWT_EXPIRATION=1h
   REFRESH_TOKEN=your_refresh_secret_key
   REFRESH_TOKEN_EXPIRATION=1d
   ```

3. Generate strong secret keys for your tokens:

   ```bash
   # Run these commands in your terminal to generate random strings
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Copy the output from these commands to use as your JWT_SECRET and REFRESH_TOKEN.

4. Ensure the `.env` file is included in your `.gitignore` to keep your secrets safe:

   ```
   # .gitignore
   .env
   ```

5. In your application code, dotenv is typically configured at the entry point:
   ```javascript
   require("dotenv").config();
   ```

### Token Expiration

When an access token expires, the client should:

1. Detect the 403 response with "Token invalid or expired" message
2. Use the refresh token to request a new access token via the `/api/v1/auth/refresh-token` endpoint
3. Use the new access token for subsequent API requests

If both tokens expire, the user must log in again with their credentials.

### Dependencies

if you have not done npm i and want to install manually, then these are the dependancies used:

```
1. npm init -y
2. npm i express dotenv mongoose morgan express-rate-limit nodemon bcrypt jsonwebtoken
```

## Running the Application

```
npm start
```

The server will be running at http://localhost:3000

## API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/public` - Public route
- `GET /api/v1/auth/protected` - Protected route (requires authentication)
- `GET /api/v1/auth/moderator` - Moderator route (requires moderator role)
- `GET /api/v1/auth/admin` - Admin route (requires admin role)

### User Management Endpoints

- `GET /api/v1/users` - Get all users (admin only)
- `PATCH /api/v1/users/profile` - Update own profile
- `PATCH /api/v1/users/{id}/role` - Update user role (admin only)
- `PATCH /api/v1/users/reset-password` - Reset password

## Testing the API

You can use the provided `requests.rest` file with the VS Code REST Client extension to test the API endpoints. Make sure to:

1. Install the "REST Client" extension in VS Code
2. Start the server
3. Update the variables in the `requests.rest` file with valid tokens and IDs
4. Click "Send Request" above each request definition to execute it

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Author

Amr Mamdouh

## Acknowledgments

- Express.js
- MongoDB
- JWT for authentication
