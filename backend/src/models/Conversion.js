// backend/src/models/Conversion.js
const mongoose = require("mongoose");

const ConversionSchema = new mongoose.Schema({
  xmlResult: { type: String, required: true },
  originalText: { type: String, required: true },
  pdfName: { type: String },         // PDF filename for history display
  timestamp: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Conversion", ConversionSchema);
