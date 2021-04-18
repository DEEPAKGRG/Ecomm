const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);
// sending email to reset password
router.route("/password/forgot").post(forgotPassword);
// using link send to email to reset password
router.route("/password/reset/:token").put(resetPassword);

// sending the current login user
router.route("/me").get(isAuthenticatedUser, getUserProfile);
// updating the current login user password
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
// update the profile of the user
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

// Admin routes

// admin route to get all the users
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

// admin route to get a user by id
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails);

// update a user details by admin
router
  .route("/admin/user/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser);

// delete a user by admin
router
  .route("/admin/user/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
