const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "UserModel",
    required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    orderSummary: {
      subtotal: {
        type: Number,
        required: true,
        default: 0,
      },
      deliveryCharge: {
        type: Number,
        default: 0,
      },
      handlingCharge: {
        type: Number,
        default: 0,
      },
      grandTotal: {
        type: Number,
        required: true,
        default: 0,
      },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card", "Net Banking"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);