"use client";

import { getUserData, uploadProfilePhoto } from "@/lib/profileSlice";
import { dispatchType, stateType } from "@/lib/store";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function ProfilePhoto({}: { onUploadSuccess?: () => void }) {
  const { isLoading } = useSelector((state: stateType) => state.profile);
  const dispatch = useDispatch<dispatchType>();

  function handleChange(file: File) {
    const formData = new FormData();
    formData.append("photo", file);

    dispatch(uploadProfilePhoto(formData))
      .unwrap()
      .then(() => {
        toast.success("Photo updated!");
        dispatch(getUserData());
      })
      .catch(() => {
        toast.error("Upload failed");
      });
  }

  return (
    <IconButton
      component="label"
      disabled={isLoading}
      sx={{
        bgcolor: "white",
        boxShadow: 2,
        width: 36,
        height: 36,
        "&:hover": { bgcolor: "#f5f5f5" },
      }}
    >
      <CameraAltIcon fontSize="small" />

      <input
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleChange(file);
        }}
      />
    </IconButton>
  );
}
