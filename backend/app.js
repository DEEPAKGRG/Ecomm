const express = require("express");
const app = express();

const errorMiddleware = require("./middlewares/errors");

app.use(express.json());

//Import all routes of products
const products = require("./routes/product");

// import all routes of users
const auth = require("./routes/auth");

app.use("/api/v1", products);
app.use("/api/v1", auth);

// adding errorMiddleware  middlewares to app to handle errors
app.use(errorMiddleware);

module.exports = app;
