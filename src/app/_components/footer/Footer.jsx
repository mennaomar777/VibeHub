import { Box, Container, Typography } from "@mui/material";
import React from "react";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: "auto",
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} VibeHub. All rights reserved.
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 1 }}
        >
          Made with ❤️ using Next.js, MUI & Redux Toolkit
        </Typography>
      </Container>
    </Box>
  );
}
