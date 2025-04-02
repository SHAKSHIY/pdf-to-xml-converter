// src/routes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { authenticateJWT } = require("./authMiddleware");
const User = require("./models/User");
const Conversion = require("./models/Conversion");
require("dotenv").config();

const router = express.Router();

// Setup multer for file uploads (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * User Registration
 * POST /api/register
 * Body: { email, password }
 */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

/**
 * User Login
 * POST /api/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });
    
    // Create JWT payload containing user's ID and email
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

/**
 * PDF Upload and Conversion
 * POST /api/upload
 * Header: Authorization: Bearer <token>
 * Form-data: file (the PDF file)
 */
router.post("/upload", authenticateJWT, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  try {
    // Parse PDF using pdf-parse
    const data = await pdfParse(req.file.buffer);
    // Split text by form feed (\f) to separate pages
    const pages = data.text.split("\f");
    let xml = `<document>`;
    pages.forEach((page, index) => {
      xml += `<page number="${index + 1}"><![CDATA[${page.trim()}]]></page>`;
    });
    xml += `</document>`;

    // Save conversion result in the database linked to the user (optional)
    const conversion = new Conversion({
      xmlResult: xml,
      user: req.user.userId
    });
    await conversion.save();

    res.json({ xml, conversionId: conversion._id });
  } catch (error) {
    console.error("PDF conversion error:", error);
    res.status(500).json({ error: "PDF conversion failed" });
  }
});

/**
 * (Optional) Conversion History Route
 * GET /api/history
 * Header: Authorization: Bearer <token>
 */
router.get("/history", authenticateJWT, async (req, res) => {
  try {
    const conversions = await Conversion.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(conversions);
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
