const express = require("express");
const {
  homepage,
  UserSignup,
  UserLogin,
  UserLogout,
} = require("../controllers/userController");
const router = express.Router();

//homepage
router.get("/", homepage);
router.post("/signup", UserSignup);
router.post("/login", UserLogin);
router.post("/logout", UserLogout);

module.exports = router;
