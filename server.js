// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const blogRoutes = require("./routes/blogRoutes");
app.use("/api/blog", blogRoutes);

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.listen(4000, () => console.log("Server running on port 4000"));
