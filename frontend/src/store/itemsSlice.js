import { createSlice } from "@reduxjs/toolkit";

const itemsSlice = createSlice({
  name: "items",
  initialState: [],
  reducers: {
    addInitialItems: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const itemsActions = itemsSlice.actions;
export default itemsSlice;
