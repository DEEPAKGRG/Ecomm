const express = require("express");
const app = express();

const errorMiddleware = require("./middlewares/errors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// to upload image while register
const fileUpload = require("express-fileupload");
// const dotenv = require("dotenv");

const path = require("path");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

//Setting up config file
// Setting up config file
if (process.env.NODE_ENV !== "PRODUCTION")
  require("dotenv").config({ path: "backend/config/config.env" });
  
//Import all routes of products
const products = require("./routes/product");

// import all routes of users
const auth = require("./routes/auth");

// import all routes of orders
const order = require("./routes/order");

// import all routes of payment
const payment = require("./routes/payment");

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);
app.use("/api/v1", payment);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

// adding errorMiddleware  middlewares to app to handle errors
app.use(errorMiddleware);

module.exports = app;
