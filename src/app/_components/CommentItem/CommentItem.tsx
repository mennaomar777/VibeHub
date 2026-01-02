"use client";
import { deleteComment, updateComment } from "@/lib/commentsSlice";
import { dispatchType } from "@/lib/store";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Comment } from "@/app/interfaces/postData";
import PersonIcon from "@mui/icons-material/Person";

export default function CommentItem({
  comment,
  currentUserId,
  postUserId,
  onDelete,
  onUpdate,
  currentUserPhoto = "",
}: {
  comment: Comment;
  currentUserId: string | null;
  postUserId: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  currentUserPhoto?: string;
}) {
  const dispatch = useDispatch<dispatchType>();
  const isCommentOwner = comment.commentCreator._id === currentUserId;
  const isPostOwner = postUserId === currentUserId;

  const showMenu = isCommentOwner && isPostOwner;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [content, setContent] = useState(comment.content);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const rawPhoto = comment.commentCreator.photo;
  const isValidPhoto =
    rawPhoto &&
    typeof rawPhoto === "string" &&
    rawPhoto.trim() !== "" &&
    rawPhoto.trim() !== "undefined" &&
    !rawPhoto.includes("undefined");

  const displayPhoto = isValidPhoto
    ? rawPhoto
    : isCommentOwner &&
      currentUserPhoto &&
      currentUserPhoto.trim() !== "" &&
      !currentUserPhoto.includes("undefined")
    ? currentUserPhoto
    : null;

  function handleDeleteComment() {
    dispatch(deleteComment(comment._id))
      .unwrap()
      .then(() => {
        onDelete(comment._id);
        toast.success("Comment deleted");
      })
      .catch((error) => {
        console.error("Delete comment failed:", error);
        toast.error("Failed to delete comment");
      });
  }

  function handleUpdateComment() {
    dispatch(updateComment({ id: comment._id, content }))
      .unwrap()
      .then(() => {
        onUpdate(comment._id, content);
        toast.success("Comment updated");
        setOpenEditDialog(false);
      })
      .catch(() => {
        toast.error("Failed to update comment");
      });
  }

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", mt: 3 }}>
      <Avatar
        sx={{
          width: 40,
          height: 40,
          mr: 2,
          cursor: "pointer",
          border: "2px solid",
          borderColor: "background.paper",
        }}
      >
        {displayPhoto ? (
          <Image
            src={displayPhoto}
            alt={comment.commentCreator.name || "User"}
            fill
            style={{ objectFit: "cover" }}
            unoptimized
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <PersonIcon />
        )}
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            bgcolor: "#f1f5f9",
            borderRadius: 3,
            px: 2.5,
            py: 2,
            borderTopLeftRadius: 0,
            position: "relative",
            boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} color="primary">
            {comment.commentCreator.name}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
            {comment.content}
          </Typography>

          {showMenu && (
            <>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{ position: "absolute", top: 8, right: 12 }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem
                  onClick={() => {
                    setOpenEditDialog(true);
                    handleMenuClose();
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDeleteComment();
                    handleMenuClose();
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>

              <Dialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
              >
                <DialogTitle>Edit Comment</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    fullWidth
                    multiline
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    sx={{ mt: 1 }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleUpdateComment}>
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: 2, mt: 1 }}
        >
          {new Date(comment.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Typography>
      </Box>
    </Box>
  );
}
