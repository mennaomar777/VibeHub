"use client";
import {
  Box,
  Button,
  CircularProgress,
  Container,
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

export default function Login() {
  const dispatch = useDispatch<dispatchType>();
  const { isLoading } = useSelector((state: stateType) => state.auth);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(handleLogin(values))
        .unwrap()
        .then(() => {
          toast.success("Welcome back!");
          router.push("/feed");
          dispatch(getUserData());
        })
        .catch(() => {
          toast.error("Incorrect email or password");
        });
    },
  });

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 4, sm: 6 },
          width: "100%",
          maxWidth: 480,
          borderRadius: 4,
          boxShadow: "0 8px 32px rgb(0 0 0 / 0.1)",
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          align="center"
          sx={{ mb: 4, color: "primary.main" }}
        >
          Welcome Back
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Log in to your account
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#f8fafc",
              },
            }}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#f8fafc",
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              py: 1.8,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 3,
              textTransform: "none",
              boxShadow: 3,
              "&:hover": {
                boxShadow: 6,
                bgcolor: "primary.dark",
              },
              "&:disabled": {
                bgcolor: "primary.light",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={28} thickness={5} color="inherit" />
            ) : (
              "Log In"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
