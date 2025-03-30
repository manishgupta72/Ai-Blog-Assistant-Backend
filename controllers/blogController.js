// backend/controllers/blogController.js (with CRUD)
const Blog = require("../models/blogModel");
const { generateBlogFromTopic } = require("../services/openaiService");
const validatePrompt = require("../utils/validatePrompt");

exports.generateBlog = async (req, res) => {
  try {
    console.log("Received Topic:", req.body.topic); // ✅ add this
    validatePrompt(req.body.topic);
    const content = await generateBlogFromTopic(req.body.topic);
    res.json({ content });
  } catch (err) {
    console.error("Generation Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    console.log("Fetched Blogs:", blogs); // ✅ add this
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const blog = await Blog.create({ title, content, userId });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to create blog" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};

exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
};
