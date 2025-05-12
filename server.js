// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const blogRoutes = require("./routes/blogRoutes");
app.use("/api/blog", blogRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(4000, () => console.log("Server running on port 4000"));
