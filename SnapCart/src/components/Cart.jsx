import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaMinus,
  FaPlus,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../features/cart/cartSlice";
import {
  formatCurrency,
  getCartCount,
  getCartTotal,
  getDeliveryCharge,
  getGrandTotal,
  getItemIdentity,
  HANDLING_CHARGE,
} from "../utils/cartTotals";

const Cart = ({ onClose }) => {
  const cart = useSelector((state) => state.cart.items);
  const cartCount = getCartCount(cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = getCartTotal(cart);
  const deliveryCharge = getDeliveryCharge(subtotal);
  const handlingCharge = subtotal > 0 ? HANDLING_CHARGE : 0;
  const grandTotal = getGrandTotal(subtotal);

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate("/");
  };

  const handleCheckout = () => {
    if (!cart.length) {
      return;
    }

    if (onClose) {
      onClose();
    }

    navigate("/checkout");
  };

  return (
    <div className="flex h-full flex-col bg-gray-100">
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex max-h-[80px] items-center justify-between border-b bg-white p-4">
          <div>
            <h2 className="text-2xl font-bold text-purple-950">My Cart</h2>
            <p className="text-sm text-gray-500">
              {cartCount} item{cartCount !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-purple-900 transition hover:bg-orange-100 hover:text-orange-600"
            aria-label={onClose ? "Close cart" : "Continue shopping"}
            title={onClose ? "Close cart" : "Continue shopping"}
          >
            {onClose ? <FaTimes /> : <FaArrowLeft />}
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <h3 className="text-2xl font-bold text-purple-950">
              Your cart is empty.
            </h3>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-5 rounded-lg bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-purple-900"
            >
              Shop Products
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-3">
              {cart.map((item, index) => {
                const unitPrice = Number(item.price) || 0;
                const totalPrice = unitPrice * item.quantity;
                const itemIdentity = getItemIdentity(item);

                return (
                  <div
                    key={itemIdentity || `${item.name}-${index}`}
                    className="flex flex-col gap-4 border border-gray-100 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-center gap-4 lg:w-[48%]">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.src = "/favicon.svg";
                        }}
                        className="h-16 w-16 flex-none object-contain"
                      />

                      <div>
                        <h2 className="line-clamp-2 text-sm font-semibold text-purple-900">
                          {item.name}
                        </h2>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-bold text-sm">
                            {formatCurrency(unitPrice)}
                          </span>
                          <del className="text-sm text-gray-400">
                            {formatCurrency(unitPrice * 1.2)}
                          </del>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 lg:flex-none">
                      <div className="flex h-10 items-center overflow-hidden rounded-lg bg-orange-500">

                        <button
                          type="button"
                          onClick={() => dispatch(decreaseQuantity(itemIdentity))}
                          className="flex h-10 w-10 items-center justify-center text-white transition hover:bg-orange-600"
                          aria-label={`Decrease ${item.name}`}
                          title="Decrease quantity"
                        >
                          <FaMinus size={10} />
                        </button>

                        <span className="min-w-10 px-3 text-center font-bold text-white">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => dispatch(increaseQuantity(itemIdentity))}
                          className="flex h-10 w-10 items-center justify-center text-white transition hover:bg-orange-600"
                          aria-label={`Increase ${item.name}`}
                          title="Increase quantity"
                        >
                          <FaPlus size={10} />
                        </button>

                      </div>

                      {/* <button
                        type="button"
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-orange-500 transition hover:bg-orange-50 hover:text-purple-900"
                        aria-label={`Remove ${item.name}`}
                        title="Remove item"
                      >
                        <FaTrash size={15} />
                      </button> */}


                      <p className="min-w-20 text-center font-bold text-green-600">
                        {formatCurrency(totalPrice)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mx-3 rounded-lg border bg-white p-5">
              <label className="block font-semibold text-purple-950">
                Promo code
              </label>
              <input
                type="text"
                placeholder="Enter coupon code"
                className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-center outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="mx-3 mt-3 rounded-lg border bg-white p-5">
              <h5 className="font-bold text-purple-950">Bill Summary</h5>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <div className="flex gap-2">
                    <del className="text-gray-400">
                      {formatCurrency(subtotal * 1.2)}
                    </del>
                    <span className="font-semibold text-purple-900">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-purple-900">
                    {deliveryCharge === 0 ? "Free" : formatCurrency(deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Handling Charge</span>
                  <span className="font-semibold text-purple-900">
                    {formatCurrency(handlingCharge)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3 font-bold">
                  <span>Grand Total</span>
                  <span className="text-orange-600">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 mt-3 border-t bg-white p-5">
              <div className="mb-3 flex justify-between">
                <span className="font-semibold">Total ({cartCount} items)</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-orange-500 bg-white py-3 font-bold text-orange-500 transition hover:bg-orange-600 hover:text-white"
              >
                Proceed to Checkout
                <FaArrowRight />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Cart;
