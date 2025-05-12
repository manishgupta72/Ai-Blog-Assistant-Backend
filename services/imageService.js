const fetch = require("node-fetch");

exports.generateImage = async (prompt) => {
  const response = await fetch("https://api.deepai.org/api/text2img", {
    method: "POST",
    headers: {
      "Api-Key": process.env.DEEPAI_API_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ text: prompt }),
  });

  const data = await response.json();
  if (!data.output_url) {
    throw new Error("Image generation failed");
  }

  return data.output_url;
};
