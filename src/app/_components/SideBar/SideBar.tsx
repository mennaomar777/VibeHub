"use client";

import {
  BookmarkBorderOutlined,
  FeedOutlined,
  PublicOutlined,
  AutoAwesomeOutlined,
} from "@mui/icons-material";
import { Box, Button, Paper } from "@mui/material";

type FeedView = "feed" | "myPosts" | "community" | "saved";

type SideBarProps = {
  activeView: FeedView;
  onViewChange: (view: FeedView) => void;
};

const items = [
  { label: "Feed", icon: <FeedOutlined />, view: "feed" as const },
  {
    label: "My Posts",
    icon: <AutoAwesomeOutlined />,
    view: "myPosts" as const,
  },
  {
    label: "Community",
    icon: <PublicOutlined />,
    view: "community" as const,
  },
  {
    label: "Saved",
    icon: <BookmarkBorderOutlined />,
    view: "saved" as const,
  },
];

export default function SideBar({ activeView, onViewChange }: SideBarProps) {
  return (
    <Paper
      component="nav"
      aria-label="Feed navigation"
      elevation={0}
      sx={{
        position: { lg: "sticky" },
        top: 104,
        p: 1.25,
        border: "1px solid var(--border)",
        borderRadius: "18px",
        bgcolor: "var(--surface)",
        color: "var(--text-primary)",
        boxShadow: "0 2px 5px #18223712",
      }}
    >
      <Box sx={{ display: "grid", gap: 0.35 }}>
        {items.map((item) => {
          const active = item.view === activeView;

          return (
            <Button
              key={item.label}
              onClick={() => onViewChange(item.view)}
              startIcon={item.icon}
              aria-current={active ? "page" : undefined}
              sx={{
                justifyContent: "flex-start",
                minHeight: 46,
                px: 1.5,
                borderRadius: "13px",
                color: active
                  ? "var(--accent-strong)"
                  : "var(--text-secondary)",
                bgcolor: active ? "var(--accent-soft)" : "transparent",
                fontSize: 14,
                fontWeight: 700,
                textTransform: "none",
                "& .MuiSvgIcon-root": {
                  fontSize: 20,
                },
                "&:hover": {
                  bgcolor: active
                    ? "var(--accent-soft)"
                    : "var(--surface-hover)",
                },
                "&.Mui-disabled": {
                  color: "var(--text-secondary)",
                  opacity: 0.8,
                },
                "& .MuiButton-startIcon": {
                  mr: 1.25,
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Box>
    </Paper>
  );
}
