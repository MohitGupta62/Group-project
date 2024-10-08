const orderModel = require("../models/orderModel");
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const crypto = require("crypto");

// Verify Razorpay payment and update order status
exports.verifyPayment = catchAsyncErrors(async (req, res) => {
  const { razorpay_order_id } = req.body;

  // Find the order by Razorpay order ID
  const order = await orderModel.findOne({
    razorpayOrderId: razorpay_order_id,
  });
  if (!order)
    return res.status(404).json({ success: false, message: "Order not found" });

  // Signature verification
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}`);

  // If valid, update the order as paid
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();

  res
    .status(200)
    .json({ success: true, message: "Payment verified and order paid" });
});
