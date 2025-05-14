const fetch = require("node-fetch");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const BASE_HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL,
  "X-Title": "AI Blog Assistant",
};

const callOpenRouter = async (prompt) => {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: BASE_HEADERS,
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("OpenRouter Error:", data);
    throw new Error(data.error?.message || "OpenRouter request failed");
  }
  return data.choices[0].message.content.trim();
};

exports.generateBlogFromTopic = async (topic) => {
  const prompt = `Write a blog on: ${topic}`;
  return await callOpenRouter(prompt);
};

exports.suggestTitle = async (req, res) => {
  try {
    const { content } = req.body;
    const prompt = `Suggest a short, catchy title for the following blog content:\n\n${content}`;
    const title = await callOpenRouter(prompt);
    res.json({ title });
  } catch (err) {
    console.error("Title Suggestion Error:", err);
    res.status(500).json({ error: "Failed to suggest title" });
  }
};

exports.rewriteParagraph = async (req, res) => {
  try {
    const { paragraph, tone } = req.body;
    const prompt = `Rewrite the following paragraph in a ${tone} tone:\n\n${paragraph}`;
    const rewritten = await callOpenRouter(prompt);
    res.json({ rewritten });
  } catch (err) {
    console.error("Rewrite Error:", err);
    res.status(500).json({ error: "Failed to rewrite paragraph" });
  }
};

exports.suggestCaption = async (req, res) => {
  try {
    const { description } = req.body;
    const prompt = `Write a short, SEO-friendly image caption for:\n\n${description}`;
    const caption = await callOpenRouter(prompt);
    res.json({ caption });
  } catch (err) {
    console.error("Caption Suggestion Error:", err);
    res.status(500).json({ error: "Failed to suggest caption" });
  }
};
