// 📁 backend/controllers/blogController.js
const Blog = require("../models/blogModel");
const openaiService = require("../services/openaiService");
const imageService = require("../services/imageService");
const validatePrompt = require("../utils/validatePrompt");
const redis = require("../utils/redisClient");

exports.generateBlog = async (req, res) => {
  try {
    const topic = req.body.topic.trim();
    validatePrompt(topic);

    // Check cache first
    const cached = await redis.get(`blog:generated:${topic}`);
    if (cached) {
      return res.json({ content: cached });
    }

    const content = await openaiService.generateBlogFromTopic(topic);

    // Cache the result for 1 hour
    await redis.set(`blog:generated:${topic}`, content, "EX", 3600);
    res.json({ content });
  } catch (err) {
    console.error("Generation Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const cached = await redis.get("blogs:all");
    if (cached) return res.json(JSON.parse(cached));

    const blogs = await Blog.find().sort({ createdAt: -1 });
    await redis.set("blogs:all", JSON.stringify(blogs), "EX", 300); // cache 5 min
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

exports.getUserBlogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const cached = await redis.get(`blogs:user:${userId}`);
    if (cached) return res.json(JSON.parse(cached));

    const blogs = await Blog.find({ userId }).sort({ createdAt: -1 });
    await redis.set(`blogs:user:${userId}`, JSON.stringify(blogs), "EX", 300);
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const blog = await Blog.create({ title, content, userId });

    // Invalidate cache
    await redis.del("blogs:all");
    await redis.del(`blogs:user:${userId}`);
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

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Invalidate related caches
    await redis.del("blogs:all");
    await redis.del(`blogs:user:${blog.userId}`);
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (blog) {
      await redis.del("blogs:all");
      await redis.del(`blogs:user:${blog.userId}`);
    }
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
};

// Bonus AI features (if needed)
exports.suggestTitle = openaiService.suggestTitle;
exports.suggestCaption = openaiService.suggestCaption;
exports.rewriteParagraph = openaiService.rewriteParagraph;

exports.generateBlogImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageUrl = await imageService.generateImage(prompt);
    res.json({ url: imageUrl });
  } catch (err) {
    console.error("Image Generation Error:", err);
    res.status(500).json({ error: "Image generation failed" });
  }
};
