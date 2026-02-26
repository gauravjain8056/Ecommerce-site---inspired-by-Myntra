import { createSlice } from "@reduxjs/toolkit";

// Attempt to rehydrate from localStorage on app load
const storedToken = localStorage.getItem("marketplace_token");
const storedUser = localStorage.getItem("marketplace_user");

const initialState = {
    token: storedToken || null,
    user: storedUser ? JSON.parse(storedUser) : null,
    // user shape: { id, name, email, role }
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(state, action) {
            // action.payload = { token, user }
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem("marketplace_token", action.payload.token);
            localStorage.setItem("marketplace_user", JSON.stringify(action.payload.user));
        },
        logout(state) {
            state.token = null;
            state.user = null;
            localStorage.removeItem("marketplace_token");
            localStorage.removeItem("marketplace_user");
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice;
