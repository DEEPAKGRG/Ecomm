const express = require("express");
const router = express.Router();
const {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// create new order
router.route("/order/new").post(isAuthenticatedUser, newOrder);

// get an order by its id
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

// get all orders of an user
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

// get all orders ==>admin router
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allOrders);

// admin route to to update to quantity in stock and also update the order
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
