import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
  const item = action.payload;

  const existingItem = state.items.find(i => i.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.items.push({
      ...item,
      quantity: 1,
    });
  }

  state.totalAmount = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
},
    // REMOVEFROMCART
    removeFromCart: (state, action) => {
  state.items = state.items.filter(
    (item) => item.id !== action.payload
  );

  state.totalAmount = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
},
    increaseQuantity: (state, action) => {
  const item = state.items.find(
    (i) => i.id === action.payload
  );

  if (item) {
    item.quantity += 1;
  }

  state.totalAmount = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
},
    decreaseQuantity: (state, action) => {
  const itemId = action.payload;
  const item = state.items.find((i) => i.id === itemId);

  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    state.items = state.items.filter(
      (i) => i.id !== itemId
    );
  }

  state.totalAmount = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
},
    clearItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    grandTotal : (state) => {
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
}
});

export const { addToCart, removeFromCart, increaseQuantity,decreaseQuantity, clearItem, grandTotal } = cartSlice.actions;
export default cartSlice.reducer;