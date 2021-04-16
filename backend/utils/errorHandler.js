//creating ErrorHandler class to handle all errors
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // this will create .stack property on the object
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;
