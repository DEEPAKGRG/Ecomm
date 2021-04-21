const express = require("express");
const router = express.Router();

// protect some routes from unauthenticated users
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const {
  getProducts,
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

//route to get a product by id
router.route("/product/:id").get(getSingleProduct);

//route to add new product
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

//route to update a product by id
router.route("/admin/product/:id").put(authorizeRoles("admin"), updateProduct);

//route to delete a product by id
router
  .route("/admin/product/:id")
  .delete(authorizeRoles("admin"), deleteProduct);

// create a new review or update the existing review on a product
router.route("/review").put(isAuthenticatedUser, createProductReview);

// get all reviews of a product
router.route("/reviews").get(isAuthenticatedUser, getProductReviews);

// delete a review on a product
router.route("/reviews").delete(isAuthenticatedUser, deleteReview);

module.exports = router;
