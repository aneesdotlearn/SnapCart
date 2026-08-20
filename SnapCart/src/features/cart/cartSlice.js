import { createSlice } from "@reduxjs/toolkit";
import { getCartTotal, getItemIdentity } from "../../utils/cartTotals";

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
      const itemIdentity = getItemIdentity(item);
      const existingItem = state.items.find(
        (cartItem) => getItemIdentity(cartItem) === itemIdentity,
      );

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
      state.items = state.items.filter(
        (item) => getItemIdentity(item) !== action.payload,
      );
      syncTotalAndStorage(state);
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (cartItem) => getItemIdentity(cartItem) === action.payload,
      );

      if (item) {
        item.quantity += 1;
      }

      syncTotalAndStorage(state);
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (cartItem) => getItemIdentity(cartItem) === action.payload,
      );

      if (!item) {
        return;
      }

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter(
          (cartItem) => getItemIdentity(cartItem) !== action.payload,
        );
      }

      syncTotalAndStorage(state);
    },

    clearItem: (state, action) => {
      state.items = state.items.filter(
        (item) => getItemIdentity(item) !== action.payload,
      );
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
