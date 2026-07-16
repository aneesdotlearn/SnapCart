import React, { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increaseQuantity, removeFromCart, decreaseQuantity, clearItem, subTotal } from "../features/cart/cartSlice";

const Cart = ({ onClose }) => {
  // const cartCount = useSelector((state) => state.cart.items.length);
  const cartCount = useSelector((state) =>
  state.cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )
);
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  

  const subTotal = useSelector((state) => state.cart.totalAmount);
  // const grandTotal = useSelector((state) => state.cart.totalAmount);
  const deliveryCharge = subTotal < 99 ? 0 : 30;
  const handlingCharge = 5;
  const grandTotal =
  subTotal + deliveryCharge + handlingCharge;


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
    <div className="h-full bg-gray-100 flex flex-col">

      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between border-b bg-white p-4 max-h-[80px] sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold">My Cart</h2>
            <p className="text-sm text-gray-500">
              {cartCount} item{cartCount !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center text-xl text-gray-600">
            Your cart is empty.
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="p-2 rounded-xl ">
              {cart.map((item) => {
                const unitPrice = Number(
                  String(item.price).replace("₹", "")
                );
                const totalPrice = unitPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="bg-white  shadow-md p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-gray-100 border"
                  >
                    
                    {/* Product */}
                    <div className="flex items-center gap-5 lg:w-[40%]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-contain"
                      />

                      <div>
                        <h2 className="text-sm font-semibold text-purple-900 line-clamp-2">
                          {item.name}
                        </h2>

                        <div className="flex items-center gap-1 mt-1">
                          <span className="font-bold text-xs">
                            ₹{unitPrice.toFixed(2)}
                          </span>

                          <del className="text-gray-400 text-sm">
                            ₹{unitPrice.toFixed(2)}
                          </del>
                        </div>
                      </div>
                    </div>

                    {/* Quantity */}
                    {/* <div className="text-center">
                      <p className="text-gray-600">
                        Quantity
                      </p>

                      <p className="font-bold text-sm">
                        {item.quantity}
                      </p>
                    </div> */}

                    {/* Total */}
                    {/* <div className="text-center">
                      <p className="text-gray-600">
                        Total Price
                      </p>

                      <p className="font-bold text-s text-green-600">
                        ₹{totalPrice.toFixed(2)}
                      </p>
                    </div> */}
                    <div className="flex-col items-center gap-3 text-center">
                    <div className="flex items-center bg-orange-500 rounded-lg overflow-hidden">

                    <button
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        className="px-3 py-1 text-white"
                    >
                        -
                    </button>

                    <span className="px-3 text-white font-bold">
                        {item.quantity}
                    </span>

                    <button
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        className="px-3 py-1 text-white"
                    >
                        +
                    </button>

                  </div>
                  <div>
                    <p className="font-bold text-s text-green-600">
                        ₹{totalPrice.toFixed(2)}
                      </p>
                  </div>
                  
                  </div>
                      
                  </div>
                  
                );
              })}
            </div>
            <div className="bg-white border-t p-5 rounded-xl">
              <p className="font-semibold">Promo code</p>
              <input
                type="text"
                placeholder="Enter coupon code"
                className="border border-gray-300 rounded-lg py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              />
            </div>

            <div className="bg-white border-t p-5 rounded-xl">
              <h5 className="font-bold">
                Bill Summary
              </h5>
              <div>
                <div className="flex justify-between mt-2">
                  <span>Subtotal</span>
                  <div className="flex gap-1">
                  <span className="text-gray-500"><del>₹{ (subTotal * 1.2).toFixed(2) }</del></span>
                  <span className="text-purple-900">₹{subTotal.toFixed(2)}</span> 
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Delivery Charge</span>
                  <span className="text-purple-900">₹{deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Handling Charge</span>
                  <span className="text-purple-900">₹{handlingCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2 font-bold">
                  <span>Grand Total</span>
                  <span className="text-orange-600">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-5">
              <div className="flex justify-between mb-3">
                <span className="font-semibold">
                  Total ({cartCount} items)
                </span>

                <span className="font-bold text-green-600">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>

              <button className="w-full border-2 border-orange-500 bg-white text-orange-500 hover:bg-orange-600 hover:text-white py-3 rounded-xl font-bold">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </main>

    </div>
  );
};

export default Cart;