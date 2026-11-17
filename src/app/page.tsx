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
    bgcolor: "#f7f9fc",
    "& .MuiOutlinedInput-input": {
      color: "#17263d",
      "&::placeholder": { color: "#8291a8", opacity: 1 },
    },
    "& .MuiSvgIcon-root": { color: "#91a4bf" },
    "& fieldset": { borderColor: "#dbe4f0" },
    "&:hover fieldset": { borderColor: "#b8c9e3" },
    "&.Mui-focused fieldset": { borderColor: "#0b318f" },
  },
};

export default function Login() {
  const dispatch = useDispatch<dispatchType>();
  const { isLoading } = useSelector((state: stateType) => state.auth);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    login: Yup.string()
      .trim()
      .required("Email or username is required"),
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
        bgcolor: "#f0f2f5",
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
            color: "#0b318f",
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
            color: "#17263d",
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
            border: "1px solid #c8d6ff",
            bgcolor: "#fff",
            boxShadow: "0 2px 5px #0b318f1a",
          }}
        >
          <Typography
            sx={{
              color: "#0b318f",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: ".12em",
            }}
          >
            A PLACE FOR YOUR PEOPLE
          </Typography>
          <Typography
            sx={{ color: "#182237", fontSize: 21, fontWeight: 750, mt: 1 }}
          >
            Your world, all in one place
          </Typography>
          <Typography
            sx={{ color: "#40516c", fontSize: 15, lineHeight: 1.65, mt: 1.5 }}
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
                  border: "1px solid #c8d6ff",
                  borderRadius: "18px",
                  bgcolor: "#f2f5ff",
                }}
              >
                <Typography
                  sx={{
                    color: "#0b318f",
                    fontSize: 17,
                    lineHeight: 1.2,
                    fontWeight: 800,
                  }}
                >
                  {value}
                </Typography>
                <Typography
                  sx={{
                    color: "#4b5c77",
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
          bgcolor: "#fff",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            p: 0.6,
            mb: 3.5,
            borderRadius: "18px",
            bgcolor: "#f0f4f9",
          }}
        >
          <Button
            disableElevation
            variant="contained"
            sx={{
              py: 1.2,
              color: "#082b83",
              bgcolor: "#fff",
              fontWeight: 800,
              textTransform: "none",
              borderRadius: "14px",
              boxShadow: "0 2px 5px #18223720",
              "&:hover": { bgcolor: "#fff" },
            }}
          >
            Login
          </Button>
          <Button
            component={Link}
            href="/register"
            sx={{
              py: 1.2,
              color: "#40516c",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "14px",
            }}
          >
            Register
          </Button>
        </Box>

        <Typography
          component="h2"
          sx={{
            color: "#101828",
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-.03em",
          }}
        >
          Welcome back
        </Typography>
        <Typography sx={{ color: "#71809a", fontSize: 15, mb: 3 }}>
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
              bgcolor: "#0b318f",
              fontSize: 16,
              fontWeight: 800,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#082875", boxShadow: "none" },
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




