// backend/utils/validatePrompt.js
module.exports = function (topic) {
  if (!topic || topic.length < 5 || topic.length > 100) {
    throw new Error(
      "Invalid topic. Length must be between 5 and 100 characters."
    );
  }
};
