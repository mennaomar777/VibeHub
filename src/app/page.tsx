"use client";

import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "@/lib/authSlice";
import { dispatchType, stateType } from "@/lib/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getUserData } from "@/lib/profileSlice";
import Link from "next/link";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import KeyOutlined from "@mui/icons-material/KeyOutlined";

const fieldSx = {
  mb: 1.5,
  "& .MuiOutlinedInput-root": {
    minHeight: 50,
    borderRadius: "14px",
    bgcolor: "var(--surface-subtle)",
    color: "var(--text-primary)",
    "& .MuiOutlinedInput-input": {
      color: "var(--text-primary)",
      "&::placeholder": {
        color: "var(--text-muted)",
        opacity: 1,
      },
    },
    "& .MuiSvgIcon-root": {
      color: "var(--text-muted)",
    },
    "& fieldset": {
      borderColor: "var(--border)",
    },
    "&:hover fieldset": {
      borderColor: "var(--border-strong)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--accent-strong)",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "var(--danger-text)",
    mx: 0.5,
  },
};

export default function Login() {
  const dispatch = useDispatch<dispatchType>();
  const { isLoading } = useSelector((state: stateType) => state.auth);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    login: Yup.string().trim().required("Email or username is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { login: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      const identifier = values.login.trim();
      const credentials = identifier.includes("@")
        ? { email: identifier, password: values.password }
        : { username: identifier, password: values.password };

      dispatch(handleLogin(credentials))
        .unwrap()
        .then(() => {
          toast.success("Welcome back!");
          router.push("/feed");
          dispatch(getUserData());
        })
        .catch((error: unknown) => {
          const message =
            typeof error === "string"
              ? error
              : error instanceof Error
                ? error.message
                : "Incorrect email or password";

          toast.error(message);
        });
    },
  });

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        bgcolor: "var(--app-bg)",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "minmax(0, 1.25fr) minmax(380px, 0.95fr)",
        },
        alignItems: "center",
        gap: { xs: 4, md: 7, lg: 10 },
        px: { xs: 2, sm: 5, lg: "5vw" },
        py: { xs: 4, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 870, mx: "auto", width: "100%" }}>
        <Typography
          component="h1"
          sx={{
            color: "var(--accent-strong)",
            fontSize: { xs: 42, sm: 54, md: 64 },
            fontWeight: 800,
            letterSpacing: "-0.055em",
            lineHeight: 1.05,
          }}
        >
          vibeHub
        </Typography>

        <Typography
          sx={{
            color: "var(--text-primary)",
            fontSize: { xs: 18, sm: 20, md: 23 },
            lineHeight: 1.5,
            mt: 2,
          }}
        >
          Share what matters, keep up with your friends, and find your people.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: "24px",
            border: "1px solid var(--border)",
            bgcolor: "var(--surface)",
            boxShadow: "0 2px 5px rgb(11 49 143 / 8%)",
          }}
        >
          <Typography
            sx={{
              color: "var(--accent-strong)",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: ".12em",
            }}
          >
            A PLACE FOR YOUR PEOPLE
          </Typography>

          <Typography
            sx={{
              color: "var(--text-primary)",
              fontSize: 21,
              fontWeight: 750,
              mt: 1,
            }}
          >
            Your world, all in one place
          </Typography>

          <Typography
            sx={{
              color: "var(--text-secondary)",
              fontSize: 15,
              lineHeight: 1.65,
              mt: 1.5,
            }}
          >
            Share everyday moments, join conversations, and stay close to the
            people and interests that make your world yours.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
              },
              gap: 1.2,
              mt: 2.5,
            }}
          >
            {[
              ["2024", "LAUNCHED"],
              ["40K+", "COMMUNITY MEMBERS"],
              ["500+", "COMMUNITIES"],
              ["5", "WAYS TO CONNECT"],
              ["20+", "INTERESTS TO EXPLORE"],
            ].map(([value, label]) => (
              <Box
                key={label}
                sx={{
                  p: 1.8,
                  border: "1px solid var(--border)",
                  borderRadius: "18px",
                  bgcolor: "var(--surface-subtle)",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--accent-strong)",
                    fontSize: 17,
                    lineHeight: 1.2,
                    fontWeight: 800,
                  }}
                >
                  {value}
                </Typography>

                <Typography
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: 10,
                    fontWeight: 800,
                    mt: 0.7,
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 645,
          justifySelf: "center",
          p: { xs: 2.5, sm: 4.5 },
          borderRadius: "24px",
          bgcolor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            p: 0.6,
            mb: 3.5,
            borderRadius: "18px",
            bgcolor: "var(--surface-subtle)",
          }}
        >
          <Button
            disableElevation
            variant="contained"
            sx={{
              py: 1.2,
              color: "var(--accent-strong)",
              bgcolor: "var(--surface)",
              fontWeight: 800,
              textTransform: "none",
              borderRadius: "14px",
              boxShadow: "0 2px 5px rgb(24 34 55 / 12%)",
              "&:hover": {
                bgcolor: "var(--surface)",
              },
            }}
          >
            Login
          </Button>

          <Button
            component={Link}
            href="/register"
            sx={{
              py: 1.2,
              color: "var(--text-secondary)",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "14px",
              "&:hover": {
                bgcolor: "var(--surface-hover)",
              },
            }}
          >
            Register
          </Button>
        </Box>

        <Typography
          component="h2"
          sx={{
            color: "var(--text-primary)",
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-.03em",
          }}
        >
          Welcome back
        </Typography>

        <Typography
          sx={{
            color: "var(--text-muted)",
            fontSize: 15,
            mb: 3,
          }}
        >
          Log in to your vibeHub account.
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth
            id="login"
            name="login"
            type="text"
            placeholder="Email or username"
            autoComplete="username"
            value={formik.values.login}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.login && Boolean(formik.errors.login)}
            helperText={formik.touched.login && formik.errors.login}
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={fieldSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyOutlined fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 0.6,
              minHeight: 52,
              borderRadius: "14px",
              bgcolor: "var(--accent-strong)",
              color: "#ffffff",
              fontSize: 16,
              fontWeight: 800,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "var(--accent-strong)",
                filter: "brightness(0.92)",
                boxShadow: "none",
              },
              "html[data-theme='dark'] &": {
                color: "#172033",
              },
              "&.Mui-disabled": {
                bgcolor: "var(--accent-disabled)",
                color: "var(--text-muted)",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={26} color="inherit" />
            ) : (
              "Log in"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
