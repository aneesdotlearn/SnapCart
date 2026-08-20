import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaCreditCard,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaShoppingBag,
  FaUser,
} from "react-icons/fa";

import Navbar from "./Navbar";
import CartSidebar from "./CartSidebar";
import { ReceiptPrinter } from "./ReceiptPrinter";

import { clearCart } from "../features/cart/cartSlice";

import {
  formatCurrency,
  getCartCount,
  getCartTotal,
  getDeliveryCharge,
  getGrandTotal,
  getItemIdentity,
  HANDLING_CHARGE,
} from "../utils/cartTotals";

import axios from "axios";

const fieldClass =
  "mt-2 w-full rounded-lg border border-orange-100 bg-white px-4 py-3 text-purple-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

// ======================================================
// Order summary
// ======================================================

const buildSummary = (items) => {
  const subtotal = getCartTotal(items);

  return {
    subtotal,
    deliveryCharge: getDeliveryCharge(subtotal),
    handlingCharge:
      subtotal > 0 ? HANDLING_CHARGE : 0,
    grandTotal: getGrandTotal(subtotal),
  };
};

// ======================================================
// Checkout
// ======================================================

const Checkout = () => {
  const cart = useSelector((state) => state.cart.items);
  const cartCount = getCartCount(cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.user
  );

  // Cart sidebar
  const [isCartOpen, setIsCartOpen] =
    useState(false);

  // Placed order
  const [placedOrder, setPlacedOrder] =
    useState(null);

  /*
   * Receipt animation state:
   *
   * processing
   *     ↓
   * printing
   *     ↓
   * complete
   */
  const [orderStage, setOrderStage] =
    useState("processing");

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

  // ====================================================
  // Form change
  // ====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ====================================================
  // Place order
  // ====================================================

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (!cart.length) {
      navigate("/");
      return;
    }

    /*
     * Start processing state.
     */
    setOrderStage("processing");

    try {
      // -----------------------------------------------
      // Prepare order
      // -----------------------------------------------

      const orderData = {
        user: user._id,

        items: cart.map((item) => ({
          productId: getItemIdentity(item),
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),

        orderSummary: {
          subtotal: summary.subtotal,
          deliveryCharge:
            summary.deliveryCharge,
          handlingCharge:
            summary.handlingCharge,
          grandTotal:
            summary.grandTotal,
        },

        paymentMethod:
          formData.payment === "cash"
            ? "COD"
            : "Card",

        paymentStatus: "Pending",
      };

      // -----------------------------------------------
      // API request
      // -----------------------------------------------

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/orders`,
        orderData
      );

      console.log(response.data);

      // -----------------------------------------------
      // Save placed order
      // -----------------------------------------------

      setPlacedOrder({
        ...response.data.data,
        customer: formData,
        summary,
      });

      // Clear cart
      dispatch(clearCart());

      // Scroll to receipt
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      /*
       * IMPORTANT:
       *
       * Keep the receipt in "processing" first.
       *
       * This gives React/browser one render cycle to
       * paint the receipt while it is hidden inside
       * the printer.
       *
       * Then change to "printing".
       */

      setOrderStage("processing");

      /*
       * Start printing after the browser has had
       * time to paint the processing state.
       */
      window.setTimeout(() => {
        setOrderStage("printing");
      }, 100);

      /*
       * Receipt animation duration:
       * 1600ms
       *
       * Start:       100ms
       * Animation:   1600ms
       *
       * Complete slightly after animation.
       */
      window.setTimeout(() => {
        setOrderStage("complete");
      }, 1800);
    } catch (error) {
      console.log(error);

      alert("Failed to place order");

      setOrderStage("processing");
    }
  };

  // ====================================================
  // Order summary component
  // ====================================================

  const renderSummary = (
    items,
    orderSummary
  ) => (
    <aside className="rounded-lg border border-orange-100 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-xl font-black text-purple-950">
        <FaShoppingBag className="text-orange-500" />
        Order Summary
      </h2>

      <div className="mt-5 max-h-[360px] space-y-4 overflow-y-auto pr-1">
        {items.map((item, index) => (
          <div
            key={
              getItemIdentity(item) ||
              `${item.name}-${index}`
            }
            className="flex gap-3 border-b border-gray-100 pb-4"
          >
            <img
              src={item.image}
              alt={item.name}
              onError={(event) => {
                event.currentTarget.src = "/favicon.svg";
              }}
              className="h-14 w-14 flex-none object-contain"
            />

            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-bold text-purple-950">
                {item.name}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>

            <p className="text-sm font-bold text-purple-900">
              {formatCurrency(
                (Number(item.price) || 0) *
                  item.quantity
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">
            Subtotal
          </span>

          <span className="font-semibold text-purple-900">
            {formatCurrency(
              orderSummary.subtotal
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">
            Delivery
          </span>

          <span className="font-semibold text-purple-900">
            {orderSummary.deliveryCharge === 0
              ? "Free"
              : formatCurrency(
                  orderSummary.deliveryCharge
                )}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">
            Handling
          </span>

          <span className="font-semibold text-purple-900">
            {formatCurrency(
              orderSummary.handlingCharge
            )}
          </span>
        </div>

        <div className="flex justify-between border-t pt-4 text-lg font-black">
          <span>Grand Total</span>

          <span className="text-orange-600">
            {formatCurrency(
              orderSummary.grandTotal
            )}
          </span>
        </div>
      </div>
    </aside>
  );

  // ====================================================
  // Order completed / receipt screen
  // ====================================================

if (placedOrder) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <main className="mx-auto flex max-w-6xl justify-center px-4 py-12">
        <section className="flex w-full max-w-2xl flex-col items-center rounded-lg border border-orange-100 bg-white p-6 shadow-sm">

          {/* Receipt Printer */}
          <ReceiptPrinter.Root stage={orderStage}>
            <ReceiptPrinter.Machine>

              <ReceiptPrinter.Header>
                <span className="text-[11px] font-black uppercase tracking-widest text-purple-200">
                  SnapCart
                </span>
              </ReceiptPrinter.Header>

              <ReceiptPrinter.Screen>
                <ReceiptPrinter.Status />
              </ReceiptPrinter.Screen>

              <ReceiptPrinter.Output>
                <ReceiptPrinter.Paper>

                  {/* Receipt Header */}
                  <div className="text-center">
                    <p className="text-lg font-black">
                      Order Confirmed
                    </p>

                    <p className="mt-1 text-xs text-purple-700">
                      Order #{placedOrder.id}
                    </p>

                    <p className="text-xs text-purple-700">
                      {placedOrder.customer.deliverySlot}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="mt-4 space-y-1 border-t border-dashed border-purple-200 pt-4 text-xs">
                    {placedOrder.items?.map((item, index) => (
                      <div
                        key={
                          getItemIdentity(item) ||
                          `${item.name}-${index}`
                        }
                        className="flex justify-between gap-2"
                      >
                        <span className="truncate">
                          {item.quantity}x {item.name}
                        </span>

                        <span className="flex-none">
                          {formatCurrency(
                            (Number(item.price) || 0) *
                              item.quantity
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mt-4 space-y-1 border-t border-dashed border-purple-200 pt-4 text-xs">

                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>
                        {formatCurrency(
                          placedOrder.summary.subtotal
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Delivery</span>

                      <span>
                        {placedOrder.summary.deliveryCharge === 0
                          ? "Free"
                          : formatCurrency(
                              placedOrder.summary.deliveryCharge
                            )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Handling</span>

                      <span>
                        {formatCurrency(
                          placedOrder.summary.handlingCharge
                        )}
                      </span>
                    </div>

                    <div className="mt-2 flex justify-between border-t border-purple-950 pt-2 text-sm font-black">
                      <span>Total</span>

                      <span>
                        {formatCurrency(
                          placedOrder.summary.grandTotal
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="mt-4 border-t border-dashed border-purple-200 pt-4 text-xs">
                    <p className="font-bold">
                      {placedOrder.customer.fullName}
                    </p>

                    <p>
                      {placedOrder.customer.address},{" "}
                      {placedOrder.customer.city} -{" "}
                      {placedOrder.customer.pincode}
                    </p>

                    <p className="mt-2">
                      {placedOrder.customer.payment === "cash"
                        ? "Cash on Delivery"
                        : "Card Payment"}
                    </p>
                  </div>

                  {/* Footer */}
                  <p className="mt-6 text-center text-[10px] tracking-wide text-purple-300">
                    Thank you for shopping with us
                  </p>

                </ReceiptPrinter.Paper>
              </ReceiptPrinter.Output>

            </ReceiptPrinter.Machine>
          </ReceiptPrinter.Root>

          {/* Continue Shopping */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-8 inline-flex items-center gap-3 rounded-lg bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-purple-900"
          >
            Continue Shopping
            <FaArrowRight />
          </button>

        </section>
      </main>
    </div>
  );
}

  // ====================================================
  // Empty checkout
  // ====================================================

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar
          cartCount={cartCount}
          openCart={() => setIsCartOpen(true)}
        />

        <CartSidebar
          isOpen={isCartOpen}
          onClose={() =>
            setIsCartOpen(false)
          }
        />

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

  // ====================================================
  // Checkout form
  // ====================================================

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() =>
          setIsCartOpen(false)
        }
      />

      <main className="mx-auto max-w-6xl px-4 py-8">

        {/* Back */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-bold text-purple-900 shadow-sm transition hover:bg-orange-500 hover:text-white"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">

          {/* ==========================================
              CHECKOUT FORM
          ========================================== */}

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

            {/* =========================================
                CUSTOMER DETAILS
            ========================================= */}

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {/* Name */}

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

              {/* Phone */}

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

              {/* Address */}

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

              {/* City */}

              <label className="block">
                <span className="font-bold text-purple-900">
                  City
                </span>

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

              {/* Pincode */}

              <label className="block">
                <span className="font-bold text-purple-900">
                  PIN code
                </span>

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

              {/* Delivery slot */}

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
                  <option>
                    Today, 30-45 mins
                  </option>

                  <option>
                    Today, 6 PM - 8 PM
                  </option>

                  <option>
                    Tomorrow, 8 AM - 10 AM
                  </option>
                </select>
              </label>

            </div>

            {/* =========================================
                PAYMENT
            ========================================= */}

            <div className="mt-7">

              <h2 className="text-xl font-black text-purple-950">
                Payment
              </h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">

                {/* Cash */}

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
                    checked={
                      formData.payment === "cash"
                    }
                    onChange={handleChange}
                  />

                  <FaMoneyBillWave className="text-2xl text-orange-500" />

                  <span className="font-bold text-purple-950">
                    Cash on Delivery
                  </span>
                </label>

                {/* Card */}

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
                    checked={
                      formData.payment === "card"
                    }
                    onChange={handleChange}
                  />

                  <FaCreditCard className="text-2xl text-orange-500" />

                  <span className="font-bold text-purple-950">
                    Card Payment
                  </span>
                </label>

              </div>
            </div>

            {/* =========================================
                PLACE ORDER
            ========================================= */}

            <button
              type="submit"
              className="
                mt-8
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-lg
                bg-orange-600
                py-3
                font-bold
                text-white
                transition
                hover:border-2
                hover:border-orange-500
                hover:bg-white
                hover:text-orange-500
              "
            >
              Place Order
              <FaArrowRight />
            </button>

          </form>

          {/* ==========================================
              SUMMARY
          ========================================== */}

          {renderSummary(cart, summary)}

        </div>
      </main>
    </div>
  );
};

export default Checkout;
