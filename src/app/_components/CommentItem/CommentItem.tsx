"use client";

import {
  createCommentReply,
  deleteComment,
  getCommentReplies,
  toggleCommentLike,
  updateComment,
} from "@/lib/commentsSlice";
import { dispatchType, stateType } from "@/lib/store";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SendRounded from "@mui/icons-material/SendRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { Comment } from "@/app/interfaces/postData";
import PersonIcon from "@mui/icons-material/Person";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

function formatCommentDate(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

const primaryButtonSx = {
  bgcolor: "var(--accent-strong)",
  color: "#fff",
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
  },
};

const darkDialogSx = {
  bgcolor: "var(--surface)",
  color: "var(--text-primary)",
  backgroundImage: "none",
  "& .MuiOutlinedInput-root": {
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
  "& .MuiInputBase-input::placeholder": {
    color: "var(--text-muted)",
    opacity: 1,
  },
};

const lightAccentText = {
  color: "var(--accent-strong)",
};

const removeImageButtonSx = {
  bgcolor: "var(--surface-muted)",
  color: "var(--text-secondary)",
  boxShadow: "0 1px 5px rgb(15 23 42 / 0.18)",
  "&:hover": {
    bgcolor: "var(--surface-hover)",
    color: "var(--danger-text)",
  },
};

export default function CommentItem({
  comment,
  currentUserId,
  onDelete,
  onUpdate,
  currentUserPhoto = "",
}: {
  comment: Comment;
  currentUserId: string | null;
  onDelete: (id: string) => void;
  onUpdate: (updatedComment: Comment) => void;
  currentUserPhoto?: string;
}) {
  const dispatch = useDispatch<dispatchType>();

  const {
    repliesByCommentId,
    repliesLoadingByCommentId,
    repliesErrorByCommentId,
    repliesPageByCommentId,
    repliesHasMoreByCommentId,
    repliesLoadedByCommentId,
    commentLikingIds,
    commentLikeOverrides,
  } = useSelector((state: stateType) => state.comments);

  const isCommentOwner = comment.commentCreator._id === currentUserId;
  const showMenu = isCommentOwner;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [content, setContent] = useState(comment.content);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(
    comment.image || null,
  );
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState<File | null>(null);
  const [replyImagePreview, setReplyImagePreview] = useState<string | null>(
    null,
  );
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const replies = repliesByCommentId[comment._id] || [];
  const repliesLoading = repliesLoadingByCommentId[comment._id] || false;
  const repliesError = repliesErrorByCommentId[comment._id] || null;
  const repliesPage = repliesPageByCommentId[comment._id] || 0;
  const repliesHasMore = repliesHasMoreByCommentId[comment._id] || false;
  const repliesCount = Math.max(comment.repliesCount ?? 0, replies.length);

  const commentIsLiked =
    commentLikeOverrides[comment._id]?.isLiked ??
    comment.isLiked ??
    Boolean(currentUserId && comment.likes?.includes(currentUserId));

  const commentLikesCount =
    commentLikeOverrides[comment._id]?.likesCount ??
    comment.likesCount ??
    comment.likes?.length ??
    0;

  React.useEffect(() => {
    return () => {
      if (replyImagePreview) URL.revokeObjectURL(replyImagePreview);
    };
  }, [replyImagePreview]);

  React.useEffect(() => {
    return () => {
      if (editImagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(editImagePreview);
      }
    };
  }, [editImagePreview]);

  function toggleReplies() {
    const shouldOpen = !showReplies;
    setShowReplies(shouldOpen);

    if (
      shouldOpen &&
      !repliesLoading &&
      !repliesLoadedByCommentId[comment._id]
    ) {
      dispatch(
        getCommentReplies({
          postId: comment.post,
          commentId: comment._id,
          page: 1,
          limit: 10,
        }),
      );
    }
  }

  function loadMoreReplies() {
    const page = repliesError && repliesPage === 0 ? 1 : repliesPage + 1;

    dispatch(
      getCommentReplies({
        postId: comment.post,
        commentId: comment._id,
        page,
        limit: 10,
      }),
    );
  }

  function handleReplyImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file to attach.");
      return;
    }

    setReplyImage(file);
    setReplyImagePreview(URL.createObjectURL(file));
  }

  async function handleCreateReply() {
    if (!replyText.trim() || isSubmittingReply) return;

    const formData = new FormData();
    formData.append("content", replyText.trim());

    if (replyImage) formData.append("image", replyImage);

    setIsSubmittingReply(true);

    try {
      await dispatch(
        createCommentReply({
          postId: comment.post,
          commentId: comment._id,
          formData,
        }),
      ).unwrap();

      setReplyText("");
      setReplyImage(null);
      setReplyImagePreview(null);
      toast.success("Reply added");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create reply",
      );
    } finally {
      setIsSubmittingReply(false);
    }
  }

  async function handleToggleLike(target: Comment) {
    const override = commentLikeOverrides[target._id];
    const currentlyLiked =
      override?.isLiked ??
      target.isLiked ??
      Boolean(currentUserId && target.likes?.includes(currentUserId));
    const likesCount =
      override?.likesCount ?? target.likesCount ?? target.likes?.length ?? 0;
    const result = await dispatch(
      toggleCommentLike({
        postId: target.post || comment.post,
        commentId: target._id,
        currentlyLiked,
        likesCount,
      }),
    );
    if (toggleCommentLike.rejected.match(result) && !result.meta.condition) {
      toast.error(result.error.message || "Could not update comment like");
    }
  }

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

  const username = comment.commentCreator.username
    ? `@${comment.commentCreator.username.replace(/^@/, "")}`
    : `@${(comment.commentCreator.name || "user").toLowerCase().replace(/\s+/g, "")}`;

  const commentDate = formatCommentDate(comment.createdAt);

  function handleDeleteComment() {
    dispatch(
      deleteComment({
        id: comment._id,
        post: comment.post,
      }),
    )
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

  function openCommentEdit() {
    setContent(comment.content);
    setEditImage(null);
    setEditImagePreview(comment.image || null);
    setOpenEditDialog(true);
  }

  function closeCommentEdit() {
    if (isUpdatingComment) return;

    setOpenEditDialog(false);
    setContent(comment.content);
    setEditImage(null);
    setEditImagePreview(comment.image || null);
  }

  function handleEditImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file to attach.");
      return;
    }

    setEditImage(file);
    setEditImagePreview(URL.createObjectURL(file));
  }

  async function handleUpdateComment() {
    if (!content.trim() || isUpdatingComment) return;

    const formData = new FormData();
    formData.append("content", content.trim());

    if (editImage) formData.append("image", editImage);

    setIsUpdatingComment(true);

    try {
      const updatedComment = await dispatch(
        updateComment({
          id: comment._id,
          post: comment.post,
          formData,
        }),
      ).unwrap();

      onUpdate({
        ...comment,
        ...updatedComment,
        content: updatedComment.content || content.trim(),
      });

      setContent(updatedComment.content || content.trim());
      setEditImage(null);
      setEditImagePreview(updatedComment.image || comment.image || null);

      toast.success("Comment updated");
      setOpenEditDialog(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update comment",
      );
    } finally {
      setIsUpdatingComment(false);
    }
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
        alignItems: "flex-start",
        gap: 1.25,
        mt: 2,
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          flexShrink: 0,
          cursor: "pointer",
          bgcolor: "var(--accent-soft)",
          color: "var(--accent-strong)",
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

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box
          sx={{
            display: "inline-block",
            maxWidth: "min(100%, 520px)",
            px: 1.5,
            py: 1.2,
            border: "1px solid var(--border)",
            borderRadius: "7px 18px 18px 18px",
            bgcolor: "var(--surface-subtle)",
            overflowWrap: "anywhere",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1,
              minWidth: 0,
            }}
          >
            <Box sx={{ minWidth: 0, pr: showMenu ? 0.5 : 0 }}>
              <Typography
                sx={{
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontWeight: 800,
                  lineHeight: 1.35,
                }}
                noWrap
              >
                {comment.commentCreator.name || "User"}
              </Typography>

              <Typography
                sx={{
                  color: "var(--text-muted)",
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
                noWrap
              >
                {username} · {commentDate}
              </Typography>
            </Box>

            {showMenu && (
              <IconButton
                size="small"
                aria-label="Comment options"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={handleMenuOpen}
                sx={{
                  flexShrink: 0,
                  mt: -0.5,
                  mr: -0.65,
                  width: 30,
                  height: 30,
                  color: open ? "var(--accent-strong)" : "var(--text-muted)",
                  border: "1px solid",
                  borderColor: open ? "var(--accent-border)" : "transparent",
                  bgcolor: open ? "var(--accent-soft)" : "transparent",
                  "&:hover": {
                    color: "var(--accent-strong)",
                    borderColor: "var(--accent-border)",
                    bgcolor: "var(--accent-soft)",
                  },
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Typography
            sx={{
              mt: 0.6,
              color: "var(--text-primary)",
              fontSize: 14,
              lineHeight: 1.45,
            }}
          >
            {comment.content}
          </Typography>

          {comment.image && comment.image !== "undefined" && (
            <Image
              src={comment.image}
              alt="Comment attachment"
              width={640}
              height={480}
              unoptimized
              style={{
                display: "block",
                width: "100%",
                maxWidth: 420,
                maxHeight: 320,
                height: "auto",
                objectFit: "contain",
                marginTop: 10,
                borderRadius: 12,
              }}
            />
          )}

          {showMenu && (
            <>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      minWidth: 184,
                      mt: 0.6,
                      p: 0.65,
                      bgcolor: "var(--surface)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border)",
                      borderRadius: "14px",
                      boxShadow: "0 12px 30px rgb(15 23 42 / 0.14)",
                      "& .MuiList-root": { p: 0 },
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    openCommentEdit();
                    handleMenuClose();
                  }}
                  sx={{
                    minHeight: 42,
                    gap: 1.25,
                    px: 1.25,
                    borderRadius: "9px",
                    color: "var(--text-secondary)",
                    fontSize: 13.5,
                    fontWeight: 650,
                    "&:hover": {
                      bgcolor: "var(--surface-hover)",
                    },
                  }}
                >
                  <EditOutlinedIcon
                    sx={{ color: "var(--text-secondary)", fontSize: 19 }}
                  />
                  Edit comment
                </MenuItem>

                <Divider sx={{ my: 0.5, borderColor: "var(--border)" }} />

                <MenuItem
                  onClick={() => {
                    handleDeleteComment();
                    handleMenuClose();
                  }}
                  sx={{
                    minHeight: 42,
                    gap: 1.25,
                    px: 1.25,
                    borderRadius: "9px",
                    color: "var(--danger-text)",
                    fontSize: 13.5,
                    fontWeight: 650,
                    "&:hover": {
                      bgcolor: "var(--danger-soft)",
                    },
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 19 }} />
                  Delete comment
                </MenuItem>
              </Menu>

              <Dialog
                open={openEditDialog}
                onClose={closeCommentEdit}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                  sx: {
                    ...darkDialogSx,
                    border: "1px solid var(--border)",
                    borderRadius: "18px",
                  },
                }}
              >
                <DialogTitle
                  sx={{
                    color: "var(--text-primary)",
                    fontWeight: 800,
                  }}
                >
                  Edit Comment
                </DialogTitle>

                <DialogContent sx={{ display: "grid", gap: 1.5 }}>
                  <TextField
                    autoFocus
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={7}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Update your comment..."
                    sx={{
                      ...darkDialogSx,
                      "& .MuiOutlinedInput-root": {
                        ...darkDialogSx["& .MuiOutlinedInput-root"],
                        borderRadius: "13px",
                      },
                    }}
                  />

                  {editImagePreview && (
                    <Box
                      sx={{
                        position: "relative",
                        width: "fit-content",
                        maxWidth: "100%",
                        p: 0.5,
                        border: "1px solid var(--border)",
                        borderRadius: "14px",
                        bgcolor: "var(--surface-subtle)",
                      }}
                    >
                      <Image
                        src={editImagePreview}
                        alt="Comment image preview"
                        width={720}
                        height={480}
                        unoptimized
                        style={{
                          display: "block",
                          width: "auto",
                          maxWidth: "min(100%, 420px)",
                          height: "auto",
                          maxHeight: 280,
                          objectFit: "contain",
                          borderRadius: 10,
                        }}
                      />

                      {editImage && (
                        <IconButton
                          aria-label="Discard replacement image"
                          onClick={() => {
                            setEditImage(null);
                            setEditImagePreview(comment.image || null);
                          }}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            ...removeImageButtonSx,
                          }}
                        >
                          <CloseRounded sx={{ fontSize: 18 }} />
                        </IconButton>
                      )}
                    </Box>
                  )}

                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<ImageOutlinedIcon />}
                    disabled={isUpdatingComment}
                    sx={{
                      justifySelf: "start",
                      borderRadius: "11px",
                      textTransform: "none",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      borderColor: "var(--border-strong)",
                      "&:hover": {
                        borderColor: "var(--accent-strong)",
                        bgcolor: "var(--accent-soft)",
                      },
                    }}
                  >
                    {editImage
                      ? "Choose a different image"
                      : comment.image
                        ? "Replace image"
                        : "Add image"}

                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                    />
                  </Button>

                  {comment.image && !editImage && (
                    <Typography
                      sx={{
                        mt: -1,
                        color: "var(--text-muted)",
                        fontSize: 12,
                      }}
                    >
                      The current image stays unless you replace it.
                    </Typography>
                  )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.25, gap: 1 }}>
                  <Button
                    onClick={closeCommentEdit}
                    disabled={isUpdatingComment}
                    sx={{
                      color: "var(--text-secondary)",
                      textTransform: "none",
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleUpdateComment}
                    disabled={!content.trim() || isUpdatingComment}
                    startIcon={
                      isUpdatingComment ? (
                        <CircularProgress size={15} color="inherit" />
                      ) : undefined
                    }
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 750,
                      ...primaryButtonSx,
                    }}
                  >
                    {isUpdatingComment ? "Saving…" : "Save changes"}
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            ml: 0.5,
            mt: 0.5,
          }}
        >
          <Typography sx={{ color: "var(--text-muted)", fontSize: 12 }}>
            {commentDate}
          </Typography>

          <Button
            size="small"
            disableRipple
            disabled={!currentUserId || commentLikingIds.includes(comment._id)}
            onClick={() => handleToggleLike(comment)}
            aria-pressed={commentIsLiked}
            startIcon={
              commentIsLiked ? (
                <ThumbUpAltIcon sx={{ fontSize: "14px !important" }} />
              ) : (
                <ThumbUpAltOutlinedIcon sx={{ fontSize: "14px !important" }} />
              )
            }
            sx={{
              minWidth: 0,
              p: 0,
              color: commentIsLiked
                ? "var(--accent-strong)"
                : "var(--text-secondary)",
              fontSize: 12,
              fontWeight: commentIsLiked ? 750 : 500,
              textTransform: "none",
              backgroundColor: "transparent !important",
              boxShadow: "none !important",
              "&:hover": {
                color: "var(--accent-strong)",
                backgroundColor: "transparent !important",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              },
              "& .MuiButton-startIcon": { mr: 0.5 },
              "&:disabled": {
                color: commentIsLiked
                  ? "var(--accent-strong)"
                  : "var(--text-secondary)",
                opacity: 0.7,
              },
            }}
          >
            {commentIsLiked ? "Liked" : "Like"} ({commentLikesCount})
          </Button>

          <Button
            size="small"
            onClick={toggleReplies}
            disableRipple
            aria-expanded={showReplies}
            sx={{
              minWidth: 0,
              p: 0,
              backgroundColor: "transparent !important",
              boxShadow: "none !important",
              color: showReplies
                ? "var(--accent-strong)"
                : "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "none",
              textDecoration: "none",
              "&:hover, &:active, &:focus": {
                backgroundColor: "transparent !important",
                boxShadow: "none !important",
              },
              "&:hover": {
                color: "var(--accent-strong)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              },
              "&:focus-visible": {
                backgroundColor: "transparent !important",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                outline: "2px solid var(--accent-strong)",
                outlineOffset: 2,
              },
            }}
          >
            {showReplies
              ? "Hide replies"
              : repliesCount > 0
                ? `View ${repliesCount} replies`
                : "Reply"}
          </Button>
        </Box>

        {showReplies && (
          <Box
            sx={{
              mt: 1.25,
              ml: 0.5,
              pl: 1.5,
              borderLeft: "2px solid var(--border)",
            }}
          >
            {repliesLoading && replies.length === 0 ? (
              <Box
                role="status"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 1.25,
                }}
              >
                <CircularProgress
                  size={17}
                  sx={{ color: "var(--accent-strong)" }}
                />

                <Typography sx={{ color: "var(--text-muted)", fontSize: 12.5 }}>
                  Loading replies…
                </Typography>
              </Box>
            ) : repliesError && replies.length === 0 ? (
              <Paper
                role="alert"
                elevation={0}
                sx={{
                  p: 1.5,
                  border: "1px solid var(--danger-border)",
                  borderRadius: "12px",
                  bgcolor: "var(--danger-soft)",
                }}
              >
                <Typography
                  sx={{ color: "var(--danger-text)", fontSize: 12.5 }}
                >
                  {repliesError}
                </Typography>

                <Button
                  size="small"
                  startIcon={<RefreshRounded />}
                  onClick={loadMoreReplies}
                  disabled={repliesLoading}
                  sx={{
                    mt: 0.5,
                    px: 0,
                    fontWeight: 750,
                    textTransform: "none",
                    color: "var(--danger-text)",
                  }}
                >
                  Try again
                </Button>
              </Paper>
            ) : replies.length === 0 ? (
              <Typography
                sx={{
                  py: 1,
                  color: "var(--text-muted)",
                  fontSize: 12.5,
                }}
              >
                No replies yet.
              </Typography>
            ) : (
              <Box sx={{ display: "grid", gap: 1 }}>
                {replies.map((reply) => (
                  <Box
                    key={reply._id}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Avatar
                      src={reply.commentCreator.photo || undefined}
                      alt={reply.commentCreator.name || "User"}
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: "var(--accent-soft)",
                        color: "var(--accent-strong)",
                      }}
                    >
                      {!reply.commentCreator.photo && (
                        <PersonIcon sx={{ fontSize: 18 }} />
                      )}
                    </Avatar>

                    <Box
                      sx={{
                        minWidth: 0,
                        flex: 1,
                        p: 1.1,
                        border: "1px solid var(--border)",
                        borderRadius: "13px",
                        bgcolor: "var(--surface)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "var(--text-primary)",
                          fontSize: 12.5,
                          fontWeight: 750,
                        }}
                      >
                        {reply.commentCreator.name || "User"}
                      </Typography>

                      <Typography
                        sx={{ color: "var(--text-muted)", fontSize: 11.5 }}
                      >
                        {formatCommentDate(reply.createdAt)}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.45,
                          color: "var(--text-secondary)",
                          fontSize: 13,
                          lineHeight: 1.45,
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {reply.content}
                      </Typography>

                      {reply.image && reply.image !== "undefined" && (
                        <Image
                          src={reply.image}
                          alt="Reply attachment"
                          width={480}
                          height={360}
                          unoptimized
                          style={{
                            display: "block",
                            width: "100%",
                            maxWidth: 320,
                            maxHeight: 220,
                            height: "auto",
                            objectFit: "contain",
                            marginTop: 8,
                            borderRadius: 10,
                          }}
                        />
                      )}

                      {(() => {
                        const replyOverride = commentLikeOverrides[reply._id];
                        const replyIsLiked =
                          replyOverride?.isLiked ??
                          reply.isLiked ??
                          Boolean(
                            currentUserId &&
                            reply.likes?.includes(currentUserId),
                          );

                        const replyLikesCount =
                          replyOverride?.likesCount ??
                          reply.likesCount ?? reply.likes?.length ?? 0;

                        const isLikingReply = commentLikingIds.includes(
                          reply._id,
                        );

                        return (
                          <Button
                            size="small"
                            disableRipple
                            disabled={!currentUserId || isLikingReply}
                            onClick={() => handleToggleLike(reply)}
                            aria-pressed={replyIsLiked}
                            startIcon={
                              replyIsLiked ? (
                                <ThumbUpAltIcon
                                  sx={{ fontSize: "13px !important" }}
                                />
                              ) : (
                                <ThumbUpAltOutlinedIcon
                                  sx={{ fontSize: "13px !important" }}
                                />
                              )
                            }
                            sx={{
                              minWidth: 0,
                              mt: 0.5,
                              px: 0,
                              color: replyIsLiked
                                ? "var(--accent-strong)"
                                : "var(--text-secondary)",
                              fontSize: 11.5,
                              fontWeight: replyIsLiked ? 750 : 550,
                              textTransform: "none",
                              backgroundColor: "transparent !important",
                              boxShadow: "none !important",
                              "&:hover": {
                                color: "var(--accent-strong)",
                                backgroundColor: "transparent !important",
                                textDecoration: "underline",
                                textUnderlineOffset: "3px",
                              },
                              "& .MuiButton-startIcon": { mr: 0.4 },
                              "&:disabled": {
                                color: replyIsLiked
                                  ? "var(--accent-strong)"
                                  : "var(--text-secondary)",
                                opacity: 0.7,
                              },
                            }}
                          >
                            {replyIsLiked ? "Liked" : "Like"} ({replyLikesCount}
                            )
                          </Button>
                        );
                      })()}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {replies.length > 0 && (repliesHasMore || repliesError) && (
              <Button
                size="small"
                onClick={loadMoreReplies}
                disabled={repliesLoading}
                startIcon={
                  repliesLoading ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : undefined
                }
                sx={{
                  mt: 0.75,
                  ml: 4,
                  fontWeight: 750,
                  textTransform: "none",
                  color: "var(--accent-strong)",
                }}
              >
                {repliesLoading
                  ? "Loading…"
                  : repliesError
                    ? "Retry loading replies"
                    : "Load more replies"}
              </Button>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.75,
                mt: 1.25,
              }}
            >
              <Avatar
                src={currentUserPhoto || undefined}
                alt="Your profile"
                sx={{
                  width: 30,
                  height: 30,
                  mt: 0.4,
                  bgcolor: "var(--accent-soft)",
                  color: "var(--accent-strong)",
                }}
              >
                {!currentUserPhoto && <PersonIcon sx={{ fontSize: 19 }} />}
              </Avatar>

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                  p: 1,
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  bgcolor: "var(--surface-subtle)",
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={4}
                  size="small"
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  placeholder={`Reply to ${comment.commentCreator.name || "this comment"}...`}
                  inputProps={{
                    "aria-label": `Reply to ${comment.commentCreator.name || "comment"}`,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      p: 0.75,
                      borderRadius: "10px",
                      bgcolor: "var(--surface)",
                      color: "var(--text-primary)",
                      fontSize: 13,
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
                    "html[data-theme='dark'] & .MuiOutlinedInput-root": {
                      bgcolor: "var(--surface-subtle) !important",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "var(--text-muted)",
                      opacity: 1,
                    },
                  }}
                />

                {replyImagePreview && (
                  <Box
                    sx={{
                      position: "relative",
                      width: "fit-content",
                      mt: 0.75,
                      p: 0.4,
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      bgcolor: "var(--surface)",
                    }}
                  >
                    <Image
                      src={replyImagePreview}
                      alt="Reply image preview"
                      width={320}
                      height={220}
                      unoptimized
                      style={{
                        display: "block",
                        width: "auto",
                        maxWidth: 200,
                        height: "auto",
                        maxHeight: 120,
                        objectFit: "contain",
                        borderRadius: 8,
                      }}
                    />

                    <IconButton
                      size="small"
                      aria-label="Remove reply image"
                      disabled={isSubmittingReply}
                      onClick={() => {
                        setReplyImage(null);
                        setReplyImagePreview(null);
                      }}
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        width: 24,
                        height: 24,
                        ...removeImageButtonSx,
                      }}
                    >
                      <CloseRounded sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 0.6,
                  }}
                >
                  <IconButton
                    component="label"
                    size="small"
                    aria-label="Attach an image to reply"
                    disabled={isSubmittingReply}
                    sx={{
                      width: 30,
                      height: 30,
                      color: replyImage
                        ? "var(--accent-strong)"
                        : "var(--text-muted)",
                    }}
                  >
                    <ImageOutlinedIcon sx={{ fontSize: 18 }} />
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleReplyImageChange}
                    />
                  </IconButton>

                  <Button
                    size="small"
                    variant="contained"
                    startIcon={
                      isSubmittingReply ? (
                        <CircularProgress size={13} color="inherit" />
                      ) : (
                        <SendRounded sx={{ fontSize: 15 }} />
                      )
                    }
                    onClick={handleCreateReply}
                    disabled={!replyText.trim() || isSubmittingReply}
                    sx={{
                      minHeight: 30,
                      px: 1.25,
                      borderRadius: "9px",
                      fontSize: 11.5,
                      fontWeight: 750,
                      textTransform: "none",
                      ...primaryButtonSx,
                    }}
                  >
                    {isSubmittingReply ? "Sending…" : "Reply"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
