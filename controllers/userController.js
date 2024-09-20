const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendtoken } = require("../utils/SendToken");

exports.homepage = catchAsyncErrors(async (req, res, next) => {
  res.json({ message: "Homepage" });
});

exports.UserSignup = catchAsyncErrors(async (req, res, next) => {
  const User = await new userModel(req.body).save();
  res.status(201).json(User);
});

exports.UserLogin = catchAsyncErrors(async (req, res, next) => {
  const User = await userModel
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!User) {
    next(new ErrorHandler("User with this Email not Found!"));
  }
  const isMatch = await User.comparepassword(req.body.password);
  if (!isMatch) {
    next(new ErrorHandler("Worng Credentials", 404));
  }
  sendtoken(User, 201, res);
});

// User Logout function
exports.UserLogout = catchAsyncErrors(async (req, res, next) => {
  // Clear the token cookie
  res.cookie("token", null, {
    expires: new Date(Date.now()), // Expire the cookie immediately
    httpOnly: true, // Make it HTTP only for security
  });

  res.status(200).json({ success: true, message: "Logged out successfully!" });
});
