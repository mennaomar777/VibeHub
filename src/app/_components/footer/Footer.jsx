import { Box, Container, Typography } from "@mui/material";
import HubOutlined from "@mui/icons-material/HubOutlined";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: "var(--surface)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 2.25 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.1 }}>
            <Box
              aria-hidden="true"
              sx={{
                width: 32,
                height: 32,
                display: "grid",
                placeItems: "center",
                borderRadius: "10px",
                color: "#fff",
                background: "linear-gradient(145deg, #1769e8 0%, #0b318f 100%)",
                boxShadow: "0 3px 8px rgb(23 105 232 / 0.18)",
              }}
            >
              <HubOutlined sx={{ fontSize: 19 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "-.03em",
                  lineHeight: 1.2,
                }}
              >
                vibeHub
              </Typography>
              <Typography sx={{ mt: 0.25, color: "var(--text-muted)", fontSize: 11 }}>
                Share what matters.
              </Typography>
            </Box>
          </Box>

          <Typography
            component="small"
            sx={{ color: "var(--text-muted)", fontSize: 12, textAlign: "center" }}
          >
            © {new Date().getFullYear()} VibeHub. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
