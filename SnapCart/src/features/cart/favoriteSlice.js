import { createSlice } from "@reduxjs/toolkit";
import { getItemIdentity } from "../../utils/cartTotals";

const initialState = {
  favorites: [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const fav = action.payload;
      const favIdentity = getItemIdentity(fav);

      const existingItem = state.favorites.find(
        (i) => getItemIdentity(i) === favIdentity
      );

      if (existingItem) {
        state.favorites = state.favorites.filter(
          (i) => getItemIdentity(i) !== favIdentity
        );
      } else {
        state.favorites.push(fav);
      }
    },

    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
