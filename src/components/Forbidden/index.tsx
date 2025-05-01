"use client";

import React from "react";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { Container, Typography, Box } from "@mui/material";

const Forbidden: React.FC = () => {
  const router = useRouter();

  return (
    <Container maxWidth="md" className="flex h-[70vh] items-center justify-center">
      <Box textAlign="center">
        <Typography variant="h3" className="text-xl font-semibold text-primary">
          403
        </Typography>
        <Typography
          variant="h1"
          className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl"
        >
          Access Denied
        </Typography>
        <Typography
          variant="body1"
          className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8"
        >
          You don’t have permission to access this page.
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
        </Box>
      </Box>
    </Container>
  );
};

export default Forbidden;
