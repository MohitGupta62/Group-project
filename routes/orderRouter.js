const express = require("express");
const { createOrder, getOrderById } = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticated } = require("../middlewares/auth");

router.post("/", isAuthenticated, createOrder);
router.get("/:id", isAuthenticated, getOrderById);

module.exports = router;
