const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../Controller/ProductController');
const UserAuth = require("../Middleware/authMiddleware");
const AdminAuth = require("../Middleware/adminMiddleware");

router.post('/create', createProduct);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', UserAuth, deleteProduct);

module.exports = router;