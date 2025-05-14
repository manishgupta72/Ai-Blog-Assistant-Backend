const express = require("express");
const passport = require("passport");
const {
  login,
  refreshToken,
  logout,
  googleCallback,
  googleRedirect,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);
router.get("/google-redirect", googleRedirect); // optional frontend redirect

module.exports = router;
