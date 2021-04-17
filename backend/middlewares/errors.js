// importing error class
const ErrorHandler = require("../utils/ErrorHandler");

// middleware to handle errors
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";


  
  //  error handling for development mode
  if (process.env.NODE_ENV == "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }



  if (process.env.NODE_ENV == "PRODUCTION") {
    let error = { ...err };
    error.message = err.message;

    // Wrong mongoose id error handling
    if (err.name === "CastError") {
      let message = `Resource not found . Invalid ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // validation error while adding product handling
    if (err.name === "ValidationError") {
      let message = Object.values(err.errors).map(value => value.message);
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
