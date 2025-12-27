"use client";
import { Box, Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        py: 8,
      }}
    >
      <Typography
        variant="h3"
        fontWeight={700}
        sx={{ mb: 3, color: "error.main" }}
      >
        Something went wrong!
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 500 }}
      >
        We&apos;re having trouble loading this page. Please try again.
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => reset()}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Try Again
        </Button>

        <Button
          variant="outlined"
          onClick={() => router.push("/feed")}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
