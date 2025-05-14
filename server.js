// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
require("./config/passport");
const passport = require("passport");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/api/blog", blogRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Blog API Running"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(4000, () => console.log("Server running on port 4000"));
