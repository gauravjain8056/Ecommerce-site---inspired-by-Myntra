import { createSlice } from "@reduxjs/toolkit";

const fetchStatusSlice = createSlice({
  name: "fetch",
  initialState: {
    fetchStatus: false,
    currentlyFetching: false,
  },
  reducers: {
    setFetchStatus: (state) => {
      state.fetchStatus = true;
    },
    fetchingStarted: (state) => {
      state.currentlyFetching = true;
    },
    fetchingStopped: (state) => {
      state.currentlyFetching = false;
    },
  },
});

export const fetchActions = fetchStatusSlice.actions;
export default fetchStatusSlice;
