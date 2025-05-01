"use client";

import React, { useTransition } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const GlobalLoader: React.FC = () => {
  const [isPending] = useTransition(); // Detects navigation transition state

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 50 }}
      open={isPending} // Shows loader when navigating
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default GlobalLoader;
