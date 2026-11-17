"use client";

import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { stateType } from "@/lib/store";

export default function CreatePost({
  onPostChange,
}: {
  onPostChange: () => void;
}) {
  const [postBody, setPostBody] = useState("");
  const [imgPost, setImgPost] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLElement | null>(null);
  const postTextRef = useRef<HTMLTextAreaElement>(null);
  const selectionRef = useRef({ start: 0, end: 0 });
  const { userData } = useSelector((state: stateType) => state.profile);

  function saveTextSelection() {
    const textArea = postTextRef.current;
    if (textArea) {
      selectionRef.current = {
        start: textArea.selectionStart ?? 0,
        end: textArea.selectionEnd ?? 0,
      };
    }
  }

  function insertEmoji(emoji: string) {
    const { start, end } = selectionRef.current;
    const nextBody = `${postBody.slice(0, start)}${emoji}${postBody.slice(end)}`;
    const nextCursor = start + emoji.length;

    setPostBody(nextBody);
    setEmojiAnchor(null);
    window.requestAnimationFrame(() => {
      postTextRef.current?.focus();
      postTextRef.current?.setSelectionRange(nextCursor, nextCursor);
      selectionRef.current = { start: nextCursor, end: nextCursor };
    });
  }

  function handlePostImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (imgSrc) URL.revokeObjectURL(imgSrc);
    setImgPost(file);
    setImgSrc(URL.createObjectURL(file));
    event.target.value = "";
  }

  async function createPost() {
    if (!postBody.trim() && !imgPost) {
      toast.error("Please add text or an image");
      return;
    }

    const formData = new FormData();
    formData.append("body", postBody.trim());
    if (imgPost) formData.append("image", imgPost);

    setIsPosting(true);
    try {
      await axios.post("https://route-posts.routemisr.com/posts", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      toast.success("Post created successfully!");
      setPostBody("");
      setImgPost(null);
      if (imgSrc) URL.revokeObjectURL(imgSrc);
      setImgSrc("");
      onPostChange();
    } catch {
      toast.error("Post couldn't be created. Please try again.");
    } finally {
      setIsPosting(false);
    }
  }

  function removeImage() {
    if (imgSrc) URL.revokeObjectURL(imgSrc);
    setImgPost(null);
    setImgSrc("");
  }

  return (
    <Paper
      component="section"
      aria-label="Create a post"
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "none",
        boxSizing: "border-box",
        p: { xs: 1.5, sm: 2 },
        border: "1px solid #dce4ee",
        borderRadius: { xs: "16px", sm: "20px" },
        bgcolor: "#fff",
        boxShadow: "0 2px 5px rgb(24 34 55 / 0.12)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
        <Avatar
          src={userData?.photo || undefined}
          alt={userData?.name || "Your profile"}
          sx={{ width: 44, height: 44, bgcolor: "#e7f2ff", color: "#1769e8" }}
        >
          {!userData?.photo && <PersonOutlineIcon sx={{ fontSize: 30 }} />}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: "#111827",
              fontSize: 16,
              fontWeight: 800,
              lineHeight: 1.3,
            }}
          >
            {userData?.name || "Your name"}
          </Typography>
          <Box
            aria-label="Post audience: Public"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              mt: 0.6,
              px: 1.1,
              py: 0.45,
              borderRadius: "999px",
              bgcolor: "#f0f4f8",
              color: "#34445c",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <PublicOutlinedIcon sx={{ fontSize: 16 }} />
            <span>Public</span>
            <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </Box>

      <TextField
        placeholder={`What's on your mind${userData?.name ? `, ${userData.name.split(" ")[0]}` : ""}?`}
        multiline
        minRows={4}
        fullWidth
        inputRef={postTextRef}
        value={postBody}
        onChange={(event) => {
          setPostBody(event.target.value);
          selectionRef.current = {
            start: event.target.selectionStart ?? 0,
            end: event.target.selectionEnd ?? 0,
          };
        }}
        onSelect={saveTextSelection}
        inputProps={{ "aria-label": "What's on your mind?" }}
        sx={{
          "& .MuiOutlinedInput-root": {
            alignItems: "flex-start",
            minHeight: 132,
            p: { xs: 1.4, sm: 1.7 },
            borderRadius: "18px",
            bgcolor: "#f8fafc",
            color: "#1c293d",
            fontSize: { xs: 15, sm: 17 },
            lineHeight: 1.5,
            "& textarea": { resize: "vertical" },
            "& fieldset": { borderColor: "#dce4ee" },
            "&:hover fieldset": { borderColor: "#c3d0df" },
            "&.Mui-focused fieldset": { borderColor: "#8dbaff" },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#8b95a3",
            opacity: 1,
          },
        }}
      />

      {imgSrc && (
        <Box sx={{ position: "relative", mt: 2, textAlign: "center" }}>
          <Box
            component="img"
            src={imgSrc}
            alt="Selected post preview"
            sx={{
              maxWidth: "100%",
              maxHeight: 280,
              borderRadius: 2,
              objectFit: "contain",
            }}
          />
          <IconButton
            aria-label="Remove selected image"
            onClick={removeImage}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "#fff",
              boxShadow: 1,
            }}
          >
            <CancelIcon />
          </IconButton>
        </Box>
      )}

      <Divider sx={{ mt: 1.75, borderColor: "#1f2937" }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
          pt: 1.1,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 0, sm: 1 } }}
        >
          <Button
            component="label"
            startIcon={<AddPhotoAlternateOutlinedIcon />}
            sx={{
              minHeight: 38,
              px: { xs: 0.75, sm: 1.1 },
              color: "#40516c",
              fontSize: { xs: 12, sm: 14 },
              fontWeight: 500,
              textTransform: "none",
              whiteSpace: "nowrap",
              "& .MuiSvgIcon-root": { color: "#00a66c", fontSize: 20 },
            }}
          >
            Photo/video
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handlePostImage}
            />
          </Button>
          <Button
            startIcon={<SentimentSatisfiedOutlinedIcon />}
            aria-haspopup="dialog"
            aria-expanded={Boolean(emojiAnchor)}
            onMouseDown={saveTextSelection}
            onClick={(event) => {
              saveTextSelection();
              setEmojiAnchor(event.currentTarget);
            }}
            sx={{
              minHeight: 38,
              px: { xs: 0.75, sm: 1.1 },
              color: "#40516c",
              fontSize: { xs: 12, sm: 14 },
              fontWeight: 500,
              textTransform: "none",
              whiteSpace: "nowrap",
              "& .MuiSvgIcon-root": { color: "#ff9800", fontSize: 20 },
            }}
          >
            Feeling/activity
          </Button>
          <Popover
            open={Boolean(emojiAnchor)}
            anchorEl={emojiAnchor}
            onClose={() => setEmojiAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  p: 0,
                  width: 360,
                  border: "1px solid #dce4ee",
                  borderRadius: "14px",
                  boxShadow: "0 8px 24px rgb(24 34 55 / 0.16)",
                  overflow: "hidden",
                },
              },
            }}
          >
            <EmojiPicker
              width={360}
              height={480}
              colorScheme="light"
              previewConfig={{ showPreview: false }}
              onEmojiClick={(emojiData) => insertEmoji(emojiData.emoji)}
            />
          </Popover>
        </Box>

        <Button
          variant="contained"
          endIcon={<SendOutlinedIcon />}
          onClick={createPost}
          disabled={isPosting || (!postBody.trim() && !imgPost)}
          sx={{
            minWidth: 112,
            minHeight: 44,
            px: 2,
            borderRadius: "11px",
            bgcolor: "#70aafa",
            color: "#fff",
            fontSize: 14,
            fontWeight: 750,
            textTransform: "none",
            boxShadow: "0 2px 5px rgb(23 105 232 / 0.2)",
            "&:hover": {
              bgcolor: "#4d91ee",
              boxShadow: "0 3px 8px rgb(23 105 232 / 0.25)",
            },
            "&.Mui-disabled": {
              bgcolor: "#70aafa",
              color: "#fff",
              opacity: 0.78,
            },
          }}
        >
          {isPosting ? "Posting…" : "Post"}
        </Button>
      </Box>
    </Paper>
  );
}
