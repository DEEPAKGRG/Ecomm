// requring user model
const User = require("../models/user");

// requiring function to wrap all async function to reduce try catch function
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//  requiring error handling class
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");

const sendEmail = require("../utils/sendEmail");

const crypto = require("crypto");
var cloudinary = require("cloudinary").v2;

// creating new user =>/api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  // saving image in the avatars folder of cloudinary
  const result = await cloudinary.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
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
    .json({ success: true, message: "logout successfully" });
});

var nodemailer = require("nodemailer");
// Forget password =>api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // Finding user in database
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User Not Found with this email", 401));
  }
  //  Get reset_password_token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "deepakgrg30111@gmail.com",
      pass: process.env.PASSWORD,
    },
  });

  var mailOptions = {
    from: "deepakgrg30111@gmail.com",
    to: req.body.email,
    subject: "Sending Email using Node.js",
    text: message,
  };

  transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500));
    } else {
      res.status(200).json({
        success: true,
        message: `Email sent to: ${user.email}`,
      });
    }
  });
});

// Reset password =>api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  res.status(200).json({
    success: true,
  });
  // sendToken(user, 200, res);
});

// details of the current logged in user =>api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.user);
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

// Update user profile   =>   /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Update avatar
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const image_id = user.avatar.public_id;

    // delete old pic on the cloudinary
    const res = await cloudinary.uploader.destroy(image_id);

    // saving the new image on the cloudinary
    const result = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }
  // updating the database
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
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
// Delete user   =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`)
    );
  }

  // Remove avatar from cloudinary
  const image_id = user.avatar.public_id;
  await cloudinary.uploader.destroy(image_id);

  await user.remove();

  res.status(200).json({
    success: true,
  });
});
