This repository contains the code for a Node.js Express server that provides functionality for user authentication, PDF file upload and storage using GridFS, and sentiment analysis on text content extracted from uploaded files.

Features
User Authentication:

Sign Up: Users can create an account by providing a username and password. Passwords are securely hashed using bcrypt.
Log In: Registered users can log in to obtain a JSON Web Token (JWT) for authenticated access to protected routes.
File Upload:

Users can upload PDF files or plain text content. Uploaded files are stored in a MongoDB database using GridFS.
Uploaded text content is stored directly in the database associated with the user.
Sentiment Analysis:

The application performs sentiment analysis on the text content of uploaded files using the Vader sentiment analysis library.
The sentiment scores are returned along with the text content when requested.
File Download:

Users can download the text content of their uploaded files. If the file is a PDF, it is processed to extract text content before sending.
Endpoints
User Authentication
Sign Up: POST /sign

Request Body: { "name": "username", "password": "password" }
Response: { "success": true, "authtoken": "JWT_TOKEN" } or error message.
Log In: POST /login

Request Body: { "name": "username", "password": "password" }
Response: { "success": true, "authtoken": "JWT_TOKEN" } or error message.
File Upload
Upload File/Text: POST /addPdf
Headers: { "token": "JWT_TOKEN" }
Form Data: file (optional, PDF file) or text (plain text content)
Response: { "message": "PDF file added successfully" } or error message.
File Download
Download File/Text: GET /download/:id
Headers: { "token": "JWT_TOKEN" }
Parameters: id (User ID)
Response: { "content": "text content", "msg": "sentiment analysis scores" } or error message.
Setup
Prerequisites
Node.js
MongoDB
npm (Node package manager)
Installation
Clone the repository:

sh
Copy code
git clone https://github.com/your-repo/pdf-processing-api.git
cd pdf-processing-api
Install dependencies:

sh
Copy code
npm install
Set up environment variables:

Create a .env file in the root directory with the following content:
makefile
Copy code
URL=mongodb://your-mongo-db-url
JWT_TOKEN=your-jwt-secret
Start the server:

sh
Copy code
node app.js
Usage
Sign Up a new user using the /sign endpoint.
Log In with the created user credentials using the /login endpoint to get a JWT token.
Upload a PDF file or text content using the /addPdf endpoint with the JWT token.
Download and view the uploaded file's content and sentiment analysis using the /download/:id endpoint with the JWT token.
Dependencies
Express: Web framework for Node.js.
CORS: Middleware for enabling Cross-Origin Resource Sharing.
Vader-Sentiment: Library for sentiment analysis.
Body-Parser: Middleware for parsing request bodies.
Mongoose: MongoDB object modeling tool.
GridFS-Stream: Stream-based GridFS driver for Node.js.
PDF-Parse: Library for parsing PDF files.
Bcryptjs: Library for hashing passwords.
JSONWebToken: Library for generating and verifying JWT tokens.
Multer-GridFS-Storage: Middleware for handling multipart/form-data, which is primarily used for uploading files.