const express = require("express");
const {
  homepage,
  UserSignup,
  UserLogin,
  UserLogout,
  updatePassword,
  getUser,
  updateProfile,
} = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

//homepage
router.get("/", homepage);
router.post("/signup", UserSignup);
router.post("/login", UserLogin);
router.post("/logout", isAuthenticated, UserLogout);
router.put("/update-password", isAuthenticated, updatePassword);
router.get("/me", isAuthenticated, getUser);
router.put("/update/me", isAuthenticated, updateProfile);

module.exports = router;
