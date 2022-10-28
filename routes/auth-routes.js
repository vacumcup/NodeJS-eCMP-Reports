const express = require("express");
const router = express.Router();

const { registerUser, loginUser, logoutUser, getMe, updateMe } = require("../controllers/auth-controllers");
const { protect } = require("../middlewares/authentication");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/me").get(protect, getMe).put(protect, updateMe);

module.exports = router;
