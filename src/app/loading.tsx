import { Box, CircularProgress, Container, Paper, Skeleton, Typography } from "@mui/material";
import HubOutlined from "@mui/icons-material/HubOutlined";

export default function Loading() {
  return (
    <Box
      role="status"
      aria-label="Loading VibeHub"
      sx={{ minHeight: "calc(100vh - 60px)", bgcolor: "#f0f2f5", py: { xs: 3, md: 5 } }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            border: "1px solid #e1e8f1",
            borderRadius: "22px",
            bgcolor: "#fff",
            boxShadow: "0 8px 24px rgb(24 34 55 / 0.06)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box sx={{ width: 42, height: 42, display: "grid", placeItems: "center", borderRadius: "13px", color: "#fff", background: "linear-gradient(145deg, #1769e8 0%, #0b318f 100%)" }}>
              <HubOutlined />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: "#172033", fontSize: 16, fontWeight: 800 }}>
                VibeHub
              </Typography>
              <Typography sx={{ color: "#71809a", fontSize: 13 }}>
                Getting your page ready
              </Typography>
            </Box>
            <CircularProgress size={22} thickness={4} />
          </Box>
          <Skeleton variant="rounded" animation="wave" height={78} sx={{ mt: 2.5, borderRadius: "14px" }} />
          <Skeleton animation="wave" width="68%" height={20} sx={{ mt: 1.5 }} />
          <Skeleton animation="wave" width="44%" height={20} />
        </Paper>
      </Container>
    </Box>
  );
}
