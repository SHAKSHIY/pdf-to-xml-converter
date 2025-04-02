// src/index.js
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
require("dotenv").config();
require("./db"); // Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes (all routes prefixed with "/api")
app.use("/api", routes);

// Default route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the PDF-to-XML API using MongoDB!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
