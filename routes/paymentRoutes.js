const express = require("express");
const { verifyPayment } = require("../controllers/paymentController"); // Import the verifyPayment function
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

// Route to verify payment
router.post("/payment/verify", isAuthenticated, verifyPayment);

module.exports = router;
