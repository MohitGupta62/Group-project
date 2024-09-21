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

exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.id);
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }
  const user = await userModel.findById(req.id).select("+password");
  const isPasswordMatched = await user.comparepassword(currentPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Current Password", 400));
  }
  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler(
        "New Password And Confirm New Password is not Match",
        400
      )
    );
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Updated",
  });
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  // newUserdata object bana rahe hain jo user ke profile details store karega
  const newUserdata = {
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
    gender: req.body.gender,
    profileImage: req.body.profileImage,
  };

  // User profile ko update kar rahe hain database mein
  const user = await userModel.findByIdAndUpdate(req.id, newUserdata, {
    runValidators: true,
    useFindAndModify: false,
  });

  // Success response bhej rahe hain
  res.status(200).json({
    success: true,
    message: "Profile Updated",
    newUserdata,
  });
});
