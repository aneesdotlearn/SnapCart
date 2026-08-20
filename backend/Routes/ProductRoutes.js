const express = require("express");

const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  clearProductCache,
} = require("../Controller/ProductController");


// =====================================================
// PRODUCT ROUTES
// =====================================================

// Create product
router.post("/create", createProduct);

// Get all products
router.get("/products", getAllProducts);

// Get product by custom id
router.get("/products/:id", getProductById);

// Update product by custom id
router.put("/products/:id", updateProduct);

// Delete product by custom id
router.delete("/products/:id", deleteProduct);


// =====================================================
// REDIS CACHE
// =====================================================

// Clear all product Redis cache
router.delete("/cache/clear", clearProductCache);


module.exports = router;