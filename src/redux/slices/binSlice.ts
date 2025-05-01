import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alignment: "list",
};

const binSlice = createSlice({
  name: "binSlice",
  initialState,
  reducers: {
    changeBinAlignment: (state, action) => {
      state.alignment = action.payload.alignment;
    },
  },
});

export const { changeBinAlignment } = binSlice.actions;
export default binSlice;
