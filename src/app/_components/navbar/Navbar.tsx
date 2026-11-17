"use client";

import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  Badge,
} from "@mui/material";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import HubOutlined from "@mui/icons-material/HubOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutline from "@mui/icons-material/PersonOutline";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { dispatchType, stateType } from "@/lib/store";
import { logout } from "@/lib/authSlice";
import { getUserData } from "@/lib/profileSlice";
import toast from "react-hot-toast";
import {
  getUnreadCount,
  resetNotifications,
} from "../../../lib/notificationSlice";
import { useColorMode } from "../ColorModeProvider";
const pages = ["Feed", "Profile"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const [token, setToken] = React.useState<string | null>(null);
  const isLoggedIn = Boolean(token);
  const pathname = usePathname();
  const dispatch = useDispatch<dispatchType>();
  const router = useRouter();
  const { mode, toggleColorMode } = useColorMode();
  const { userData } = useSelector((state: stateType) => state.profile);
  const { unreadCount } = useSelector(
    (state: stateType) => state.notifications,
  );
  React.useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [pathname]);

  React.useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUnreadCount());
    }
  }, [isLoggedIn, dispatch]);

  let userId: string | null = null;

  if (token) {
    try {
      const decoded = jwtDecode<{ user?: string }>(token);
      userId = decoded.user ?? null;
    } catch {
      userId = null;
    }
  }

  React.useEffect(() => {
    if (isLoggedIn) dispatch(getUserData());
  }, [isLoggedIn, dispatch]);

  const closeNavMenu = () => setAnchorElNav(null);
  const closeUserMenu = () => setAnchorElUser(null);

  const handleNavClick = (path: string) => {
    router.push(path);
    closeNavMenu();
    closeUserMenu();
  };

  const profilePath = userId ? `/profile/${userId}` : "/profile";
  const isFeedActive = pathname === "/feed";
  const isProfileActive = pathname.startsWith("/profile");

  const handleLogout = () => {
    setToken(null);
    dispatch(logout());
    dispatch(resetNotifications());
    toast.success("Logged out successfully!");
    router.push("/");
    closeUserMenu();
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "var(--nav-bg)",
          color: "var(--text-primary)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "0 4px 18px rgb(15 23 42 / 0.045)",
          backdropFilter: "blur(14px)",
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 1.5, sm: 2.5, lg: 4 } }}>
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 52, md: 60 },
              position: "relative",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              component={Link}
              href={isLoggedIn ? "/feed" : "/"}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                flexShrink: 0,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: 34,
                  height: 34,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "11px",
                  color: "#fff",
                  background: "linear-gradient(145deg, #1769e8 0%, #0b318f 100%)",
                  boxShadow: "0 4px 10px rgb(23 105 232 / 0.22)",
                }}
              >
                <HubOutlined sx={{ fontSize: 21 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: 16, sm: 19 },
                  fontWeight: 850,
                  letterSpacing: "-.04em",
                  color: "var(--text-primary)",
                }}
              >
                vibeHub
              </Typography>
            </Box>

            {isLoggedIn && (
              <Box
                component="nav"
                aria-label="Main navigation"
                sx={{
                  position: { md: "absolute" },
                  left: { md: "50%" },
                  transform: { md: "translateX(-50%)" },
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 0.5,
                  p: 0.35,
                  border: "1px solid var(--border)",
                  borderRadius: "15px",
                  bgcolor: "var(--surface-subtle)",
                }}
              >
                <Button
                  startIcon={<HomeOutlined />}
                  onClick={() => handleNavClick("/feed")}
                  aria-current={isFeedActive ? "page" : undefined}
                  sx={{
                    minHeight: 36,
                    px: 1.4,
                    borderRadius: "13px",
                    textTransform: "none",
                    fontSize: 14,
                    fontWeight: 750,
                    color: isFeedActive ? "#1769e8" : "var(--text-secondary)",
                    bgcolor: isFeedActive ? "var(--accent-soft)" : "transparent",
                    boxShadow: "none",
                    transition: "background-color 140ms ease, color 140ms ease",
                    "&:hover": {
                      bgcolor: isFeedActive ? "var(--accent-soft)" : "var(--surface-hover)",
                    },
                    "&:focus-visible": {
                      outline: "2px solid #70aafa",
                      outlineOffset: 1,
                    },
                    "& .MuiButton-startIcon": { mr: 1 },
                    "& .MuiSvgIcon-root": { fontSize: 19 },
                  }}
                >
                  Feed
                </Button>
                <Button
                  startIcon={<PersonOutline />}
                  onClick={() => handleNavClick(profilePath)}
                  aria-current={isProfileActive ? "page" : undefined}
                  sx={{
                    minHeight: 36,
                    px: 1.4,
                    borderRadius: "13px",
                    textTransform: "none",
                    fontSize: 14,
                    fontWeight: 750,
                    color: isProfileActive ? "#1769e8" : "var(--text-secondary)",
                    bgcolor: isProfileActive ? "var(--accent-soft)" : "transparent",
                    boxShadow: "none",
                    transition: "background-color 140ms ease, color 140ms ease",
                    "&:hover": {
                      bgcolor: isProfileActive ? "var(--accent-soft)" : "var(--surface-hover)",
                    },
                    "&:focus-visible": {
                      outline: "2px solid #70aafa",
                      outlineOffset: 1,
                    },
                    "& .MuiButton-startIcon": { mr: 1 },
                    "& .MuiSvgIcon-root": { fontSize: 19 },
                  }}
                >
                  Profile
                </Button>
                <Button
                  startIcon={
                    <Badge
                      badgeContent={unreadCount}
                      color="error"
                      max={99}
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: 10,
                          minWidth: 16,
                          height: 16,
                        },
                      }}
                    >
                      <NotificationsNoneOutlined />
                    </Badge>
                  }
                  onClick={() => handleNavClick("/notifications")}
                  aria-current={
                    pathname === "/notifications" ? "page" : undefined
                  }
                  sx={{
                    minHeight: 36,
                    px: 1.4,
                    borderRadius: "13px",
                    textTransform: "none",
                    fontSize: 14,
                    fontWeight: 750,
                    color: pathname === "/notifications" ? "#1769e8" : "var(--text-secondary)",
                    bgcolor: pathname === "/notifications" ? "var(--accent-soft)" : "transparent",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "var(--surface-hover)",
                    },
                    "& .MuiSvgIcon-root": { fontSize: 19 },
                  }}
                >
                  Notifications
                </Button>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1.5 },
                ml: { xs: "auto", md: 0 },
              }}
            >
              {isLoggedIn ? (
                <>
                  <IconButton
                    aria-label="Open navigation menu"
                    onClick={(event) => setAnchorElNav(event.currentTarget)}
                    aria-expanded={Boolean(anchorElNav)}
                    sx={{
                      display: { xs: "inline-flex", md: "none" },
                      width: 38,
                      height: 38,
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      "&:hover": { bgcolor: "var(--surface-hover)" },
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Tooltip title="Account menu">
                    <Button
                      onClick={(event) => setAnchorElUser(event.currentTarget)}
                      aria-haspopup="menu"
                      sx={{
                        minHeight: 40,
                        px: { xs: 0.75, sm: 1.2 },
                        gap: 0.9,
                        border: "1px solid var(--border)",
                        borderRadius: "30px",
                        bgcolor: anchorElUser ? "var(--surface-hover)" : "var(--surface)",
                        color: "var(--text-primary)",
                        textTransform: "none",
                        fontSize: 14,
                        fontWeight: 600,
                        transition:
                          "background-color 140ms ease, border-color 140ms ease",
                        "&:hover": {
                          bgcolor: "var(--surface-hover)",
                          borderColor: "#cbd9e9",
                        },
                      }}
                    >
                      <Avatar
                        src={userData?.photo || ""}
                        alt={userData?.name || "User"}
                        sx={{
                          width: 30,
                          height: 30,
                          bgcolor: "var(--accent-soft)",
                          border: "2px solid #fff",
                          boxShadow: "0 0 0 1px #dce5f0",
                        }}
                      />
                      <Typography
                        sx={{
                          display: { xs: "none", sm: "block" },
                          maxWidth: 150,
                        }}
                        noWrap
                      >
                        {userData?.name || "Your profile"}
                      </Typography>
                      <KeyboardArrowDown
                        sx={{ fontSize: 19, color: "var(--text-muted)" }}
                      />
                    </Button>
                  </Tooltip>
                </>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    onClick={() => router.push("/")}
                    sx={{
                      color: "var(--text-secondary)",
                      fontWeight: 700,
                      textTransform: "none",
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => router.push("/register")}
                    sx={{
                      px: 2,
                      borderRadius: "12px",
                      bgcolor: "#0b318f",
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#082875", boxShadow: "none" },
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>

            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={closeNavMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{
                display: { md: "none" },
                "& .MuiPaper-root": {
                  mt: 1,
                  width: 176,
                  maxWidth: "calc(100vw - 24px)",
                  p: 0.75,
                  border: "1px solid var(--border)",
                  borderRadius: "15px",
                  boxShadow: "0 14px 34px rgb(15 23 42 / 0.18)",
                },
                "& .MuiMenuItem-root": {
                  minHeight: 46,
                  px: 1.25,
                  borderRadius: "10px",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontWeight: 650,
                  "&.Mui-selected": {
                    bgcolor: "var(--accent-soft)",
                    color: "#1769e8",
                  },
                  "&.Mui-selected:hover, &:hover": { bgcolor: "var(--surface-hover)" },
                },
                "& .MuiListItemIcon-root": {
                  minWidth: 34,
                  color: "var(--text-muted)",
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  selected={page === "Feed" ? isFeedActive : isProfileActive}
                  onClick={() =>
                    handleNavClick(page === "Feed" ? "/feed" : profilePath)
                  }
                >
                  <ListItemIcon>
                    {page === "Feed" ? (
                      <HomeOutlined fontSize="small" />
                    ) : (
                      <PersonOutline fontSize="small" />
                    )}
                  </ListItemIcon>
                  {page}
                </MenuItem>
              ))}
              <MenuItem
                selected={pathname === "/notifications"}
                onClick={() => handleNavClick("/notifications")}
              >
                <ListItemIcon>
                  <Badge badgeContent={unreadCount} color="error" max={99}>
                    <NotificationsNoneOutlined fontSize="small" />
                  </Badge>
                </ListItemIcon>
                Notifications
              </MenuItem>
            </Menu>

            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={closeUserMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 190,
                  p: 0.5,
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  boxShadow: "0 12px 32px rgb(15 23 42 / 0.14)",
                  "& .MuiMenuItem-root": {
                    minHeight: 40,
                    borderRadius: "9px",
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    "&:hover": { bgcolor: "var(--surface-hover)" },
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: 34,
                    color: "var(--text-muted)",
                  },
                },
              }}
            >
              <MenuItem onClick={() => handleNavClick(profilePath)}>
                <ListItemIcon>
                  <PersonOutline fontSize="small" />
                </ListItemIcon>
                My profile
              </MenuItem>
              <MenuItem onClick={() => handleNavClick("/settings")}>
                <ListItemIcon>
                  <SettingsOutlined fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem
                onClick={() => {
                  toggleColorMode();
                  closeUserMenu();
                }}
              >
                <ListItemIcon>
                  {mode === "light" ? (
                    <DarkModeOutlined fontSize="small" />
                  ) : (
                    <LightModeOutlined fontSize="small" />
                  )}
                </ListItemIcon>
                {mode === "light" ? "Dark mode" : "Light mode"}
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "#c43c48 !important",
                  "&:hover": { bgcolor: "var(--danger-soft) !important" },
                }}
              >
                <ListItemIcon sx={{ color: "#c43c48 !important" }}>
                  <LogoutOutlined fontSize="small" />
                </ListItemIcon>
                Log out
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ height: { xs: 52, md: 60 } }} />
    </>
  );
}

export default Navbar;
