const express = require("express");
const router = express.Router();

// protect some routes from unauthenticated users
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const {
  getProducts,
  getAdminProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");
const { create } = require("../models/user");

//route to show all products
router.route("/products").get(getProducts);

//route to show all products
router.route("/admin/products").get(getAdminProducts);

//route to get a product by id
router.route("/product/:id").get(getSingleProduct);

//route to add new product
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// create a new review or update the existing review on a product
router.route("/review").put(isAuthenticatedUser, createProductReview);

// get all reviews of a product
router.route("/reviews").get(isAuthenticatedUser, getProductReviews);

// delete a review on a product
router.route("/reviews").delete(isAuthenticatedUser, deleteReview);

module.exports = router;
