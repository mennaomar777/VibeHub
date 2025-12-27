"use client";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { handleRegister } from "@/lib/authSlice";
import { dispatchType, stateType } from "@/lib/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch<dispatchType>();
  const { isLoading } = useSelector((state: stateType) => state.auth);

  const gender = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    dateOfBirth: Yup.string().required("Date of birth is required"),
    gender: Yup.string().required("Gender is required"),
  });

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    dateOfBirth: string;
    gender: string;
  }) => {
    const [year, month, day] = values.dateOfBirth.split("-");
    const formattedDate = `${month}-${day}-${year}`;
    const finalValues = { ...values, dateOfBirth: formattedDate };

    try {
      await dispatch(handleRegister(finalValues)).unwrap();
      toast.success("Registration successful!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 4, sm: 6 },
          width: "100%",
          maxWidth: 520,
          borderRadius: 4,
          boxShadow: "0 8px 32px rgb(0 0 0 / 0.1)",
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          align="center"
          sx={{ mb: 2, color: "primary.main" }}
        >
          Create Account
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Join us today
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            variant="outlined"
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
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            variant="outlined"
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
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            variant="outlined"
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
            id="rePassword"
            name="rePassword"
            label="Confirm Password"
            type="password"
            value={formik.values.rePassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.rePassword && Boolean(formik.errors.rePassword)
            }
            helperText={formik.touched.rePassword && formik.errors.rePassword}
            variant="outlined"
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
            id="dateOfBirth"
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={formik.values.dateOfBirth}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)
            }
            helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#f8fafc",
              },
            }}
          />

          <TextField
            select
            fullWidth
            id="gender"
            name="gender"
            label="Gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.gender && Boolean(formik.errors.gender)}
            helperText={
              (formik.touched.gender && formik.errors.gender) ||
              "Please select your gender"
            }
            variant="outlined"
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#f8fafc",
              },
            }}
          >
            {gender.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

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
              "Sign Up"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
