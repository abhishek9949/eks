import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpenReport: false,
  isConfirmReport: false,
  isReportedLoading: false,
};

const reportCommentSlice = createSlice({
  name: "reportComment",
  initialState,
  reducers: {
    showOpenReport: (state) => {
      state.isOpenReport = true;
    },
    hideOpenReport: (state) => {
      state.isOpenReport = false;
    },

    showConfirmReport: (state) => {
      state.isConfirmReport = true;
    },
    hideConfirmReport: (state) => {
      state.isConfirmReport = false;
    },

    loadingReportedAction: (state, action) => {
      state.isReportedLoading = action.payload;
    },
  },
});

export const {
  showOpenReport,
  hideOpenReport,
  loadingReportedAction,
  showConfirmReport,
  hideConfirmReport,
} = reportCommentSlice.actions;
export default reportCommentSlice;
