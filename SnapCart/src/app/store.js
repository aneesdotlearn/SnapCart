import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import favoriteReducer from "../features/cart/favoriteSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorite: favoriteReducer,
  },
}); 
export { store };