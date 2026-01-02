"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PostData, Comment } from "../../interfaces/postData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { deletePost, updatePost } from "@/lib/postSlice";
import { getAllPosts } from "@/lib/postSlice";
import { dispatchType } from "@/lib/store";
import toast from "react-hot-toast";
import CommentItem from "../CommentItem/CommentItem";
import { createComment } from "@/lib/commentsSlice";

export default function Post({
  postdata,
  currentUserId,
  showAllComments = false,
  onPostChange,
}: {
  postdata: PostData;
  showAllComments?: boolean;
  currentUserId: string | null;
  onPostChange?: () => void;
}) {
  const router = useRouter();
  const dispatch = useDispatch<dispatchType>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [commentText, setCommentText] = useState("");

  const [comments, setComments] = useState<Comment[]>(postdata.comments || []);

  const postUserId =
    typeof postdata.user === "string" ? postdata.user : postdata.user?._id;

  const [openEditModal, setOpenEditModal] = useState(false);
  const [content, setContent] = useState(postdata.body);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleSinglePost(id: string) {
    router.push(`/singlePost/${id}`);
  }

  const handleDeleteFromUI = (id: string) => {
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  const handleUpdateFromUI = (id: string, content: string) => {
    setComments((prev) =>
      prev.map((c) => (c._id === id ? { ...c, content } : c))
    );
  };

  function handleDelete(id: string) {
    dispatch(deletePost(id))
      .unwrap()
      .then(() => {
        toast.success("Post deleted successfully!");
        if (onPostChange) {
          onPostChange();
        }
      })
      .catch(() => {
        toast.error("Post doesn't deleted!");
      });
  }

  function handleUpdate() {
    const formData = new FormData();
    formData.append("body", content);
    if (image) formData.append("image", image);

    dispatch(updatePost({ id: postdata._id, formData }))
      .unwrap()
      .then(() => {
        toast.success("Post updated successfully!");
        setOpenEditModal(false);
        setImage(null);
        setPreview(null);
        dispatch(getAllPosts());

        if (onPostChange) {
          onPostChange();
        }
      })
      .catch(() => {
        toast.error("Post doesn't updated!");
      });
  }

  const handleCreateComment = () => {
    if (!commentText.trim()) return;

    dispatch(
      createComment({
        content: commentText,
        post: postdata._id,
      })
    )
      .unwrap()
      .then((newComments) => {
        setComments(newComments);
        setCommentText("");
        toast.success("Comment created successfully!");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to create comment");
      });
  };

  const userPhoto =
    typeof postdata.user === "string"
      ? "/default-avatar.png"
      : postdata.user?.photo;

  const displayedComments = showAllComments ? comments : comments.slice(0, 1);

  return (
    <Card
      sx={{
        maxWidth: 680,
        mx: "auto",
        my: 3,
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        overflow: "hidden",
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ cursor: "pointer", width: 44, height: 44 }}>
            <Image
              src={userPhoto || "/default-avatar.png"}
              alt={
                typeof postdata.user === "string"
                  ? "User"
                  : postdata.user?.name || "User"
              }
              width={44}
              height={44}
              style={{ objectFit: "cover" }}
            />
          </Avatar>
        }
        action={
          postUserId === currentUserId ? (
            <>
              <IconButton onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                  onClick={() => {
                    setOpenEditModal(true);
                    handleClose();
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDelete(postdata._id);
                    handleClose();
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </>
          ) : null
        }
        title={
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ cursor: "pointer" }}
          >
            {typeof postdata.user === "string"
              ? "Unknown User"
              : postdata.user?.name}
          </Typography>
        }
        subheader={new Date(postdata.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      />

      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body1" color="text.primary">
          {postdata.body}
        </Typography>
      </CardContent>

      {postdata?.image && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
          }}
        >
          <Image
            src={postdata.image}
            alt="Post image"
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>
      )}

      <CardActions disableSpacing sx={{ px: 2, py: 1 }}>
        <IconButton aria-label="like">
          <FavoriteIcon sx={{ fontSize: 28 }} />
        </IconButton>
        <IconButton
          aria-label="comment"
          onClick={() => handleSinglePost(postdata._id)}
        >
          <CommentIcon sx={{ fontSize: 28 }} />
        </IconButton>
        <IconButton aria-label="share" sx={{ ml: "auto" }}>
          <ShareIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </CardActions>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mx: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateComment}
          disabled={!commentText.trim()}
        >
          Comment
        </Button>
      </Box>

      {comments.length > 0 && (
        <Box sx={{ px: 2, pb: 2 }}>
          {displayedComments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={currentUserId}
              onDelete={handleDeleteFromUI}
              onUpdate={handleUpdateFromUI}
            />
          ))}

          {!showAllComments && comments.length > 1 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 7, mt: 1, cursor: "pointer" }}
              onClick={() => router.push(`/singlePost/${postdata._id}`)}
            >
              View all {comments.length} comments
            </Typography>
          )}
        </Box>
      )}

      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            sx={{ mt: 2 }}
          />
          {preview || postdata.image ? (
            <Box
              sx={{
                mt: 3,
                position: "relative",
                aspectRatio: "1 / 1",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Image
                src={preview || postdata.image!}
                alt="Preview"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          ) : null}
          <Button component="label" variant="outlined" fullWidth sx={{ mt: 3 }}>
            {preview || postdata.image ? "Change Image" : "Add Image"}
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenEditModal(false);
              setPreview(null);
              setImage(null);
              setContent(postdata.body);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
