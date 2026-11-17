"use client";

import { Box, Button, Container, Paper, Typography } from "@mui/material";
import ErrorOutlineRounded from "@mui/icons-material/ErrorOutlineRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import { useRouter } from "next/navigation";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: "calc(100vh - 60px)", display: "grid", placeItems: "center", bgcolor: "#f0f2f5", px: 2, py: 5 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          role="alert"
          sx={{ p: { xs: 3, sm: 4 }, textAlign: "center", border: "1px solid #e1e8f1", borderRadius: "22px", bgcolor: "#fff", boxShadow: "0 8px 24px rgb(24 34 55 / 0.07)" }}
        >
          <Box sx={{ width: 60, height: 60, mx: "auto", mb: 2, display: "grid", placeItems: "center", borderRadius: "18px", bgcolor: "#fff1f1", color: "#d14343" }}>
            <ErrorOutlineRounded sx={{ fontSize: 32 }} />
          </Box>
          <Typography component="h1" sx={{ color: "#172033", fontSize: { xs: 20, sm: 23 }, fontWeight: 850 }}>
            Something went wrong
          </Typography>
          <Typography sx={{ maxWidth: 380, mx: "auto", mt: 0.75, color: "#71809a", fontSize: 14, lineHeight: 1.65 }}>
            This page couldn’t load properly. You can try again or return to your feed.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1, mt: 2.5 }}>
            <Button variant="contained" startIcon={<RefreshRounded />} onClick={reset} sx={{ borderRadius: "12px", px: 2, py: 1, fontWeight: 750, textTransform: "none", boxShadow: "none" }}>
              Try again
            </Button>
            <Button startIcon={<HomeRounded />} onClick={() => router.push("/feed")} sx={{ borderRadius: "12px", px: 2, py: 1, color: "#40516c", fontWeight: 750, textTransform: "none" }}>
              Back to feed
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
