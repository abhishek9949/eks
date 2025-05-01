import React, { useEffect, useState } from "react";
import { Button, Snackbar, Alert, Typography, Box } from "@mui/material";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent !== "accepted") {
      const timer = setTimeout(() => setOpen(true), 5500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setOpen(false);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  if (!open) return null;

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // Changed to left
      sx={{
        width: "calc(100% - 16px)",
        maxWidth: "600px",
        mb: "16px",
        "& .MuiSnackbarContent-root": {
          width: "100%",
        },
      }}
    >
      <Alert
        severity="info"
        variant="outlined"
        sx={{ width: "100%", backgroundColor: "white" }}
        action={
          <Button size="small" variant="contained" onClick={handleAccept}>
            Accept
          </Button>
        }
      >
        <Box>
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            We use cookies
          </Typography>
          <Typography variant="body2">
            This website uses cookies to ensure you get the best experience on
            our website. By continuing to use our site, you accept our use of
            cookies.
          </Typography>
          <Link href={URL_CONSTANTS.FOOTER_COOKIE_POLICY} className="underline">
            Cookies Polices
          </Link>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default CookieConsent;
