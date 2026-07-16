import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorites: [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const fav = action.payload;

      const existingItem = state.favorites.find(
        (i) => i.id === fav.id
      );

      if (existingItem) {
        state.favorites = state.favorites.filter(
          (i) => i.id !== fav.id
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