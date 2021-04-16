const Product = require("../models/product");
//requiring all data from data store
const data = require("../data/product");
const connectDatabase = require("../config/database");
const dotenv = require("dotenv");
//Setting up config file
dotenv.config({ path: "backend/config/config.env" });
//connecting to datbase
connectDatabase();
seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("all current products are delete");
    await Product.insertMany(data);
    console.log("all products are added");
    process.exit();
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
};
seedProducts();
