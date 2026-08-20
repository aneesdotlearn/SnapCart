import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import CartSidebar from './CartSidebar';
import { toggleFavorite, clearFavorites } from "../features/cart/favoriteSlice";
import { FaHeart } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState } from "react";
import { getItemIdentity } from "../utils/cartTotals";

const Favorite = () => {
  const dispatch = useDispatch();

  const favorites = useSelector((state) => state.favorite.favorites);

  const [isCartOpen, setIsCartOpen] = useState(false);
      // const count = useSelector((state) => state.cart.items.length);
      // const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
      // const cartCount = useSelector((state) => state.cart.items.length);
      const cartCount = useSelector((state) =>
        state.cart.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        )
      );


  
  console.log(favorites);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar cartCount={cartCount} openCart={() => setIsCartOpen(true)}/>
    <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}/>

      <main className="flex-1 px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          My Favorites
        </h1>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-24">
            <FaHeart className="text-6xl text-orange-400 mb-4" />

            <h2 className="text-2xl font-semibold">
              No Favorites Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Save your favourite products to see them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {favorites.map((fav, index) => (
              <div
                key={getItemIdentity(fav) || `${fav.name}-${index}`}
                className="bg-white p-2 rounded-lg shadow-md flex flex-col items-center gap-3 cursor-pointer hover:scale-105
                        transition duration-300">
                <div className="flex items-center gap-5">
                  <img
                    src={fav.image}
                    alt={fav.name}
                    onError={(event) => {
                      event.currentTarget.src = "/favicon.svg";
                    }}
                    className="h-[120px]"
                  />

                  
                </div>
                
                  <h2 className="text-lg font-semibold text-purple-900 min-h-[60px] line-clamp-2">
                      {fav.name}
                    </h2>
                  <div className="flex flex-row items-center gap-2">
                    <p className="font-bold text-orange-500 mt-2">
                      ₹{fav.price}
                    </p>
                    <del className="text-gray-500 mt-2">
                      ₹{(fav.price * 1.2).toFixed(2)}
                    </del>
                  </div>
                

                <div className="flex justify-between gap-3 pb-2">
                  <button
                    onClick={() => dispatch(addToCart(fav))}
                    className="px-4 py-1 border-2 border-orange-500 rounded-xl bg-white text-orange-500 font-bold text-sm shadow-md hover:bg-orange-500 hover:text-white transition-all duration-200 shadow-[0_4px_8px_rgba(249,115,22,0.25)]"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => dispatch(toggleFavorite(fav))}
                    className="flex items-center justify-center gap-2 text-red-500 hover:text-red-700"
                  >
                    <MdDeleteOutline size={22} className="text-orange-500" />
                  </button>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favorite;
