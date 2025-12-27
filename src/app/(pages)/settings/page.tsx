"use client";
import React from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, getUserData } from "@/lib/profileSlice";
import { dispatchType, stateType } from "@/lib/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const dispatch = useDispatch<dispatchType>();
  const { isLoading } = useSelector((state: stateType) => state.profile);
  const router = useRouter();

  const validationSchema = Yup.object({
    password: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(6, "New password must be at least 6 characters")
      .required("New password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      dispatch(changePassword(values))
        .unwrap()
        .then(() => {
          toast.success("Password changed successfully!");
          dispatch(getUserData());
          resetForm();
          router.push("/feed");
        })
        .catch((err) => {
          toast.error(err.message || "Failed to change password");
        });
    },
  });

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          align="center"
          sx={{ mb: 4, color: "primary.main" }}
        >
          Settings
        </Typography>

        <Typography variant="h6" align="center" sx={{ mb: 4 }}>
          Change Password
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            name="password"
            label="Current Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            sx={{ mb: 4 }}
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
            }}
          >
            {isLoading ? (
              <CircularProgress size={28} color="inherit" />
            ) : (
              "Change Password"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
