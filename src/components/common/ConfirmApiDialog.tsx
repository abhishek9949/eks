"use client";
import React from "react";
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

interface ConfirmApiDialogType {
  open: boolean;
  handleClose: () => void;
  message: string;
}
const ConfirmApiDialog = ({
  open,
  handleClose,
  message,
}: ConfirmApiDialogType) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          className="!absolute !right-2 !top-2 text-gray-8"
        >
          <CloseIcon />
        </IconButton>
        <DialogContent className="min-w-70 md:min-w-120">
          <Box className="!mx-5 !py-10 text-center">
            <CheckCircleOutlineOutlinedIcon className="!mb-3 !text-5xl text-green" />
            <Box className="text-2xl">
              {message || "Successfully submitted."}
            </Box>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ConfirmApiDialog;
