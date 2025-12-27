"use client";
import { Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NotFound() {
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
        variant="h1"
        fontWeight={700}
        sx={{ fontSize: "6rem", color: "primary.main" }}
      >
        404
      </Typography>

      <Typography
        variant="h4"
        fontWeight={600}
        sx={{ mb: 3, color: "text.primary" }}
      >
        Oops! Page not found
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 5, maxWidth: 400 }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => router.push("/feed")}
        sx={{
          borderRadius: 3,
          px: 5,
          py: 1.5,
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        Back to Home
      </Button>
    </Container>
  );
}
