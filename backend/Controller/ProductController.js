const Product = require('../Model/ProductModel');
const { redisClient } = require('../Config/redis');

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const cachedProducts = await redisClient.get('products');
        if (cachedProducts) {
            return res.status(200).json({
                success: true,
                message: 'Products fetched from cache',
                data: JSON.parse(cachedProducts),
                source: 'Redis cache'
            });
        }

        const products = await Product.find();
        await redisClient.setEx('products', 3600, JSON.stringify(products)); // Cache for 1 hour
        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: products,
            source: 'MongoDB'
        });

    }catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};

const getProductById = async (req, res) => {
  try {
    const cachedProduct = await redisClient.get(`product:${req.params.id}`);
    if (cachedProduct) {
      return res.status(200).json({
        success: true,
        message: "Product fetched from cache",
        data: JSON.parse(cachedProduct),
        source: "Redis cache"
      });
    }
    const product = await Product.findOne({ id: req.params.id }); // params = parameter in the URL
    await redisClient.setEx(`product:${req.params.id}`, 3600, JSON.stringify(product)); // Cache for 1 hour
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
      source: "MongoDB"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product by ID",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
      source: "MongoDB"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
      source: "MongoDB"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};