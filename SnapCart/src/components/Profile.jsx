import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiMail,
  FiPackage,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartSidebar from "./CartSidebar";
import { formatCurrency, getCartCount, getCartTotal } from "../utils/cartTotals";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart.items);
  const favorites = useSelector((state) => state.favorite.favorites);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState("");

  const cartCount = getCartCount(cart);
  const cartTotal = getCartTotal(cart);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) {
        return;
      }

      setLoadingOrders(true);
      setOrderError("");

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/orders/user/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setOrders(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch profile orders:", error);
        setOrderError("Unable to load your order summary right now.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  const latestOrder = useMemo(() => {
    return [...orders].sort(
      (first, second) =>
        new Date(second.createdAt || 0).getTime() -
        new Date(first.createdAt || 0).getTime(),
    )[0];
  }, [orders]);

  const profileStats = [
    {
      label: "Cart Items",
      value: cartCount,
      helper: cartCount > 0 ? formatCurrency(cartTotal) : "Ready for fresh picks",
      icon: <FiShoppingCart />,
      action: () => navigate("/cart"),
    },
    {
      label: "Favorites",
      value: favorites.length,
      helper: "Saved products",
      icon: <FiHeart />,
      action: () => navigate("/favorites"),
    },
    {
      label: "Orders",
      value: orders.length,
      helper: loadingOrders ? "Checking latest" : "Order history",
      icon: <FiPackage />,
      action: () => navigate("/orders"),
    },
  ];

  const accountDetails = [
    { label: "Name", value: user?.name || "SnapCart customer", icon: <FiUser /> },
    { label: "Email", value: user?.email || "Not available", icon: <FiMail /> },
    { label: "Role", value: user?.role || "user", icon: <FiShoppingBag /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-purple-950">
      <Navbar cartCount={cartCount} openCart={() => setIsCartOpen(true)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <section className="mb-6 overflow-hidden rounded-lg bg-purple-950 text-white shadow-lg">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-orange-500 text-3xl font-black uppercase">
                {(user?.name || "U").slice(0, 1)}
              </div>
              <div>
                <p className="text-sm font-bold uppercase text-orange-300">
                  My Account
                </p>
                <h1 className="text-3xl font-black">{user?.name || "Profile"}</h1>
                <p className="mt-1 text-sm font-medium text-purple-100">
                  {user?.email || "Your SnapCart details and activity"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/orders")}
                className="rounded-lg bg-white px-5 py-3 font-bold text-purple-900 transition hover:bg-orange-500 hover:text-white"
              >
                View Orders
              </button>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="rounded-lg border border-orange-300 px-5 py-3 font-bold text-orange-100 transition hover:bg-orange-500 hover:text-white"
              >
                Open Cart
              </button>
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          {profileStats.map((stat) => (
            <button
              key={stat.label}
              type="button"
              onClick={stat.action}
              className="rounded-lg border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-2xl text-orange-600">
                {stat.icon}
              </span>
              <p className="text-sm font-bold uppercase text-gray-400">
                {stat.label}
              </p>
              <p className="mt-1 text-3xl font-black text-purple-950">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-500">
                {stat.helper}
              </p>
            </button>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Fetched Details</h2>
            <div className="mt-5 space-y-3">
              {accountDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center gap-3 rounded-lg bg-gray-50 p-4"
                >
                  <span className="text-xl text-orange-500">{detail.icon}</span>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400">
                      {detail.label}
                    </p>
                    <p className="font-bold text-purple-950">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">Quick Activity</h2>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  Jump back into your favorites, orders, and cart.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-purple-900"
              >
                Shop Now
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate("/favorites")}
                className="rounded-lg border border-orange-100 p-4 text-left transition hover:bg-orange-50"
              >
                <p className="font-black">Your Favorites</p>
                <p className="mt-1 text-sm text-gray-500">
                  {favorites.length
                    ? `${favorites.length} saved item${favorites.length === 1 ? "" : "s"}`
                    : "No favorites yet"}
                </p>
              </button>

              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="rounded-lg border border-orange-100 p-4 text-left transition hover:bg-orange-50"
              >
                <p className="font-black">Your Cart</p>
                <p className="mt-1 text-sm text-gray-500">
                  {cartCount
                    ? `${cartCount} item${cartCount === 1 ? "" : "s"} worth ${formatCurrency(cartTotal)}`
                    : "Your cart is empty"}
                </p>
              </button>

              <button
                type="button"
                onClick={() => navigate("/orders")}
                className="rounded-lg border border-orange-100 p-4 text-left transition hover:bg-orange-50 sm:col-span-2"
              >
                <p className="font-black">Your Orders</p>
                {orderError ? (
                  <p className="mt-1 text-sm text-red-500">{orderError}</p>
                ) : latestOrder ? (
                  <p className="mt-1 text-sm text-gray-500">
                    Latest order {latestOrder._id} is {latestOrder.orderStatus}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    {loadingOrders ? "Loading orders..." : "No orders placed yet"}
                  </p>
                )}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
