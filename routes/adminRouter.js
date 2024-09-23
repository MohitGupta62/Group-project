const express = require("express");
const {
  homepage,
  adminSignup,
  adminSignin,
  createOrder,
  allClothes,
} = require("../controllers/adminController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

//homepage
router.get("/", homepage);

//signup
router.post("/signup", adminSignup);

//signin
router.post("/signin", adminSignin);

//create-cloth
router.post("/create-cloth", isAuthenticated, createOrder);

//all-orders
router.get("/all-clothes", isAuthenticated, allClothes);

module.exports = router;
