const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncErrors } = require("./catchAsyncError");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    next(new ErrorHandler("Please Login to Access the Resource", 401));
  }

  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  req.id = id;
  next();
});
