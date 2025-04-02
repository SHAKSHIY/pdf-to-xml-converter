// src/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    // Expected format: "Bearer token"
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user; // Attach user info to request
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { authenticateJWT };
