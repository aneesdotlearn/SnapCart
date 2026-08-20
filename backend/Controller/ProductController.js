const Product = require("../Model/ProductModel");
const mongoose = require("mongoose");
const { redisClient } = require("../Config/redis");

// =====================================================
// REDIS CACHE KEYS
// =====================================================

const PRODUCTS_CACHE_KEY = "products";

const productCacheKey = (id) => `product:${id}`;

const productLookupFilter = (id) =>
  mongoose.Types.ObjectId.isValid(id) ? { $or: [{ _id: id }, { id }] } : { id };


// =====================================================
// CLEAR ALL PRODUCT CACHE
// =====================================================

const clearAllProductCache = async () => {
  try {
    // Delete main products list cache
    const deletedListCache = await redisClient.del(PRODUCTS_CACHE_KEY);

    // Find individual product caches
    const keys = await redisClient.keys("product:*");

    if (keys.length > 0) {
      // IMPORTANT:
      // redisClient.del(keys) causes:
      // "arguments[1] must be string | Buffer, got object"
      //
      // Use spread operator instead.
      await redisClient.del(...keys);
    }

    console.log(
      `Product cache cleared. Deleted list cache: ${deletedListCache}, individual product cache(s): ${keys.length}`
    );

    return {
      deletedListCache,
      deletedIndividualCaches: keys.length,
    };
  } catch (error) {
    console.error("Error clearing product cache:", error);
    throw error;
  }
};

const getFreshProductsFromDB = async () => {
  const products = await Product.find();
  await redisClient.setEx(PRODUCTS_CACHE_KEY, 3600, JSON.stringify(products));
  return products;
};

const refreshProductCache = async () => {
  const cacheResult = await clearAllProductCache();
  const products = await getFreshProductsFromDB();

  console.log(`Product cache refreshed with ${products.length} product(s)`);

  return {
    ...cacheResult,
    refreshedProducts: products.length,
  };
};


// =====================================================
// CREATE PRODUCT
// =====================================================

const createProduct = async (req, res) => {
  try {
    console.log("Creating product...");

    // Create product in MongoDB
    const product = await Product.create(req.body);

    console.log("Product created in MongoDB:");
    console.log(product);

    // -------------------------------------------------
    // IMPORTANT
    // Clear old Redis cache after creating product
    // -------------------------------------------------

    const cacheResult = await refreshProductCache();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
      source: "MongoDB",
      cache: "refreshed",
      cacheResult,
    });

  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL PRODUCTS
// =====================================================

const getAllProducts = async (req, res) => {
  try {
    console.log("Fetching products...");

    // -------------------------------------------------
    // 1. CHECK REDIS CACHE
    // -------------------------------------------------

    const shouldBypassCache =
      req.query.fresh === "true" ||
      req.query.noCache === "true" ||
      req.headers["cache-control"] === "no-cache";

    const cachedProducts = shouldBypassCache
      ? null
      : await redisClient.get(PRODUCTS_CACHE_KEY);

    if (cachedProducts) {
      console.log("Products fetched from Redis cache");

      return res.status(200).json({
        success: true,
        message: "Products fetched from cache",
        data: JSON.parse(cachedProducts),
        source: "Redis cache",
      });
    }

    // -------------------------------------------------
    // 2. CACHE MISS
    // Fetch fresh data from MongoDB
    // -------------------------------------------------

    console.log("Redis cache miss");
    console.log("Fetching fresh products from MongoDB...");

    const products = await getFreshProductsFromDB();

    console.log(`Fetched ${products.length} products from MongoDB`);

    console.log("Fresh products stored in Redis");

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      source: "MongoDB",
    });

  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};


// =====================================================
// GET PRODUCT BY CUSTOM ID
// =====================================================

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    console.log(`Fetching product with id: ${productId}`);

    const cacheKey = productCacheKey(productId);

    // -------------------------------------------------
    // 1. CHECK REDIS
    // -------------------------------------------------

    const cachedProduct = await redisClient.get(cacheKey);

    if (cachedProduct) {
      console.log(`Product ${productId} fetched from Redis`);

      return res.status(200).json({
        success: true,
        message: "Product fetched from cache",
        data: JSON.parse(cachedProduct),
        source: "Redis cache",
      });
    }

    // -------------------------------------------------
    // 2. FETCH FROM MONGODB
    // -------------------------------------------------

    const product = await Product.findOne(productLookupFilter(productId));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -------------------------------------------------
    // 3. STORE IN REDIS
    // -------------------------------------------------

    await redisClient.setEx(
      cacheKey,
      3600,
      JSON.stringify(product)
    );

    console.log(`Product ${productId} stored in Redis`);

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
      source: "MongoDB",
    });

  } catch (error) {
    console.error("Get product by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product by ID",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE PRODUCT
// =====================================================

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    console.log(`Updating product: ${productId}`);

    // -------------------------------------------------
    // Update MongoDB using custom id
    // -------------------------------------------------

    const product = await Product.findOneAndUpdate(
      productLookupFilter(productId),
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    console.log("Product updated in MongoDB:");
    console.log(product);

    // -------------------------------------------------
    // VERY IMPORTANT
    // Delete OLD Redis cache
    // -------------------------------------------------

    const cacheResult = await refreshProductCache();

    console.log(`Redis cache refreshed after updating product ${productId}`);
    console.log(cacheResult);

    // -------------------------------------------------
    // Redis now contains the latest products list from MongoDB.
    // -------------------------------------------------

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
      source: "MongoDB",
      cache: "refreshed",
      cacheResult,
    });

  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE PRODUCT
// =====================================================

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    console.log(`Deleting product: ${productId}`);

    // -------------------------------------------------
    // Delete from MongoDB
    // -------------------------------------------------

    const product = await Product.findOneAndDelete(productLookupFilter(productId));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    console.log("Product deleted from MongoDB:");
    console.log(product);

    // -------------------------------------------------
    // Delete Redis caches
    // -------------------------------------------------

    const cacheResult = await refreshProductCache();

    console.log(`Redis cache refreshed after deleting product ${productId}`);
    console.log(cacheResult);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
      source: "MongoDB",
      cache: "refreshed",
      cacheResult,
    });

  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};


// =====================================================
// CLEAR PRODUCT REDIS CACHE
// =====================================================

const clearProductCache = async (req, res) => {
  try {
    console.log("Clearing product Redis cache...");

    const cacheResult = await clearAllProductCache();

    res.status(200).json({
      success: true,
      message: "Product Redis cache cleared successfully",
      ...cacheResult,
    });

  } catch (error) {
    console.error("Clear Redis cache error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear Redis cache",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  clearProductCache,
};
