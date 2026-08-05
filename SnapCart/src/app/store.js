import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import favoriteReducer from "../features/cart/favoriteSlice";
import userReducer from "../features/user/userSlice"


const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorite: favoriteReducer,
    user : userReducer,
  },
}); 
export { store };