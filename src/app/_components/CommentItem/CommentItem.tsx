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

export default function CommentItem({
  comment,
  currentUserId,
  onDelete,
  onUpdate,
}: {
  comment: Comment;
  currentUserId: string | null;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}) {
  const dispatch = useDispatch<dispatchType>();
  const isOwner = comment.commentCreator._id === currentUserId;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [content, setContent] = useState(comment.content);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  function handleDeleteComment() {
    dispatch(deleteComment(comment._id))
      .then(() => {
        onDelete(comment._id);
        toast.success("Comment deleted");
      })
      .catch(() => toast.error("Failed to delete comment"));
  }

  function handleUpdateComment() {
    dispatch(updateComment({ id: comment._id, content }))
      .then(() => {
        onUpdate(comment._id, content);
        toast.success("Comment updated");
      })
      .catch(() => toast.error("Failed to update comment"));
  }

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        mt: 3,
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-1px)",
        },
      }}
    >
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
        <Image
          src={comment?.commentCreator.photo || "/default-avatar.png"}
          alt={comment?.commentCreator.name}
          fill
          style={{ objectFit: "cover" }}
        />
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
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="primary"
            sx={{
              cursor: "pointer",
            }}
          >
            {comment?.commentCreator.name}
          </Typography>

          <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
            {comment?.content}
          </Typography>

          {isOwner && (
            <>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 12,
                  "&:hover": { bgcolor: "background.paper" },
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: { borderRadius: 2, mt: 1 },
                }}
              >
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
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
              >
                <DialogTitle sx={{ fontWeight: 600 }}>Edit Comment</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    fullWidth
                    multiline
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                  <Button onClick={() => setOpenEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleUpdateComment();
                      setOpenEditDialog(false);
                    }}
                  >
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
          sx={{ ml: 2, mt: 1, display: "block" }}
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
