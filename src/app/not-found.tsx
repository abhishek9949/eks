"use client";

import React from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { Container, Typography, Box } from "@mui/material";

export default function PageNotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="md" className="flex h-[70vh] items-center justify-center">
      <Box textAlign="center">
        <Typography variant="h3" className="text-xl font-semibold text-primary">
          404
        </Typography>
        <Typography
          variant="h1"
          className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl"
        >
          Page not found
        </Typography>
        <Typography
          variant="body1"
          className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8"
        >
          Sorry, we couldn’t find the page you’re looking for.
        </Typography>
        <Box className="mt-10 flex items-center justify-center gap-x-6">
          <Button
            variant="contained"
            color="primary"
            disableRipple
            className="!bg-primary"
            onClick={() => router.back()}
          >
            Go back
          </Button>

          <Link href={URL_CONSTANTS.SUPPORT_URL} className="text-sm font-semibold text-gray-900">
            <Button
              variant="outlined"
              className="!text-gray-900"
              endIcon={<ArrowForwardIcon />}
              disableRipple
            >
              Contact support
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}