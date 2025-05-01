import { ToastMessageProps } from "@/types/toastMessage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ToastMessageProps = {
  isOpen: false,
  message: "",
  severity: "success",
};

const toastMessageSlice = createSlice({
  name: "toastMessage",
  initialState,
  reducers: {
    showToastMessage: (state, action: PayloadAction<Omit<ToastMessageProps, "isOpen">>) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    hideToastMessage: (state) => {
      state.isOpen = false;
      state.message = "";
    },
  },
});

export const { showToastMessage, hideToastMessage } = toastMessageSlice.actions;
export default toastMessageSlice;
