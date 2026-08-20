const Order = require("../Model/OrderModel");
const { redisClient } = require("../Config/redis");
// =======================
// Create Order
// =======================
const createOrder = async (req, res) => {
  try {
        console.log(req.body);
    const {
      user,
      items,
      orderSummary,
      paymentMethod,
      paymentStatus,
    } = req.body;
        console.log(req.body);
    const order = await Order.create({
      user,
      items,
      orderSummary,
      paymentMethod,
      paymentStatus,
    });

    try {
      await redisClient.del("orders");
    } catch (cacheErr) {
      console.error("Failed to delete orders cache:", cacheErr);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get All Orders
// =======================
const getAllOrders = async (req, res) => {
  try {
    const cachedOrders = await redisClient.get("orders");
    if (cachedOrders) {
      return res.status(200).json({
        success: true,
        message: "Orders fetched from cache",
        data: JSON.parse(cachedOrders),
        source: "Redis cache"
      });
    }
    const orders = await Order.find()
      .populate("user")
      .sort({ createdAt: -1 });

    await redisClient.setEx("orders", 3600, JSON.stringify(orders)); // Cache for 1 hour

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get Order By ID
// =======================
const getOrderById = async (req, res) => {
  try {
    const cachedOrder = await redisClient.get(`order:${req.params.id}`);
    if (cachedOrder) {
      return res.status(200).json({
        success: true,
        message: "Order fetched from cache",
        data: JSON.parse(cachedOrder),
        source: "Redis cache"
      });
    }
    const order = await Order.findById(req.params.id).populate("user");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await redisClient.setEx(`order:${req.params.id}`, 3600, JSON.stringify(order)); // Cache for 1 hour

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get Orders By User
// =======================
const getOrdersByUser = async (req, res) => {
  try {
    const cachedOrders = await redisClient.get(`orders:user:${req.params.userId}`);
    if (cachedOrders) {
      return res.status(200).json({
        success: true,
        message: "Orders fetched from cache",
        data: JSON.parse(cachedOrders),
        source: "Redis cache"
      });
    }

    const orders = await Order.find({
      user: req.params.userId,
    }).sort({ createdAt: -1 });

    await redisClient.setEx(`orders:user:${req.params.userId}`, 3600, JSON.stringify(orders)); // Cache for 1 hour

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Update Order Status
// =======================
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, paymentMethod, orderSummary, items } = req.body;
    const updateData = {};
    if (orderStatus !== undefined) updateData.orderStatus = orderStatus;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (orderSummary !== undefined) updateData.orderSummary = orderSummary;
    if (items !== undefined) updateData.items = items;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    try {
      await redisClient.del("orders");
    } catch (cacheErr) {
      console.error("Failed to delete orders cache:", cacheErr);
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Delete Order
// =======================
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    try {
      await redisClient.del("orders");
    } catch (cacheErr) {
      console.error("Failed to delete orders cache:", cacheErr);
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder,
};