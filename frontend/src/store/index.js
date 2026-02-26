import { configureStore } from "@reduxjs/toolkit";
import itemsSlice from "./itemsSlice";
import fetchStatusSlice from "./fetchStatusSlice";
import bagSlice from "./bagSlice";
import authSlice from "./authSlice";

const MyntraStore = configureStore({
  reducer: {
    items: itemsSlice.reducer,
    fetch: fetchStatusSlice.reducer,
    bag: bagSlice.reducer,
    auth: authSlice.reducer,
  },
});

export default MyntraStore;
