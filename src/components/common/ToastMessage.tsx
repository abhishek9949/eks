"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { hideToastMessage } from "@/redux/slices/toastMessageSlice";
import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import { capitalizeFirstLetter } from "@/utils/reusableFunctions";

const ToastMessage = () => {
  const dispatch = useAppDispatch();
  const { isOpen, message, severity } = useAppSelector(
    (state) => state.toastMessage,
  );

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(hideToastMessage());
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        className="!text-white"
      >
        {capitalizeFirstLetter(message)}
      </Alert>
    </Snackbar>
  );
};

export default ToastMessage;
