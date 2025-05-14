const redis = require("../utils/redisClient");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email } = req.body;
  const user = { id: "user123", email }; // Mock user

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await redis.set(user.id, refreshToken);

  res.json({ accessToken, refreshToken });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const stored = await redis.get(decoded.id);

    if (stored !== refreshToken) throw new Error("Invalid refresh");

    const accessToken = generateAccessToken({ id: decoded.id });
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ error: "Unauthorized" });
  }
};

exports.logout = async (req, res) => {
  const { userId } = req.body;
  await redis.del(userId);
  res.json({ message: "Logged out" });
};

exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;
    console.log("✅ Google User:", user); // 🔍 Add this

    if (!user || !user.id) {
      return res.status(400).json({ error: "User info missing" });
    }

    // Generate access & refresh tokens
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // Store refreshToken in Redis or DB if needed
    await redis.set(user.id, refreshToken);

    // 🔥 REDIRECT BACK TO FRONTEND WITH TOKENS
    // 👇 Add user.name to the redirect URL
    const redirectURL = `${
      process.env.NEXT_PUBLIC_APP_URL
    }/login?accessToken=${accessToken}&refreshToken=${refreshToken}&userName=${encodeURIComponent(
      user.name
    )}`;
    return res.redirect(redirectURL);
  } catch (error) {
    console.error("❌ Google Callback Error:", error);
    res.status(500).json({ error: "OAuth failed" });
  }
};

exports.googleRedirect = (req, res) => {
  res.send("Google Login Successful");
};
