import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaShoppingBag,
  FaUser,
} from "react-icons/fa";
import Navbar from "./Navbar";
import CartSidebar from "./CartSidebar";
import { clearCart } from "../features/cart/cartSlice";
import {
  formatCurrency,
  getCartCount,
  getCartTotal,
  getDeliveryCharge,
  getGrandTotal,
  HANDLING_CHARGE,
} from "../utils/cartTotals";
import axios from "axios";

const fieldClass =
  "mt-2 w-full rounded-lg border border-orange-100 bg-white px-4 py-3 text-purple-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

const buildSummary = (items) => {
  const subtotal = getCartTotal(items);

  return {
    subtotal,
    deliveryCharge: getDeliveryCharge(subtotal),
    handlingCharge: subtotal > 0 ? HANDLING_CHARGE : 0,
    grandTotal: getGrandTotal(subtotal),
  };
};

const Checkout = () => {
  const cart = useSelector((state) => state.cart.items);
  const cartCount = getCartCount(cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.user);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    deliverySlot: "Today, 30-45 mins",
    payment: "cash",
  });

  const summary = buildSummary(cart);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

    const handlePlaceOrder = async (event) => {
      event.preventDefault();

      if (!cart.length) {
        navigate("/");
        return;
      }

      try {
        const orderData = {
          user: user._id, // Replace with logged-in user's id

          items: cart.map((item) => ({
            productId: item._id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),

          orderSummary: {
            subtotal: summary.subtotal,
            deliveryCharge: summary.deliveryCharge,
            handlingCharge: summary.handlingCharge,
            grandTotal: summary.grandTotal,
          },

          paymentMethod:
            formData.payment === "cash"
              ? "COD"
              : "Card",

          paymentStatus: "Pending",
        };

        const response = await axios.post(
          "http://localhost:3000/orders",
          orderData
        );

        console.log(response.data);

        setPlacedOrder({
          ...response.data.data,
          customer: formData,
          summary,
        });

        dispatch(clearCart());

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

      } catch (error) {
        console.log(error);
        alert("Failed to place order");
      }
    };

  const renderSummary = (items, orderSummary) => (
    <aside className="rounded-lg border border-orange-100 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-xl font-black text-purple-950">
        <FaShoppingBag className="text-orange-500" />
        Order Summary
      </h2>

      <div className="mt-5 max-h-[360px] space-y-4 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-4">
            <img
              src={item.image}
              alt={item.name}
              className="h-14 w-14 flex-none object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-bold text-purple-950">
                {item.name}
              </p>
              <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-purple-900">
              {formatCurrency((Number(item.price) || 0) * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-purple-900">
            {formatCurrency(orderSummary.subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery</span>
          <span className="font-semibold text-purple-900">
            {orderSummary.deliveryCharge === 0
              ? "Free"
              : formatCurrency(orderSummary.deliveryCharge)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Handling</span>
          <span className="font-semibold text-purple-900">
            {formatCurrency(orderSummary.handlingCharge)}
          </span>
        </div>
        <div className="flex justify-between border-t pt-4 text-lg font-black">
          <span>Grand Total</span>
          <span className="text-orange-600">
            {formatCurrency(orderSummary.grandTotal)}
          </span>
        </div>
      </div>
    </aside>
  );

  if (placedOrder) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar cartCount={cartCount} openCart={() => setIsCartOpen(true)} />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-lg border border-green-100 bg-white p-6 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <FaCheckCircle size={34} />
            </div>
            <h1 className="mt-5 text-3xl font-black text-purple-950">
              Order Confirmed
            </h1>
            <p className="mt-2 text-gray-600">
              Order #{placedOrder.id} is scheduled for{" "}
              {placedOrder.customer.deliverySlot}.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-orange-50 p-4">
                <p className="text-sm font-bold uppercase text-orange-600">
                  Delivery To
                </p>
                <p className="mt-2 font-bold text-purple-950">
                  {placedOrder.customer.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {placedOrder.customer.address}, {placedOrder.customer.city} -{" "}
                  {placedOrder.customer.pincode}
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-sm font-bold uppercase text-purple-700">
                  Payment
                </p>
                <p className="mt-2 font-bold text-purple-950">
                  {placedOrder.customer.payment === "cash"
                    ? "Cash on Delivery"
                    : "Card Payment"}
                </p>
                <p className="text-sm text-gray-600">
                  Total paid: {formatCurrency(placedOrder.summary.grandTotal)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-8 inline-flex items-center gap-3 rounded-lg bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-purple-900"
            >
              Continue Shopping
              <FaArrowRight />
            </button>
          </section>

          {renderSummary(placedOrder.items, placedOrder.summary)}
        </main>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar cartCount={cartCount} openCart={() => setIsCartOpen(true)} />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        <main className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <FaShoppingBag size={30} />
          </div>
          <h1 className="mt-5 text-3xl font-black text-purple-950">
            Your checkout is empty.
          </h1>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center gap-3 rounded-lg bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-purple-900"
          >
            Shop Products
            <FaArrowRight />
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar cartCount={cartCount} openCart={() => setIsCartOpen(true)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-bold text-purple-900 shadow-sm transition hover:bg-orange-500 hover:text-white"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <form
            onSubmit={handlePlaceOrder}
            className="rounded-lg border border-orange-100 bg-white p-5 shadow-sm"
          >
            <div>
              <p className="text-sm font-bold uppercase text-orange-500">
                Secure Checkout
              </p>
              <h1 className="mt-1 text-3xl font-black text-purple-950">
                Delivery Details
              </h1>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="flex items-center gap-2 font-bold text-purple-900">
                  <FaUser className="text-orange-500" />
                  Full name
                </span>
                <input
                  className={fieldClass}
                  name="fullName"
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <span className="flex items-center gap-2 font-bold text-purple-900">
                  <FaPhoneAlt className="text-orange-500" />
                  Phone number
                </span>
                <input
                  className={fieldClass}
                  name="phone"
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="flex items-center gap-2 font-bold text-purple-900">
                  <FaMapMarkerAlt className="text-orange-500" />
                  Address
                </span>
                <textarea
                  className={`${fieldClass} min-h-24 resize-none`}
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House number, street, area"
                />
              </label>

              <label className="block">
                <span className="font-bold text-purple-900">City</span>
                <input
                  className={fieldClass}
                  name="city"
                  required
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Chennai"
                />
              </label>

              <label className="block">
                <span className="font-bold text-purple-900">PIN code</span>
                <input
                  className={fieldClass}
                  name="pincode"
                  required
                  type="text"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="600001"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="flex items-center gap-2 font-bold text-purple-900">
                  <FaClock className="text-orange-500" />
                  Delivery slot
                </span>
                <select
                  className={fieldClass}
                  name="deliverySlot"
                  value={formData.deliverySlot}
                  onChange={handleChange}
                >
                  <option>Today, 30-45 mins</option>
                  <option>Today, 6 PM - 8 PM</option>
                  <option>Tomorrow, 8 AM - 10 AM</option>
                </select>
              </label>
            </div>

            <div className="mt-7">
              <h2 className="text-xl font-black text-purple-950">Payment</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                    formData.payment === "cash"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={formData.payment === "cash"}
                    onChange={handleChange}
                  />
                  <FaMoneyBillWave className="text-2xl text-orange-500" />
                  <span className="font-bold text-purple-950">
                    Cash on Delivery
                  </span>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                    formData.payment === "card"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="payment"
                    value="card"
                    checked={formData.payment === "card"}
                    onChange={handleChange}
                  />
                  <FaCreditCard className="text-2xl text-orange-500" />
                  <span className="font-bold text-purple-950">
                    Card Payment
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg hover:border-2 hover:border-orange-500 hover:bg-white py-3 font-bold hover:text-orange-500 transition bg-orange-600 text-white "
            >
              Place Order
              <FaArrowRight />
            </button>
          </form>

          {renderSummary(cart, summary)}
        </div>
      </main>
    </div>
  );
};

export default Checkout;
