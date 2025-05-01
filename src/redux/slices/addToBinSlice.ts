import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpenAddToBin: false,
  isConfirmAddToBin: false,
  isAddToBinLoading: false,
};

const addToBinSlice = createSlice({
  name: "addToBin",
  initialState,
  reducers: {
    showOpenAddToBin: (state) => {
      state.isOpenAddToBin = true;
    },
    hideOpenAddToBin: (state) => {
      state.isOpenAddToBin = false;
    },

    showConfirmAddToBin: (state) => {
      state.isConfirmAddToBin = true;
    },
    hideConfirmAddToBin: (state) => {
      state.isConfirmAddToBin = false;
    },

    loadingAddToBinedAction: (state, action) => {
      state.isAddToBinLoading = action.payload;
    },
  },
});

export const {
  showOpenAddToBin,
  hideOpenAddToBin,
  loadingAddToBinedAction,
  showConfirmAddToBin,
  hideConfirmAddToBin,
} = addToBinSlice.actions;
export default addToBinSlice;
