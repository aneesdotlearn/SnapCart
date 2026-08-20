import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Banner from "./Banner";
import Footer from "./Footer";
import CartSidebar from "./CartSidebar";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { toggleFavorite } from "../features/cart/favoriteSlice";

import { FaHeart, FaRegHeart } from "react-icons/fa";

import axios from "axios";
import { getItemIdentity } from "../utils/cartTotals";

const ProductPage = () => {
  const dispatch = useDispatch();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cart items
  const cart = useSelector((state) => state.cart.items);

  // Favorites
  const favorites = useSelector(
    (state) => state.favorite.favorites
  );

  // Calculate total cart quantity
  const cartCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Fetching products from backend...");

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/products`
        );

        console.log("Backend response:", response.data);

        // Supports:
        // { data: [...] }
        // { products: [...] }
        // [...]
        const productData =
          response.data?.data ||
          response.data?.products ||
          response.data ||
          [];

        setProducts(Array.isArray(productData) ? productData : []);
      } catch (err) {
        console.error("Error fetching products:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load products. Please try again."
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  // =========================
  // FAVORITE
  // =========================
  const handleFavorite = (product) => {
    dispatch(toggleFavorite(product));
  };

  // =========================
  // CHECK FAVORITE
  // =========================
  const isProductFavorite = (product) => {
    return favorites.some(
      (item) =>
        getItemIdentity(item) === getItemIdentity(product)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =========================
          NAVBAR
      ========================= */}
      <Navbar
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
      />

      {/* =========================
          CART SIDEBAR
      ========================= */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* =========================
          BANNER
      ========================= */}
      <Banner />

      {/* =========================
          PRODUCTS SECTION
      ========================= */}
      <section className="min-h-screen bg-gray-100 px-3 py-5">

        <h1 className="mb-6 text-center text-3xl font-black text-purple-950">
          Our Featured Products
        </h1>

        {/* =========================
            LOADING
        ========================= */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-lg font-bold text-purple-900">
              Loading products...
            </p>
          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}
        {!loading && error && (
          <div className="mx-auto max-w-xl rounded-lg bg-red-100 px-5 py-4 text-center">
            <p className="font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* =========================
            NO PRODUCTS
        ========================= */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-lg font-bold text-gray-600">
                No products available.
              </p>
            </div>
          )}

        {/* =========================
            PRODUCT GRID
        ========================= */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

            {products.map((product, index) => {
              const isFavorite = isProductFavorite(product);

              const productKey =
                getItemIdentity(product) ||
                product.id ||
                `${product.name}-${index}`;

              const price = Number(product.price || 0);

              // 20% higher original price
              const originalPrice = price * 1.2;

              return (
                <div
                  key={productKey}
                  className="flex flex-col items-center gap-3 rounded-xl bg-white p-3 shadow-md transition duration-300 hover:scale-[1.03] hover:shadow-xl"
                >

                  {/* =========================
                      PRODUCT IMAGE
                  ========================= */}
                  <div className="flex h-[140px] w-full items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name || "Product"}
                      onError={(event) => {
                        event.currentTarget.src = "/favicon.svg";
                      }}
                      className="h-full max-w-full object-contain"
                    />
                  </div>

                  {/* =========================
                      PRODUCT DETAILS
                  ========================= */}
                  <div className="flex w-full flex-col items-center gap-2">

                    <h2 className="line-clamp-2 min-h-[48px] w-full text-center font-semibold text-purple-900">
                      {product.name}
                    </h2>

                    {/* PRICE */}
                    <div className="flex items-center gap-2">
                      <p className="font-black text-gray-900">
                        ₹{price.toFixed(2)}
                      </p>

                      <del className="text-sm text-gray-400">
                        ₹{originalPrice.toFixed(2)}
                      </del>
                    </div>

                    {/* CATEGORY */}
                    {product.category && (
                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                    )}

                  </div>

                  {/* =========================
                      BUTTONS
                  ========================= */}
                  <div className="flex w-full items-center justify-between gap-2 pb-1">

                    {/* ADD TO CART */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 rounded-xl border-2 border-orange-500 bg-white px-2 py-2 text-sm font-bold text-orange-500 shadow-[0_4px_8px_rgba(249,115,22,0.25)] transition-all duration-200 hover:bg-orange-500 hover:text-white"
                    >
                      Add to Cart
                    </button>

                    {/* FAVORITE */}
                    <button
                      type="button"
                      onClick={() => handleFavorite(product)}
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-orange-50"
                    >
                      {isFavorite ? (
                        <FaHeart className="text-xl text-orange-500" />
                      ) : (
                        <FaRegHeart className="text-xl text-orange-500" />
                      )}
                    </button>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* =========================
          FOOTER
      ========================= */}
      <Footer />

    </div>
  );
};

export default ProductPage;