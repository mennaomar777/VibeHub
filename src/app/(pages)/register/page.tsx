"use client";

import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { handleRegister } from "@/lib/authSlice";
import { dispatchType, stateType } from "@/lib/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PersonOutline from "@mui/icons-material/PersonOutline";
import AlternateEmail from "@mui/icons-material/AlternateEmail";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
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
  "& .MuiInputLabel-root": { color: "#75849b" },
};

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch<dispatchType>();
  const { isLoading } = useSelector((state: stateType) => state.auth);
  const gender = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    username: Yup.string()
      .trim()
      .required("Username is required")
      .matches(
        /^[a-z0-9_]{3,30}$/,
        "Username must contain only lowercase letters, numbers, and underscores (3–30 characters)",
      ),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must contain uppercase, lowercase, number, and special character (at least 8 characters)",
      ),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    dateOfBirth: Yup.string()
      .required("Date of birth is required")
      .test(
        "not-in-future",
        "Date of birth cannot be in the future",
        (value) =>
          !value ||
          value <=
            new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 10),
      ),
    gender: Yup.string()
      .oneOf(["male", "female"], "Select a valid gender")
      .required("Gender is required"),
  });

  const handleSubmit = async (values: {
    name: string;
    username: string;
    email: string;
    password: string;
    rePassword: string;
    dateOfBirth: string;
    gender: string;
  }) => {
    const [year, month, day] = values.dateOfBirth.split("-");
    const finalValues = {
      ...values,
      name: values.name.trim(),
      username: values.username.trim(),
      email: values.email.trim(),
      dateOfBirth: `${month}-${day}-${year}`,
    };
    try {
      await dispatch(handleRegister(finalValues)).unwrap();
      toast.success("Registration successful!");
      router.push("/feed");
    } catch (error: unknown) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Something went wrong";
      toast.error(message);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const autoComplete: Record<keyof typeof formik.values, string> = {
    name: "name",
    username: "username",
    email: "email",
    password: "new-password",
    rePassword: "new-password",
    dateOfBirth: "bday",
    gender: "off",
  };

  const fieldIcons: Record<keyof typeof formik.values, React.ReactNode> = {
    name: <PersonOutline fontSize="small" />,
    username: <AlternateEmail fontSize="small" />,
    email: <EmailOutlined fontSize="small" />,
    gender: <GroupsOutlined fontSize="small" />,
    dateOfBirth: <CalendarMonthOutlined fontSize="small" />,
    password: <KeyOutlined fontSize="small" />,
    rePassword: <KeyOutlined fontSize="small" />,
  };

  const inputProps = (
    name: keyof typeof formik.values,
    label: string,
    type = "text",
  ) => ({
    fullWidth: true,
    id: name,
    name,
    placeholder: label,
    type,
    slotProps: {
      input: {
        startAdornment: (
          <InputAdornment position="start">{fieldIcons[name]}</InputAdornment>
        ),
      },
      inputLabel: { shrink: name === "dateOfBirth" },
      select: {
        displayEmpty: name === "gender",
        renderValue: (selected: unknown) => typeof selected === "string" && selected ? selected : label,
      },
    },
    autoComplete: autoComplete[name],
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched[name] && Boolean(formik.errors[name]),
    helperText: formik.touched[name] && formik.errors[name],
    sx: fieldSx,
  });

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        bgcolor: "#f0f2f5",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "minmax(0, 1.25fr) minmax(440px, 0.95fr)",
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
            component={Link}
            href="/"
            sx={{
              py: 1.2,
              color: "#40516c",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "14px",
            }}
          >
            Login
          </Button>
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
          Create a new account
        </Typography>
        <Typography sx={{ color: "#71809a", fontSize: 15, mb: 3 }}>
          It is quick and easy.
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <TextField {...inputProps("name", "Full name")} />
          <TextField {...inputProps("username", "Username")} />
          <TextField {...inputProps("email", "Email address", "email")} />
          <TextField select {...inputProps("gender", "Select gender")}>
            <MenuItem value="" disabled>
              Select gender
            </MenuItem>
            {gender.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField {...inputProps("dateOfBirth", "Date of birth", "date")} />
          <TextField {...inputProps("password", "Password", "password")} />
          <TextField
            {...inputProps("rePassword", "Confirm password", "password")}
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
              "Create New Account"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}



