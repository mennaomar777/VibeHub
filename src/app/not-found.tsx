"use client";

import { Box, Button, Container, Paper, Typography } from "@mui/material";
import SearchOffRounded from "@mui/icons-material/SearchOffRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: "calc(100vh - 60px)", display: "grid", placeItems: "center", bgcolor: "var(--app-bg)", px: 2, py: 5 }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, textAlign: "center", border: "1px solid var(--border)", borderRadius: "22px", bgcolor: "var(--surface)", boxShadow: "0 8px 24px rgb(24 34 55 / 0.07)" }}>
          <Box sx={{ width: 62, height: 62, mx: "auto", mb: 1.75, display: "grid", placeItems: "center", borderRadius: "19px", bgcolor: "var(--accent-soft)", color: "#1769e8" }}>
            <SearchOffRounded sx={{ fontSize: 32 }} />
          </Box>
          <Typography sx={{ color: "#1769e8", fontSize: 14, fontWeight: 850, letterSpacing: ".12em" }}>
            404 · NOT FOUND
          </Typography>
          <Typography component="h1" sx={{ mt: 0.75, color: "var(--text-primary)", fontSize: { xs: 21, sm: 24 }, fontWeight: 850 }}>
            This page isn’t here
          </Typography>
          <Typography sx={{ maxWidth: 360, mx: "auto", mt: 0.75, color: "var(--text-muted)", fontSize: 14, lineHeight: 1.65 }}>
            The link may be outdated, or the page may have moved. Head back to your feed and keep exploring.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1, mt: 2.5 }}>
            <Button variant="contained" startIcon={<HomeRounded />} onClick={() => router.push("/feed")} sx={{ borderRadius: "12px", px: 2, py: 1, fontWeight: 750, textTransform: "none", boxShadow: "none" }}>
              Go to feed
            </Button>
            <Button startIcon={<ArrowBackRounded />} onClick={() => router.back()} sx={{ borderRadius: "12px", px: 2, py: 1, color: "var(--text-secondary)", fontWeight: 750, textTransform: "none" }}>
              Go back
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
