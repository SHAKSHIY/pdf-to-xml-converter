# PDF-to-XML Converter

## Overview

This project is a full-stack PDF-to-XML converter that allows users to upload PDFs, convert them into structured XML, and manage their conversion history.
It includes real-time progress updates, advanced PDF parsing, an interactive file viewer, and user authentication with JWT.

## Features

- ✅ User Authentication (Login/Register with JWT)
- ✅ PDF Upload and Conversion to XML
- ✅ Real-time Conversion Progress Updates via WebSocket
- ✅ Advanced PDF Parsing (Retains tables, lists, paragraphs, and headers)
- ✅ Multi-Page PDF Support (Processes PDFs with multiple pages)
- ✅ XML Output That Mirrors PDF Structure and Formatting
- ✅ Interactive Multi-Page Viewer for Both PDFs and XML
- ✅ Original PDF and XML Side-by-Side Preview
- ✅ Conversion History Management (Stored in MongoDB)
- ✅ Search and Filter in Conversion History
- ✅ Sidebar Navigation for Quick Access to Previous Conversions
- ✅ Basic and Comprehensive Error Handling (Including edge cases)
- ✅ User Profile Management
- ✅ Responsive UI (Optimized for desktop and mobile)
- ✅ Copy and Download Converted XML

## Technology Choices and Reasoning
| **Technology**        | **Reason for Choice**                          |
|----------------------|--------------------------------------|
| **Frontend:** React.js | Provides a fast, modular, and interactive UI |
| Tailwind CSS        | Ensures a clean and responsive design |
| React Router       | Enables seamless navigation between pages |
| WebSocket         | Real-time status updates for better UX |
| **Backend:** Node.js + Express.js | Scalable and efficient server-side framework |
| MongoDB + Mongoose | Flexible NoSQL database to store user data and history |
| JWT Authentication | Secure user authentication and authorization |
| pdf-parse & xmlbuilder | Handles PDF extraction and structured XML conversion |

## Setup and Installation

1️⃣ Clone the Repository
- git clone https://github.com/SHAKSHIY/pdf-to-xml-converter.git
- cd pdf-to-xml-converter

2️⃣ Install Dependencies

Backend:
- cd backend
- npm install

Frontend:
- cd frontend
- npm install

3️⃣ Configure Environment Variables

Create a .env file in the backend folder and add:
- PORT=5000
- MONGO_URI=mongodb+srv://your_mongodb_url
- JWT_SECRET=your_secret_key

4️⃣ Run the Application

Start Backend
- cd backend
- npm start

Start Frontend
- cd frontend
- npm start

5️⃣ Access the Application
- Go to http://localhost:3000 in your browser.

## Challenge Level Implemented?
This project successfully implements all the Level 1 and Level 2 requirements, along with selected features from Level 3. Below is a summary of what’s covered:

✅ Level 1 (Basic)

✔️ Email/password-based login and registration

✔️ PDF upload functionality

✔️ Basic PDF-to-XML conversion (text extraction)

✔️ On-screen XML display

✔️ Copy and download XML options

✔️ Conversion history stored in MongoDB

✔️ List view for past conversions

✅ Level 2 (Intermediate)

✔️ JWT-based authentication and protected routes

✔️ Improved conversion: maintains paragraphs and headers

✔️ Multi-page display of PDFs and XML

✔️ Sidebar navigation for conversion history

✔️ Dual-pane preview: Original PDF and converted XML

✔️ Basic error handling and email/password validation

✔️ User profile management and dashboard

🔹 Level 3 (Partial)

✅ Real-time conversion progress with WebSocket

✅ Responsive design for desktop and mobile

✅ Interactive viewer for PDF and XML

✅ Basic XML formatting for structure mirroring

This positions the project solidly at Level 2, with progress toward Level 3.

## Usage
- Sign up or log in to the application.

- Upload a PDF file using the file uploader.

- Click "Convert PDF" to process the document.

- Monitor real-time progress updates during conversion.

- View the XML output, copy it, or download it as a file.

- Access past conversions from the history section with search and filter options.

- Preview both the original PDF and the converted XML side by side.

- Manage your profile details from the user dashboard.

## API Endpoints

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

## Approach to PDF-to-XML Conversion

1. PDF Extraction:

- Uses pdf-parse to extract text from uploaded PDFs.

- Splits PDF into pages and paragraphs for structured processing.

2. XML Conversion:

- Converts extracted text into XML format using xmlbuilder.

- Maintains headers, lists, tables, and paragraph structures.

3. Real-Time Progress Updates:

- Implements WebSocket for live status tracking.

- Users see a progress bar and conversion updates in real time.

4. Interactive Multi-Page Viewer:

- Enables viewing both original PDF and converted XML side by side.

- Supports multi-page documents with navigation between pages.

## Assumptions & Limitations

✔️ Assumptions:

- Users upload well-structured PDFs (with proper text formatting).

- PDF-to-XML conversion is not 100% perfect but maintains most structures.

⚠️ Limitations:

- Complex PDFs with heavy graphics may lose formatting.

- Handwritten or scanned PDFs are not supported (OCR can be added later).

- Large PDFs (100+ pages) might take longer to process.

## Future Enhancements
- Drag-and-drop PDF upload
- AI-based PDF parsing for better structure retention
- Support for more document formats (e.g., DOCX, TXT)
- Dark mode for improved UI accessibility
- Export XML to other formats (CSV, JSON, etc.)

## Conclusion
This PDF-to-XML Converter is a robust, user-friendly, and efficient tool that allows users to convert PDFs while maintaining the document structure.
With real-time updates, structured XML output, and an interactive UI, this project ensures a seamless user experience. 
