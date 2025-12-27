"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { dispatchType } from "@/lib/store";
import { getAllPosts } from "@/lib/postSlice";

export default function CreatePost() {
  const [postBody, setPostBody] = useState("");
  const [imgPost, setImgPost] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState("");
  const dispatch = useDispatch<dispatchType>();

  function handlePostBody(e: any) {
    setPostBody(e.target.value);
  }
  function handlePostImage(e: any) {
    if (e.target.files && e.target.files[0]) {
      setImgPost(e.target.files[0]);
      const srcImage = URL.createObjectURL(e.target.files[0]);
      setImgSrc(srcImage);
    }
  }
  function createPost() {
    if (!postBody.trim() && !imgPost) {
      toast.error("Please add text or an image");
      return;
    }
    const formData = new FormData();
    formData.append("body", postBody);
    if (imgPost) {
      formData.append("image", imgPost);
    }

    axios
      .post(`https://linked-posts.routemisr.com/posts`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(() => {
        toast.success("Post created successfully!");
        setPostBody("");
        setImgPost(null);
        setImgSrc("");
        dispatch(getAllPosts());
      })
      .catch(() => {
        toast.error("Post doesn't created!");
      });
  }
  const removeImage = () => {
    setImgPost(null);
    setImgSrc("");
  };
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          width: "92%",
          p: { xs: 3, sm: 4 },
          my: 4,
          borderRadius: 4,
          bgcolor: "background.paper",
          boxShadow: "0 4px 20px rgb(0 0 0 / 0.05)",
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Create a new post
        </Typography>

        <Stack spacing={3}>
          <TextField
            placeholder="What's on your mind?"
            multiline
            rows={5}
            value={postBody}
            onChange={handlePostBody}
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#f8fafc",
              },
            }}
          />

          {imgSrc && (
            <Box
              sx={{
                my: 3,
                textAlign: "center",
                position: "relative",
              }}
            >
              <Box
                component="img"
                src={imgSrc}
                alt="Post preview"
                sx={{
                  maxWidth: { xs: "100%", sm: "70%" },
                  height: "auto",
                  borderRadius: 3,
                  boxShadow: 2,
                  display: "inline-block",
                }}
              />
              <IconButton
                onClick={removeImage}
                sx={{
                  position: "absolute",
                  top: 12,
                  right: { xs: 12, sm: "17%" },
                  bgcolor: "background.paper",
                  boxShadow: 3,
                  "&:hover": { bgcolor: "grey.200" },
                }}
              >
                <CancelIcon />
              </IconButton>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 3,
                px: 3,
                py: 1.5,
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  borderColor: "primary.dark",
                  bgcolor: "primary.50",
                },
              }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handlePostImage}
              />
            </Button>

            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={createPost}
              disabled={!postBody.trim() && !imgPost}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 4,
                },
              }}
            >
              Post
            </Button>
          </Box>
        </Stack>
      </Paper>
    </>
  );
}
