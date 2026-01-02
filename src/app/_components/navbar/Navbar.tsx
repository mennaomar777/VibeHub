"use client";
import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { dispatchType, stateType } from "@/lib/store";
import { clearData } from "@/lib/authSlice";
import { getUserData } from "@/lib/profileSlice";
import toast from "react-hot-toast";

const pages = ["Home", "Profile"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const { userData } = useSelector((state: stateType) => state.profile);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const isLoggedIn = !!token;

  let id: string | null = null;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      id = decoded.user;
    } catch (error) {
      id = null;
    }
  }

  const dispatch = useDispatch<dispatchType>();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUserData());
    }
  }, [isLoggedIn, dispatch]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearData());
    toast.success("Logged out successfully!");
    router.push("/");
    handleCloseUserMenu();
  };

  const handleNavClick = (path: string) => {
    router.push(path);
    handleCloseNavMenu();
  };

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "primary.main", boxShadow: 3 }}>
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ height: 70, justifyContent: "space-between" }}
          >
            {/* Logo with Icon */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AutoStoriesIcon sx={{ fontSize: 32 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  fontWeight: 700,
                  letterSpacing: ".1rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                VibeHub
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {isLoggedIn && (
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
                <Button
                  color="inherit"
                  onClick={() => handleNavClick("/feed")}
                  sx={{ fontWeight: 600, fontSize: "1.1rem" }}
                >
                  Home
                </Button>
                <Button
                  color="inherit"
                  onClick={() => handleNavClick(`/profile/${id}`)}
                  sx={{ fontWeight: 600, fontSize: "1.1rem" }}
                >
                  Profile
                </Button>
              </Box>
            )}

            {/* Mobile Menu */}
            <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                PaperProps={{ sx: { mt: 1 } }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                {isLoggedIn &&
                  pages.map((page) => (
                    <MenuItem
                      key={page}
                      onClick={() =>
                        handleNavClick(
                          page === "Home" ? "/feed" : `/profile/${id}`
                        )
                      }
                    >
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
              </Menu>
            </Box>

            {/* Right Side - Auth / User */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {!isLoggedIn ? (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    color="inherit"
                    onClick={() => router.push("/")}
                    sx={{ fontWeight: 500 }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => router.push("/register")}
                    sx={{
                      borderColor: "white",
                      fontWeight: 500,
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Register
                  </Button>
                </Box>
              ) : (
                <Tooltip title="Account settings">
                  <Box
                    onClick={handleOpenUserMenu}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      cursor: "pointer",
                      p: 0.5,
                      borderRadius: 2,
                      transition: "background 0.2s",
                    }}
                  >
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        src={userData?.photo || ""}
                        alt={userData?.name || "User"}
                        sx={{
                          width: 40,
                          height: 40,
                          border: "2px solid white",
                        }}
                      />
                    </IconButton>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      {userData?.name || "User"}
                    </Typography>
                  </Box>
                </Tooltip>
              )}

              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{ sx: { mt: 1.5, minWidth: 180 } }}
              >
                <MenuItem onClick={() => handleNavClick(`/profile/${id}`)}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => handleNavClick("/settings")}>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ height: 70 }} />
    </>
  );
}

export default Navbar;
