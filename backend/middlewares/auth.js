const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/user");

// Creating middleware to check authenticated users
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }
  const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
  req.user = await User.findById(decoded.id);
  console.log(req.user._id);
  next();
});

// creating middleware to handling users roles
// Handling users roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to acccess this resource`,
          403
        )
      );
    }
    next();
  };
};
