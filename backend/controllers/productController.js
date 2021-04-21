const Product = require("../models/product");
// requring the class
const ErrorHandler = require("../utils/errorHandler");

// requiring the async main function to handle errors
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// requiring the search products class
const APIFeatures = require("../utils/apiFeature");
const jwt = require("jsonwebtoken");

//creating a new product with the product schema =>api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  // using the id of the current logged in person to add his id to the product
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// Get all the products=>  api/vi/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 8;
  const productsCount = await Product.countDocuments();
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    productsCount,
    products,
  });
});

//get single product by id => api/vi/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
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

// creating controller to add new review or update review on a product=>api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);

  const isReviewed = false;
  // checking if the user has already given the review if yes then we will just update that one only
  product.reviews.forEach((r) => {
    if (r.user.toString() === req.user._id.toString()) {
      {
        isReviewed = true;
        r.rating = Number(rating);
        r.comment = comment;
      }
    }
  });
  // if not then push new one
  if (isReviewed == false) {
    product.reviews.push(review);
  }
  const finalRating = 0;
  // all have to calculate total rating/total user who has given the review
  product.reviews.forEach(
    (review) => (finalRating = finalRating + review.rating)
  );

  finalRating = finalRating / product.reviews.length;
  product.numOfReviews = product.reviews.length;
  product.ratings = finalRating;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({ success: true });
});

// get all reviews of a product => api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  res.status(200).json({ success: true, reviews: product.reviews });
});

// delete review of a product => api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  console.log(product);
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );
  const numOfReviews = reviews.length;
  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
});
