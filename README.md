# PDF-to-XML Converter

## Overview

This project is a full-stack PDF-to-XML converter that allows users to upload PDF files, convert them into structured XML, and manage their conversion history. It features user authentication, real-time conversion status, an interactive file viewer, and advanced filtering/search options.

## Features

✅ User Authentication (Login/Register with JWT)
✅ PDF Upload and Conversion to XML
✅ Real-time Conversion Progress Updates via WebSocket
✅ Advanced PDF Parsing (Retains tables, lists, paragraphs, and headers)
✅ Multi-Page PDF Support (Processes PDFs with multiple pages)
✅ XML Output That Mirrors PDF Structure and Formatting
✅ Interactive Multi-Page Viewer for Both PDFs and XML
✅ Original PDF and XML Side-by-Side Preview
✅ Conversion History Management (Stored in MongoDB)
✅ Search and Filter in Conversion History
✅ Sidebar Navigation for Quick Access to Previous Conversions
✅ Basic and Comprehensive Error Handling (Including edge cases)
✅ User Profile Management
✅ Responsive UI (Optimized for desktop and mobile)
✅ Copy and Download Converted XML

## Tech Stack
Frontend:
React.js (with hooks and context API)

Tailwind CSS for UI styling

React Router for navigation

WebSocket for real-time updates

Backend:
Node.js with Express.js

MongoDB + Mongoose for database

JWT for authentication

WebSocket for live conversion status

pdf-parse & xmlbuilder for PDF processing

## Setup and Installation

1️⃣ Clone the Repository
git clone https://github.com/yourusername/pdf-to-xml-converter.git
cd pdf-to-xml-converter

2️⃣ Install Dependencies
Backend:
cd backend
npm install
Frontend:
cd frontend
npm install

3️⃣ Configure Environment Variables
Create a .env file in the backend folder and add:
PORT=5000
MONGO_URI=mongodb+srv://your_mongodb_url
JWT_SECRET=your_secret_key

4️⃣ Run the Application
Start Backend
cd backend
npm start
Start Frontend
cd frontend
npm start

5️⃣ Access the Application
Go to http://localhost:3000 in your browser.

## Usage
Sign up or log in to the application.

Upload a PDF file using the file uploader.

Click "Convert PDF" to process the document.

Monitor real-time progress updates during conversion.

View the XML output, copy it, or download it as a file.

Access past conversions from the history section with search and filter options.

Preview both the original PDF and the converted XML side by side.

Manage your profile details from the user dashboard.

# API Endpoints

## Authentication

POST /api/auth/register - Register a new user

POST /api/auth/login - Authenticate and receive a JWT token

## PDF Conversion
POST /api/convert → Convert PDF to XML

GET /api/history → Fetch conversion history

GET /api/profile → Get user profile

## Advanced Features
Real-time progress tracking with WebSocket

Multi-page document structure preservation

Responsive and mobile-friendly UI
