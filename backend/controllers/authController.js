// requring user model
const User = require("../models/user");

// requiring function to wrap all async function to reduce try catch function
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//  requiring error handling class
const ErrorHandler = require("../utils/errorHandler");

// creating new user =>/api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "5343",
      url:
        "https://images.unsplash.com/photo-1618583325251-dd1c52a6685e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1868&q=80",
    },
  });
  const token = user.getJwtToken();
  res.status(201).json({ success: true, token });
});

// Login User  =>  /a[i/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checks if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }
  // Finding user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  // Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  const token = user.getJwtToken();
  res.status(201).json({ success: true, user, token });
});
