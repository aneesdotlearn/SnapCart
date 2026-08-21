const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder,
} = require("../Controller/OrderController");
const UserAuth = require("../Middleware/authMiddleware");

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.get("/user/:userId", getOrdersByUser);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;