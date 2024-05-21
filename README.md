# PDF Processing and User Authentication API

This repository contains the code for a Node.js Express server that provides functionality for user authentication, PDF file upload and storage using GridFS, and sentiment analysis on text content extracted from uploaded files.

## Features

1. **User Authentication**:
   - **Sign Up**: Users can create an account by providing a username and password. Passwords are securely hashed using bcrypt.
   - **Log In**: Registered users can log in to obtain a JSON Web Token (JWT) for authenticated access to protected routes.

2. **File Upload**:
   - Users can upload PDF files or plain text content. Uploaded files are stored in a MongoDB database using GridFS.
   - Uploaded text content is stored directly in the database associated with the user.

3. **Sentiment Analysis**:
   - The application performs sentiment analysis on the text content of uploaded files using the Vader sentiment analysis library.
   - The sentiment scores are returned along with the text content when requested.

4. **File Download**:
   - Users can download the text content of their uploaded files. If the file is a PDF, it is processed to extract text content before sending.

## Endpoints

### User Authentication

- **Sign Up**: `POST /sign`
  - Request Body: `{ "name": "username", "password": "password" }`
  - Response: `{ "success": true, "authtoken": "JWT_TOKEN" }` or error message.

- **Log In**: `POST /login`
  - Request Body: `{ "name": "username", "password": "password" }`
  - Response: `{ "success": true, "authtoken": "JWT_TOKEN" }` or error message.

### File Upload

- **Upload File/Text**: `POST /addPdf`
  - Headers: `{ "token": "JWT_TOKEN" }`
  - Form Data: `file` (optional, PDF file) or `text` (plain text content)
  - Response: `{ "message": "PDF file added successfully" }` or error message.

### File Download

- **Download File/Text**: `GET /download/:id`
  - Headers: `{ "token": "JWT_TOKEN" }`
  - Parameters: `id` (User ID)
  - Response: `{ "content": "text content", "msg": "sentiment analysis scores" }` or error message.

## Setup

### Prerequisites

- Node.js
- MongoDB
- npm (Node package manager)
## Usage

1. **Sign Up** a new user using the `/sign` endpoint.
2. **Log In** with the created user credentials using the `/login` endpoint to get a JWT token.
3. **Upload** a PDF file or text content using the `/addPdf` endpoint with the JWT token.
4. **Download** and view the uploaded file's content and sentiment analysis using the `/download/:id` endpoint with the JWT token.

## Dependencies

- Express: Web framework for Node.js.
- CORS: Middleware for enabling Cross-Origin Resource Sharing.
- Vader-Sentiment: Library for sentiment analysis.
- Body-Parser: Middleware for parsing request bodies.
- Mongoose: MongoDB object modeling tool.
- GridFS-Stream: Stream-based GridFS driver for Node.js.
- PDF-Parse: Library for parsing PDF files.
- Bcryptjs: Library for hashing passwords.
- JSONWebToken: Library for generating and verifying JWT tokens.
- Multer-GridFS-Storage: Middleware for handling multipart/form-data, which is primarily used for uploading files.

