const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
//creating a new product with the product schema =>api/v1/admin/product/new
exports.newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
};

// Get all the products=>  api/vi/products
exports.getProducts = async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    count: products.length,
    message: products,
  });
};

//get single product by id => api/vi/product/:id
exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    message: product,
  });
};

// update a product by id => api/v1/admin/product/:id
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
  }
  // {}these are only to remove the warning
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: product,
  });
};

// delete a product by id ==>api/v1/admin/product/:id
exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
};
