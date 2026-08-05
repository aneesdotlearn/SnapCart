import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem("token") ? localStorage.getItem("token") : null;

const initialState = {
    user : null,
    token : initialToken || null,
    isAuthenticated : !!initialToken
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        loginSuccess: (state, action) =>{
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            if (action.payload.token) {
                localStorage.setItem("token", action.payload.token);
            }
        },

        logout:  (state, action) =>{
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
        }

    }
})

export const {loginSuccess, logout} = userSlice.actions;
export default userSlice.reducer;