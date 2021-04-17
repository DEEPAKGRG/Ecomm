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
} = require("../controllers/productController");

//route to show all products
router.route("/products").get(isAuthenticatedUser, getProducts);

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

module.exports = router;
