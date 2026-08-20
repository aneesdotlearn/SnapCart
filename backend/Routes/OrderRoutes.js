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

router.post("/", UserAuth, createOrder);
router.get("/", UserAuth, getAllOrders);
router.get("/:id", UserAuth, getOrderById);
router.get("/user/:userId", UserAuth, getOrdersByUser);
router.put("/:id", UserAuth, updateOrderStatus);
router.delete("/:id", UserAuth, deleteOrder);

module.exports = router;