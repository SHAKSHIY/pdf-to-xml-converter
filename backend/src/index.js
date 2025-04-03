// // src/index.js
// const express = require("express");
// const cors = require("cors");
// const routes = require("./routes");
// require("dotenv").config();
// require("./db"); // Connect to MongoDB

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // API Routes (all routes prefixed with "/api")
// app.use("/api", routes);

// // Default route for testing
// app.get("/", (req, res) => {
//   res.send("Welcome to the PDF-to-XML API using MongoDB!");
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const xmlbuilder = require("xmlbuilder");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const http = require("http");
const WebSocket = require("ws");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const { authenticateJWT } = require("./authMiddleware");
const Conversion = require("./models/Conversion");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Create HTTP server and attach WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  ws.on("close", () => console.log("WebSocket client disconnected"));
});

function broadcastStatus(status) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(status));
    }
  });
}

// ----------------------
// Authentication Endpoints
// ----------------------

// Registration Endpoint
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed", details: error.message });
  }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid credentials" });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

// ----------------------
// Advanced PDF Conversion and Other Endpoints
// ----------------------

// Advanced PDF conversion endpoint (requires authentication)
// Inside your /api/convert endpoint in backend/src/index.js
app.post("/api/convert", authenticateJWT, async (req, res) => {
  if (!req.files || !req.files.pdf) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    broadcastStatus({ progress: 10, message: "Starting conversion..." });
    const data = await pdfParse(req.files.pdf.data);
    broadcastStatus({ progress: 40, message: "PDF text extracted" });

    // Advanced parsing: split into pages and paragraphs
    const pages = data.text.split("\f");
    const documentXml = xmlbuilder.create("document");
    pages.forEach((pageText, pIndex) => {
      const pageElement = documentXml.ele("page", { number: pIndex + 1 });
      const paragraphs = pageText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
      paragraphs.forEach((para) => {
        pageElement.ele("paragraph").dat(para.trim());
      });
    });
    const xmlOutput = documentXml.end({ pretty: true });
    broadcastStatus({ progress: 90, message: "XML conversion completed" });

    // Save conversion history with timestamp and PDF name
    const conversion = new Conversion({
      xmlResult: xmlOutput,
      originalText: data.text,
      pdfName: req.files.pdf.name, // NEW: store the original file name
      user: req.user.userId,
      timestamp: new Date()
    });
    await conversion.save();

    broadcastStatus({ progress: 100, message: "Conversion saved" });
    res.json({ xml: xmlOutput, originalText: data.text, conversionId: conversion._id });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "PDF conversion failed", details: error.message });
  }
});

// Advanced filtering/search in conversion history
app.get("/api/history", authenticateJWT, async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort = req.query.sort || "desc";
    const regex = new RegExp(search, "i");
    const conversions = await Conversion.find({ 
      user: req.user.userId, 
      $or: [{ originalText: regex }, { xmlResult: regex }]
    }).sort({ timestamp: sort === "asc" ? 1 : -1 });
    res.json(conversions);
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Profile endpoint remains unchanged
app.get("/api/profile", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("email _id");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Advanced PDF-to-XML API using MongoDB and WebSockets!");
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});