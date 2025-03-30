const fetch = require("node-fetch");

exports.generateBlogFromTopic = async (topic) => {
  console.log("Generating blog for topic 1:", topic);

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Blog Assistant",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Write a blog on: ${topic}`,
          },
        ],
      }),
    }
  );

  const data = await response.json();

  console.log("Generating blog for topic 2:", topic);

  if (!response.ok) {
    console.error("API Error:", data);
    throw new Error(data.error?.message || "OpenRouter request failed");
  }

  return data.choices[0].message.content;
};
