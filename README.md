# PDF-to-XML Converter

## Overview

This project is a web-based application that allows users to upload PDF files and convert them into structured XML format while preserving the document's structure and content.

## Features

User authentication (login/register functionality)

File upload for PDF documents

Conversion of PDF content into XML format

Storage of conversion history

Option to copy or download the XML file

Responsive UI built with React

## Tech Stack

Frontend: React, Axios, Tailwind CSS

Backend: Node.js, Express.js, Multer, pdf-parse

Database: MongoDB (Mongoose ORM)

Authentication: JSON Web Token (JWT)

## Installation & Setup

Prerequisites

Node.js and npm installed

MongoDB running locally or through a cloud provider (MongoDB Atlas)

## Backend Setup

Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Create a .env file and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Start the backend server:

npm start

## Frontend Setup

Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the frontend server:

npm start

## Usage

Sign up or log in to the application.

Upload a PDF file using the file uploader.

Click "Convert PDF" to process the document.

View the XML output, copy it, or download it as a file.

Access past conversions from the history section.

# API Endpoints

## Authentication

POST /api/auth/register - Register a new user

POST /api/auth/login - Authenticate and receive a JWT token

## File Upload & Conversion

POST /api/upload - Upload a PDF and convert it to XML

GET /api/history - Fetch conversion history
