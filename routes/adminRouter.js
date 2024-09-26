const express = require("express");
const {
  homepage,
  adminSignup,
  adminSignin,
  createOrder,
  allClothes,
  updateCloth,
  deleteCloth,
  findCloth,
  currentAdmin
} = require("../controllers/adminController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

//homepage
router.get("/", homepage); 

//currentamdin
router.get("/current",isAuthenticated, currentAdmin);

//signup
router.post("/signup", adminSignup);

//signin
router.post("/signin", adminSignin);

//create-cloth
router.post("/create-cloth", isAuthenticated, createOrder);

//find-cloth
router.get("/cloth/:id", isAuthenticated, findCloth)

//all-orders
router.get("/all-clothes", isAuthenticated, allClothes);

//update-clothes
router.put("/update-cloth/:id", isAuthenticated, updateCloth);

//delete-clothes
router.delete("/delete-cloth/:id", isAuthenticated, deleteCloth);


module.exports = router;
