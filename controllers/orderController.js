const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const orderModel = require("../models/orderModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Razorpay ko initialize karo
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Razorpay Secret
});

exports.createOrder = catchAsyncErrors(async (req, res) => {
  const userId = req.id; // Get the user ID from the request
  const items = req.body.items; // Items should be an array of objects

  try {
    // Calculate the total amount
    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Create the new order
    const newOrder = await orderModel.create({
      user: userId,
      items: items,
      totalAmount: totalAmount,
    });

    // Ab Razorpay ka order create karo
    const options = {
      amount: totalAmount * 100, // Paise me convert karo (Rs se paise)
      currency: "INR", // INR ya ap jo currency use kar rahe ho
      receipt: `receipt_${newOrder._id}`, // Receipt ID (optional)
    };

    const razorpayOrder = await razorpay.orders.create(options); // Razorpay order create hota hai

    console.log(razorpayOrder);

    newOrder.razorpayOrderId = razorpayOrder.id; // Razorpay order ID save karo
    await newOrder.save(); // Order database me save karo

    return res.status(201).json({
      success: true,
      order: newOrder,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

exports.getOrderById = catchAsyncErrors(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) return res.status(404).json({ msg: "Order not found" });
  res.json(order);
});
