const express = require("express");
const {
  homepage,
  adminSignup,
  adminSignin,
  createOrder,
  allClothes,
  updateCloth
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

//update-clothes
router.put("/update-cloth/:id", isAuthenticated, updateCloth);


module.exports = router;
