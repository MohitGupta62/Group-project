const mongoose = require("mongoose");

const orderModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      //   required: true,
    },
    items: [
      {
        cloth: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Cloth", // Assuming you have a Cloth model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Ensure at least one item is ordered
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      //   required: true,
    },
    razorpayOrderId: { type: String }, // Razorpay ka order ID yaha store hoga
    isPaid: { type: Boolean, default: false }, // Payment status
    paidAt: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderModel);
