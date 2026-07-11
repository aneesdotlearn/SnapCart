import React, { use } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { increaseQuantity, removeFromCart, decreaseQuantity, clearItem } from "../features/cart/cartSlice";

const Cart = () => {
  // const cartCount = useSelector((state) => state.cart.items.length);
  const cartCount = useSelector((state) =>
  state.cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )
);
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const grandTotal = useSelector((state) => state.cart.totalAmount);
    // const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // const removeItem = (id) => {
  //   setCart((prev) =>
  //     prev
  //       .map((item) =>
  //         item.id === id
  //           ? { ...item, quantity: item.quantity - 1 }
  //           : item
  //       )
  //       .filter((item) => item.quantity > 0)
  //   );
  // };

  // const increaseItem = (id) => {
  //   setCart((prev) =>
  //     prev.map((item) =>
  //       item.id === id
  //         ? { ...item, quantity: item.quantity + 1 }
  //         : item
  //     )
  //   );
  // };

  // const clearItem = (id) => {
  //   setCart((prev) => prev.filter((item) => item.id !== id));
  // };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar cartCount={cartCount} />

      <main className="flex-grow px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center text-xl text-gray-600">
            Your cart is empty.
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-5">
              {cart.map((item) => {
                const unitPrice = Number(
                  String(item.price).replace("₹", "")
                );
                const totalPrice = unitPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-md p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                  >
                    {/* Product */}
                    <div className="flex items-center gap-5 lg:w-[40%]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-contain"
                      />

                      <div>
                        <h2 className="text-lg font-semibold text-purple-900">
                          {item.name}
                        </h2>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-xl">
                            ₹{unitPrice.toFixed(2)}
                          </span>

                          <del className="text-gray-400">
                            ₹{unitPrice.toFixed(2)}
                          </del>
                        </div>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="text-center">
                      <p className="text-gray-600">
                        Quantity
                      </p>

                      <p className="font-bold text-lg">
                        {item.quantity}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="text-center">
                      <p className="text-gray-600">
                        Total Price
                      </p>

                      <p className="font-bold text-lg text-green-600">
                        ₹{totalPrice.toFixed(2)}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        −
                      </button>

                      <button
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        +
                      </button>

                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    Total Amount:
                    <span className="text-orange-500 ml-2">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </h2>

                  <p className="text-gray-600 mt-2">
                    Total Items:{" "}
                    <span className="font-semibold">
                      {cartCount}
                    </span>
                  </p>
                  
                </div>

                <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;