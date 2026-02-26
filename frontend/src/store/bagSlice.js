import { createSlice } from "@reduxjs/toolkit";

// Cart state: array of { productId, product (full object), quantity }
const bagSlice = createSlice({
  name: "bag",
  initialState: [],
  reducers: {
    addToBag: (state, action) => {
      // action.payload = full product object
      const product = action.payload;
      const existing = state.find((item) => item.productId === product._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.push({ productId: product._id, product, quantity: 1 });
      }
    },
    removeFromBag: (state, action) => {
      // action.payload = productId
      return state.filter((item) => item.productId !== action.payload);
    },
    updateQuantity: (state, action) => {
      // action.payload = { productId, quantity }
      const item = state.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    clearBag: () => {
      return [];
    },
  },
});

export const bagActions = bagSlice.actions;
export default bagSlice;
