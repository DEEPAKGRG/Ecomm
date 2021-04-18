// requring user model
const User = require("../models/user");

// requiring function to wrap all async function to reduce try catch function
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//  requiring error handling class
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");

const sendEmail = require("../utils/sendEmail");

const crypto = require("crypto");
const { reset } = require("nodemon");

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
  sendToken(user, 200, res);
});

// Login User  =>  /api/v1/login
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
  sendToken(user, 200, res);
});

// logout user =>api/v1/loggout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  // changed the expires time to now
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };

  res
    .status(200)
    .cookie("token", null, options)
    .json({ success: true, message: "loggout successfully" });
});

// Forget password =>api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // Finding user in database
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User Not Found with this email", 401));
  }
  //  Get reset_password_token
  const resetToken = user.getResetPasswordToken();
  user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIT Password Recovery",
      message,
    });
    console.log(user.resetPasswordToken);
    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password =>api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // taking the token from the url
  const resetToken = req.params.token;
  console.log("dhlew");
  console.log(resetToken);
  //   Encrpting the token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log(resetPasswordToken);

  //  find user in the database by hashed token and token expire must be greater than curr. time
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
  });

  if (!user) {
    return next(new ErrorHandler("Invalid token or has been Expired", 400));
  }
  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

// details of the current logged in user =>api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  console.log(req.user);
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

//change the password =>api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  console.log(req.user);
  // using select so that we can can old password from the database
  const user = await User.findById(req.user.id).select("+password");

  // while changing password taken old password also from the user to act as a authentication
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old Password does not match", 400));
  }

  user.password = req.body.password;

  await user.save();
  sendToken(user, 200, res);
});

// update user profile => api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserDate = {
    name: req.body.name,
    email: req.body.email,
  };
  // will add function to update avatar also
  const user = await User.findByIdAndUpdate(req.params.id, newUserDate, {
    runValidators: true,
    new: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true });
});

// admin routes

// get all the users by admin => api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

// get user details by admin =>api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User doesn't find with this ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// update user details by admin => api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserDate = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  // will add function to update avatar also
  const user = await User.findByIdAndUpdate(req.params.id, newUserDate, {
    runValidators: true,
    new: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true });
});

// delete a user by admin  =>api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  await user.remove();
  res.status(200).json({ success: true });
});
