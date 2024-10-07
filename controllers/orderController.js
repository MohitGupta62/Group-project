const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const orderModel = require("../models/orderModel");

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

    await newOrder.save();

    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

exports.getOrderById = catchAsyncErrors(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) return res.status(404).json({ msg: "Order not found" });
  res.json(order);
});
