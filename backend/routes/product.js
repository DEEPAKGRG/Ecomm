const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

//route to show all products
router.route("/products").get(getProducts);

//route to get a product by id
router.route("/product/:id").get(getSingleProduct);

//route to add new product
router.route("/admin/product/new").post(newProduct);

//route to update a product by id
router.route("/admin/product/:id").put(updateProduct);

//route to delete a product by id
router.route("/admin/product/:id").delete(deleteProduct);

module.exports = router;
