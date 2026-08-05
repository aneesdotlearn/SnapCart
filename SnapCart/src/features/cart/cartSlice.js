import { createSlice } from "@reduxjs/toolkit";
import { getCartTotal } from "../../utils/cartTotals";

const getStoredCart = () => {
  if (typeof localStorage === "undefined") {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("Unable to parse stored cart:", error);
    return [];
  }
};

const storedCart = getStoredCart();

const initialState = {
  items: storedCart,
  totalAmount: getCartTotal(storedCart),
  deliveryCharge: 0,
};

const saveCartToLocalStorage = (items) => {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem("cart", JSON.stringify(items));
};

const syncTotalAndStorage = (state) => {
  state.totalAmount = getCartTotal(state.items);
  saveCartToLocalStorage(state.items);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...item,
          quantity: 1,
        });
      }

      syncTotalAndStorage(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      syncTotalAndStorage(state);
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload);

      if (item) {
        item.quantity += 1;
      }

      syncTotalAndStorage(state);
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload);

      if (!item) {
        return;
      }

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter(
          (cartItem) => cartItem.id !== action.payload,
        );
      }

      syncTotalAndStorage(state);
    },

    clearItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      syncTotalAndStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      syncTotalAndStorage(state);
    },

    subTotal: (state) => {
      syncTotalAndStorage(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearItem,
  clearCart,
  subTotal,
} = cartSlice.actions;

export default cartSlice.reducer;
