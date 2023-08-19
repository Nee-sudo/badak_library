const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  path: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PDF = mongoose.model('PDF', pdfSchema);

module.exports = PDF;
