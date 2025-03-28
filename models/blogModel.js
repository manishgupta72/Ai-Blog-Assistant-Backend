// backend/models/blogModel.js (Mongoose Example)
const mongoose = require("mongoose");
const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Blog", BlogSchema);
