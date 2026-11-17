"use client";

import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "@/lib/profileSlice";
import { dispatchType, stateType } from "@/lib/store";
import toast from "react-hot-toast";

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const validationSchema = Yup.object({
  password: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .matches(
      passwordRule,
      "Use at least 8 characters with uppercase, lowercase, number, and special character.",
    )
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your new password"),
});

export default function SettingsPage() {
  const dispatch = useDispatch<dispatchType>();
  const { isLoading } = useSelector((state: stateType) => state.profile);

  const formik = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(
          changePassword({
            password: values.password,
            newPassword: values.newPassword,
          }),
        ).unwrap();
        toast.success("Password changed successfully");
        resetForm();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to change password",
        );
      }
    },
  });

  const fields = [
    {
      name: "password" as const,
      label: "Current password",
      placeholder: "Enter current password",
      autoComplete: "current-password",
    },
    {
      name: "newPassword" as const,
      label: "New password",
      placeholder: "Enter new password",
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword" as const,
      label: "Confirm new password",
      placeholder: "Re-enter new password",
      autoComplete: "new-password",
    },
  ];

  const hasEmptyField = Object.values(formik.values).some(
    (value) => !value.trim(),
  );

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 52px)",
        "@supports (height: 100dvh)": {
          minHeight: "calc(100dvh - 52px)",
        },
        display: "flex",
        alignItems: "center",
        bgcolor: "var(--app-bg)",
        py: { xs: 1, sm: 3, md: 5 },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          px: { xs: 1.25, sm: 2 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            px: { xs: 1.5, sm: 3, md: 3.5 },
            py: { xs: 1.5, sm: 2.75, md: 3 },
            border: "1px solid var(--border)",
            borderRadius: { xs: "17px", sm: "24px" },
            bgcolor: "var(--surface)",
            boxShadow: "0 2px 5px rgb(24 34 55 / 0.12)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.25 },
              mb: { xs: 2.5, sm: 1.9 },
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: { xs: 42, sm: 46 },
                height: { xs: 42, sm: 46 },
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "var(--accent-soft)",
                color: "var(--accent-strong)",
              }}
            >
              <KeyOutlinedIcon sx={{ fontSize: 23 }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                component="h1"
                sx={{
                  color: "var(--text-primary)",
                  fontSize: { xs: 20, sm: 27 },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: "-.03em",
                }}
              >
                Change Password
              </Typography>

              <Typography
                sx={{
                  mt: 0.35,
                  color: "var(--text-secondary)",
                  fontSize: { xs: 12.5, sm: 14 },
                  lineHeight: 1.5,
                  overflowWrap: "anywhere",
                }}
              >
                Keep your account secure by using a strong password.
              </Typography>
            </Box>
          </Box>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ minWidth: 0 }}
          >
            {fields.map((field) => {
              const touched = formik.touched[field.name];
              const error = formik.errors[field.name];

              return (
                <Box key={field.name} sx={{ mb: { xs: 2, sm: 1.5 } }}>
                  <Typography
                    component="label"
                    htmlFor={field.name}
                    sx={{
                      display: "block",
                      mb: 0.45,
                      color: "var(--text-primary)",
                      fontSize: 14,
                      fontWeight: 750,
                    }}
                  >
                    {field.label}
                  </Typography>

                  <TextField
                    fullWidth
                    id={field.name}
                    name={field.name}
                    type="password"
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(touched && error)}
                    helperText={touched && error ? error : undefined}
                    inputProps={{ "aria-label": field.label }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        minHeight: { xs: 42, sm: 46 },
                        borderRadius: "13px",
                        bgcolor: "var(--surface-subtle)",
                        color: "var(--text-primary)",
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
                      "& .MuiInputBase-input": {
                        px: 1.75,
                        py: 1,
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "var(--text-muted)",
                        opacity: 1,
                      },
                      "& .MuiFormHelperText-root": {
                        mx: 0,
                        mt: 0.35,
                        minHeight: 0,
                        lineHeight: 1.25,
                      },
                    }}
                  />

                  {field.name === "newPassword" && !(touched && error) && (
                    <Typography
                      sx={{
                        mt: 0.25,
                        color: "var(--text-secondary)",
                        fontSize: 12,
                      }}
                    >
                      At least 8 characters with uppercase, lowercase, number,
                      and special character.
                    </Typography>
                  )}
                </Box>
              );
            })}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading || formik.isSubmitting || hasEmptyField}
              sx={{
                minHeight: { xs: 44, sm: 48 },
                borderRadius: "13px",
                bgcolor: "var(--accent-strong)",
                color: "#fff",
                fontSize: { xs: 14, sm: 16 },
                fontWeight: 750,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "var(--accent-strong)",
                  filter: "brightness(0.92)",
                  boxShadow: "none",
                },
                "&.Mui-disabled": {
                  bgcolor: "var(--accent-disabled)",
                  color: "var(--text-muted)",
                },
                "html[data-theme='dark'] &": {
                  color: "#172033",
                  "&:hover": {
                    bgcolor: "var(--accent-strong)",
                    filter: "brightness(1.08)",
                  },
                },
              }}
            >
              {isLoading || formik.isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update password"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
