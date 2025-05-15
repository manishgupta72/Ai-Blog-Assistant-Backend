const express = require("express");
const app = express();
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

// ✅ Essential for all frontend-backend CORS calls
app.use(cors());
app.use(express.json());

// ✅ This makes `/blog/generate` etc. accessible
app.use("/blog", blogRoutes);
app.use("/api/auth", authRoutes);

// ✅ Health check (test this from browser)
app.get("/", (req, res) => {
  res.send("API is working ✅");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
