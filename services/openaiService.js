// backend/services/openaiService.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

exports.generateBlogFromTopic = async (topic) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `Write a blog on: ${topic}` }],
  });
  return response.choices[0].message.content;
};
