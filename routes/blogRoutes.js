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
  getAllBlogs,
  suggestTitle, // Add this line
  suggestCaption,
  rewriteParagraph,
  generateBlogImage,
} = require("../controllers/blogController");

router.get("/", getAllBlogs); // ✅ fetch all blogs
router.post("/generate", auth, generateBlog);
router.post("/", auth, createBlog);
router.get("/:id", auth, getBlogById);
router.get("/user/:userId", auth, getUserBlogs);
router.put("/:id", auth, updateBlog);
router.delete("/:id", auth, deleteBlog);
router.post("/suggest-title", suggestTitle); // Add after importing
router.post("/suggest-caption", suggestCaption);
router.post("/rewrite", rewriteParagraph);
router.post("/generate-image", generateBlogImage);

module.exports = router;
