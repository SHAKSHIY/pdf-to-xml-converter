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
const upload = multer({ storage: multer.memoryStorage() });

/**
 * User Registration
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
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

/**
 * Get User Profile
 * GET /api/profile
 */
router.get("/profile", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("email _id");
    res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

/**
 * PDF Upload and Conversion (Improved)
 */
router.post("/upload", authenticateJWT, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  try {
    const data = await pdfParse(req.file.buffer);
    const originalText = data.text; // Save original text for preview
    const pages = data.text.split("\f"); // Split pages by form feed
    let xml = `<document>`;
    pages.forEach((page, index) => {
      // Further split page into paragraphs by double newlines
      const paragraphs = page.split(/\n\s*\n/).filter(p => p.trim().length > 0);
      xml += `<page number="${index + 1}">`;
      paragraphs.forEach(paragraph => {
        xml += `<paragraph><![CDATA[${paragraph.trim()}]]></paragraph>`;
      });
      xml += `</page>`;
    });
    xml += `</document>`;

    const conversion = new Conversion({
      xmlResult: xml,
      originalText,
      user: req.user.userId
    });
    await conversion.save();

    res.json({ xml, originalText, conversionId: conversion._id });
  } catch (error) {
    console.error("PDF conversion error:", error);
    res.status(500).json({ error: "PDF conversion failed" });
  }
});

/**
 * Get Conversion History
 * GET /api/history
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
