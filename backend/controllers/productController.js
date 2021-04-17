const Product = require("../models/product");
// requring the class
const ErrorHandler = require("../utils/errorHandler");

// requiring the async main function to handle errors
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// requiring the search products class
const APIFeatures = require("../utils/apiFeature");

//creating a new product with the product schema =>api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// Get all the products=>  api/vi/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  const productsCount = await Product.countDocuments();
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: products.length,
    productsCount,
    products,
  });
});

//get single product by id => api/vi/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    // next() this will call errorhandling middleware and pass message and status code acc. to class
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    message: product,
  });
});

// update a product by id => api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
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
});

// delete a product by id ==>api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});
