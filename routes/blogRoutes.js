const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  generateBlog,
  createBlog,
  getBlogById,
  getUserBlogs,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

router.post("/generate", auth, generateBlog);
router.post("/", auth, createBlog);
router.get("/:id", auth, getBlogById);
router.get("/user/:userId", auth, getUserBlogs);
router.put("/:id", auth, updateBlog);
router.delete("/:id", auth, deleteBlog);

module.exports = router;
