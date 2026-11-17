"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  ButtonBase,
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Select,
  TextField,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import CommentOutlinedIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SentimentSatisfiedOutlinedIcon from "@mui/icons-material/SentimentSatisfiedOutlined";
import ErrorOutlineRounded from "@mui/icons-material/ErrorOutlineRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import EmojiPicker from "emoji-picker-react";
import { PostData, Comment } from "../../interfaces/postData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  getPostLikes,
  getSinglePost,
  togglePostBookmark,
  togglePostLike,
  updatePost,
  sharePost,
  getAllPosts,
} from "@/lib/postSlice";
import { dispatchType, stateType } from "@/lib/store";
import toast from "react-hot-toast";
import CommentItem from "../CommentItem/CommentItem";
import { createComment, getAllComments } from "@/lib/commentsSlice";
import PersonIcon from "@mui/icons-material/Person";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { PostLike } from "@/app/interfaces/postData";

const primaryButtonSx = {
  bgcolor: "var(--accent-strong)",
  color: "#172033",
  fontWeight: 800,
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
};

const dialogPaperSx = {
  bgcolor: "var(--surface)",
  color: "var(--text-primary)",
  border: "1px solid var(--border)",
  backgroundImage: "none",
};

const dialogTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "var(--text-primary)",
    bgcolor: "var(--surface-subtle)",
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
  "& .MuiFormHelperText-root": {
    color: "var(--text-muted)",
  },
};

function formatRelativeTime(date: string) {
  const elapsed = Math.max(0, Date.now() - new Date(date).getTime());
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function Post({
  postdata,
  currentUserId,
  showAllComments = false,
  commentsLoading = false,
  onPostChange,
  currentUserPhoto = "",
  currentUserName = "",
}: {
  postdata: PostData;
  showAllComments?: boolean;
  commentsLoading?: boolean;
  currentUserId: string | null;
  onPostChange?: () => void;
  currentUserPhoto?: string;
  currentUserName?: string;
}) {
  const router = useRouter();
  const dispatch = useDispatch<dispatchType>();

  const {
    postLikes,
    likesPage,
    likesHasMore,
    likesLoading,
    likesError,
    likingPostIds,
    bookmarkingPostIds,
    postLikeOverrides,
  } = useSelector((state: stateType) => state.post);

  const {
    currentPostId: commentsPostId,
    commentsPage,
    commentsHasMore,
    commentsFetchLoading,
    commentsFetchError,
  } = useSelector((state: stateType) => state.comments);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [commentImagePreview, setCommentImagePreview] = useState<string | null>(
    null,
  );
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSort, setCommentSort] = useState<"relevant" | "newest">(
    "relevant",
  );
  const [commentEmojiAnchor, setCommentEmojiAnchor] =
    useState<HTMLElement | null>(null);
  const [likesDialogOpen, setLikesDialogOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>(postdata.comments || []);
  const [isBookmarked, setIsBookmarked] = useState(
    postdata.bookmarked ?? false,
  );
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareText, setShareText] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const { userData } = useSelector((state: stateType) => state.profile);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(
        document.documentElement.getAttribute("data-theme") === "dark",
      );
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setComments(postdata.comments || []);
  }, [postdata._id, postdata.comments]);

  useEffect(() => {
    return () => {
      if (commentImagePreview) URL.revokeObjectURL(commentImagePreview);
    };
  }, [commentImagePreview]);

  useEffect(() => {
    setIsBookmarked(postdata.bookmarked ?? false);
  }, [postdata._id, postdata.bookmarked]);

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

  function handleOpenAuthorProfile() {
    if (postUserId) router.push(`/profile/${postUserId}`);
  }

  const handleDeleteFromUI = (id: string) => {
    setComments((prev) => prev.filter((c) => c._id !== id));
    if (showAllComments) {
      dispatch(getSinglePost(postdata._id));
    }
  };

  const handleUpdateFromUI = (updatedComment: Comment) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === updatedComment._id ? updatedComment : comment,
      ),
    );
  };

  function handleDelete(id: string) {
    dispatch(deletePost(id))
      .unwrap()
      .then(() => {
        toast.success("Post deleted successfully!");
        if (onPostChange) onPostChange();
        else dispatch(getAllPosts());
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
        if (onPostChange) onPostChange();
        else dispatch(getAllPosts());
      })
      .catch(() => {
        toast.error("Post doesn't updated!");
      });
  }

  const handleCreateComment = async () => {
    if (!commentText.trim() || isSubmittingComment) return;

    const formData = new FormData();
    formData.append("content", commentText.trim());
    if (commentImage) formData.append("image", commentImage);

    setIsSubmittingComment(true);
    try {
      await dispatch(createComment({ post: postdata._id, formData })).unwrap();
      setCommentText("");
      setCommentImage(null);
      setCommentImagePreview(null);
      toast.success("Comment created successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create comment",
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  function handleCommentImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file to attach.");
      return;
    }

    setCommentImage(file);
    setCommentImagePreview(URL.createObjectURL(file));
  }

  async function handleShare() {
    if (isSharing) return;

    if (!shareText.trim()) {
      toast.error("Add a message before sharing this post.");
      return;
    }

    setIsSharing(true);
    try {
      await dispatch(
        sharePost({ postId: postdata._id, body: shareText.trim() }),
      ).unwrap();

      setShareDialogOpen(false);
      setShareText("");
      toast.success("Post shared successfully");

      if (onPostChange) onPostChange();
      else dispatch(getAllPosts());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not share post",
      );
    } finally {
      setIsSharing(false);
    }
  }

  const openShareDialog = () => setShareDialogOpen(true);

  const closeShareDialog = () => {
    if (isSharing) return;
    setShareDialogOpen(false);
    setShareText("");
  };

  const userPhoto =
    typeof postdata.user === "string" ? "" : postdata.user?.photo;

  const postAuthor = typeof postdata.user === "string" ? null : postdata.user;
  const postName = postAuthor?.name || "Unknown User";

  const postUsername = postAuthor?.username
    ? `@${postAuthor.username.replace(/^@/, "")}`
    : `@${postName.toLowerCase().replace(/\s+/g, "")}`;

  const sharedPostData = postdata.isShare ? postdata.sharedPost : null;

  const sharedAuthor =
    sharedPostData && typeof sharedPostData.user !== "string"
      ? sharedPostData.user
      : null;

  const commentCount = Math.max(postdata.commentsCount || 0, comments.length);
  const topComment = postdata.topComment || comments[0];

  const sortedComments = [...comments].sort((first, second) =>
    commentSort === "newest"
      ? new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
      : 0,
  );

  const likedUsers = postLikes[postdata._id] || [];
  const hasMoreLikes = likesHasMore[postdata._id] ?? false;
  const isLiking = likingPostIds.includes(postdata._id);
  const isBookmarking = bookmarkingPostIds.includes(postdata._id);

  const isPostLiked =
    postLikeOverrides[postdata._id]?.isLiked ??
    postdata.isLiked ??
    (currentUserId
      ? (postdata.likes?.includes(currentUserId) ?? false)
      : false);
  const postLikesCount =
    postLikeOverrides[postdata._id]?.likesCount ??
    postdata.likesCount ??
    postdata.likes?.length ??
    0;

  async function handleToggleLike() {
    const result = await dispatch(
      togglePostLike({
        postId: postdata._id,
        currentlyLiked: isPostLiked,
        likesCount: postLikesCount,
      }),
    );
    if (togglePostLike.rejected.match(result) && !result.meta.condition) {
      toast.error(result.error.message || "Could not update like");
    }
  }

  function handleToggleBookmark() {
    dispatch(togglePostBookmark(postdata._id))
      .unwrap()
      .then(({ bookmarked }) => {
        setIsBookmarked(bookmarked);
        toast.success(
          bookmarked ? "Post saved" : "Post removed from saved posts",
        );
        handleClose();
      })
      .catch((error: Error) => {
        toast.error(error.message || "Could not update saved post");
      });
  }

  function openLikesDialog() {
    setLikesDialogOpen(true);

    if (!postLikes[postdata._id]) {
      dispatch(getPostLikes({ postId: postdata._id, page: 1, limit: 20 }));
    }
  }

  function loadMoreLikes() {
    dispatch(
      getPostLikes({
        postId: postdata._id,
        page: (likesPage[postdata._id] || 1) + 1,
        limit: 20,
      }),
    );
  }

  const isLoadingComments =
    commentsLoading ||
    (commentsPostId === postdata._id && commentsFetchLoading);

  const commentsError =
    showAllComments && commentsPostId === postdata._id
      ? commentsFetchError
      : null;

  function loadCommentsPage() {
    const nextPage = commentsError
      ? Math.max(1, commentsPage + (commentsPage > 0 ? 1 : 0))
      : commentsPage + 1;

    dispatch(
      getAllComments({ postId: postdata._id, page: nextPage, limit: 10 }),
    );
  }

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "none",
        boxSizing: "border-box",
        my: 0,
        border: "1px solid var(--border)",
        borderRadius: "17px",
        boxShadow: "0 2px 5px rgb(24 34 55 / 0.12)",
        overflow: "hidden",
        bgcolor: "var(--surface)",
        color: "var(--text-primary)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          px: { xs: 1.75, sm: 2.25 },
          pt: 2,
        }}
      >
        <ButtonBase
          onClick={handleOpenAuthorProfile}
          aria-label={`View ${postName}'s profile`}
          sx={{ borderRadius: "50%", flexShrink: 0 }}
        >
          <Avatar
            src={userPhoto || undefined}
            alt={postName}
            sx={{
              width: 44,
              height: 44,
              bgcolor: "var(--accent-soft)",
              color: "var(--accent-strong)",
            }}
          >
            {!userPhoto && <PersonIcon sx={{ fontSize: 28 }} />}
          </Avatar>
        </ButtonBase>

        <Box sx={{ minWidth: 0, flex: 1, pt: 0.2 }}>
          <Typography
            component="button"
            onClick={handleOpenAuthorProfile}
            sx={{
              display: "block",
              p: 0,
              border: 0,
              bgcolor: "transparent",
              color: "var(--text-primary)",
              font: "inherit",
              fontSize: 16,
              fontWeight: 800,
              lineHeight: 1.35,
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            {postName}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mt: 0.6,
              color: "var(--text-secondary)",
            }}
          >
            <Typography
              component="button"
              onClick={handleOpenAuthorProfile}
              sx={{
                p: 0,
                border: 0,
                bgcolor: "transparent",
                color: "inherit",
                font: "inherit",
                fontSize: 12,
                lineHeight: 1.5,
                cursor: "pointer",
                "&:hover": {
                  color: "var(--accent-strong)",
                  textDecoration: "underline",
                },
              }}
            >
              {postUsername}
            </Typography>

            <Typography
              component="span"
              aria-hidden="true"
              sx={{ color: "var(--text-muted)" }}
            >
              ·
            </Typography>

            <Typography component="span" sx={{ fontSize: 12 }}>
              {formatRelativeTime(postdata.createdAt)}
            </Typography>

            <Typography
              component="span"
              aria-hidden="true"
              sx={{ color: "var(--text-muted)" }}
            >
              ·
            </Typography>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: 12,
              }}
            >
              <PublicOutlinedIcon sx={{ fontSize: 15 }} /> Public
            </Box>
          </Box>
        </Box>

        <>
          <IconButton
            aria-label="Post options"
            onClick={handleClick}
            sx={{
              mt: -0.5,
              color: open ? "var(--accent-strong)" : "var(--text-secondary)",
              bgcolor: open ? "var(--accent-soft)" : "transparent",
              border: "1px solid",
              borderColor: open ? "var(--accent-border)" : "transparent",
              transition: "all 160ms ease",
              "&:hover": {
                bgcolor: "var(--accent-soft)",
                color: "var(--accent-strong)",
                borderColor: "var(--accent-border)",
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  minWidth: 220,
                  mt: 0.75,
                  p: 0.75,
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  boxShadow: "0 12px 32px rgb(15 23 42 / 0.16)",
                  bgcolor: "var(--surface)",
                  color: "var(--text-primary)",
                  "& .MuiList-root": { p: 0 },
                },
              },
            }}
          >
            <MenuItem
              onClick={handleToggleBookmark}
              disabled={isBookmarking}
              sx={{
                minHeight: 46,
                gap: 1.5,
                px: 1.5,
                borderRadius: "11px",
                color: "var(--text-primary)",
                fontSize: 14,
                fontWeight: 650,
                "&:hover": { bgcolor: "var(--surface-hover)" },
              }}
            >
              {isBookmarked ? (
                <BookmarkIcon
                  sx={{ color: "var(--accent-strong)", fontSize: 20 }}
                />
              ) : (
                <BookmarkBorderOutlinedIcon
                  sx={{ color: "var(--text-secondary)", fontSize: 20 }}
                />
              )}
              {isBookmarked ? "Unsave post" : "Save post"}
            </MenuItem>

            {postUserId === currentUserId && (
              <>
                <Box
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderTop: "1px solid var(--border)",
                  }}
                />

                <MenuItem
                  onClick={() => {
                    setOpenEditModal(true);
                    handleClose();
                  }}
                  sx={{
                    minHeight: 46,
                    gap: 1.5,
                    px: 1.5,
                    borderRadius: "11px",
                    color: "var(--text-primary)",
                    fontSize: 14,
                    fontWeight: 650,
                    "&:hover": { bgcolor: "var(--surface-hover)" },
                  }}
                >
                  <EditOutlinedIcon
                    sx={{ color: "var(--text-secondary)", fontSize: 20 }}
                  />
                  Edit post
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleDelete(postdata._id);
                    handleClose();
                  }}
                  sx={{
                    minHeight: 46,
                    gap: 1.5,
                    px: 1.5,
                    borderRadius: "11px",
                    color: "var(--danger-text)",
                    fontSize: 14,
                    fontWeight: 650,
                    "&:hover": { bgcolor: "var(--danger-soft)" },
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                  Delete post
                </MenuItem>
              </>
            )}
          </Menu>
        </>
      </Box>

      <CardContent
        sx={{
          px: { xs: 1.75, sm: 2.25 },
          pt: 1.75,
          pb: 1.75,
          cursor: "pointer",
        }}
        onClick={() => handleSinglePost(postdata._id)}
      >
        <Typography
          sx={{
            color: "var(--text-primary)",
            fontSize: 14,
            lineHeight: 1.55,
            whiteSpace: "pre-wrap",
          }}
        >
          {postdata.body}
        </Typography>

        {sharedPostData && (
          <Box
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/singlePost/${sharedPostData._id}`);
            }}
            sx={{
              mt: 1.5,
              overflow: "hidden",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              bgcolor: "var(--surface-subtle)",
              cursor: "pointer",
              transition: "border-color 150ms ease, box-shadow 150ms ease",
              "&:hover": {
                borderColor: "var(--accent-border)",
                boxShadow: "0 4px 14px rgb(23 105 232 / 0.07)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1.5,
                pb: 1,
              }}
            >
              <ButtonBase
                onClick={(event) => {
                  event.stopPropagation();
                  const authorId = sharedAuthor?._id;
                  if (authorId) router.push(`/profile/${authorId}`);
                }}
                aria-label={`View ${sharedAuthor?.name || "original author"}'s profile`}
                sx={{ flexShrink: 0, borderRadius: "50%" }}
              >
                <Avatar
                  src={sharedAuthor?.photo || undefined}
                  alt={sharedAuthor?.name || "Original author"}
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "var(--accent-soft)",
                    color: "var(--accent-strong)",
                  }}
                >
                  {!sharedAuthor?.photo && <PersonIcon sx={{ fontSize: 23 }} />}
                </Avatar>
              </ButtonBase>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    color: "var(--text-primary)",
                    fontSize: 13.5,
                    fontWeight: 800,
                  }}
                  noWrap
                >
                  {sharedAuthor?.name || "Original post"}
                </Typography>

                <Typography
                  sx={{ color: "var(--text-muted)", fontSize: 11.5 }}
                  noWrap
                >
                  @{(sharedAuthor?.username || "user").replace(/^@/, "")}
                </Typography>
              </Box>

              <Typography
                sx={{
                  flexShrink: 0,
                  color: "var(--accent-strong)",
                  fontSize: 12,
                  fontWeight: 750,
                }}
              >
                Original post ↗
              </Typography>
            </Box>

            {sharedPostData.body && (
              <Typography
                sx={{
                  px: 1.5,
                  pb: 1.5,
                  color: "var(--text-secondary)",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                }}
              >
                {sharedPostData.body}
              </Typography>
            )}

            {sharedPostData.image && sharedPostData.image !== "undefined" && (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 300, sm: 420 },
                  display: "flex",
                  justifyContent: "center",
                  bgcolor: "var(--media-bg)",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={sharedPostData.image}
                  alt="Shared post image"
                  width={1200}
                  height={800}
                  style={{
                    display: "block",
                    width: "auto",
                    maxWidth: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </CardContent>

      {postdata?.image && postdata.image !== "undefined" ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 320, sm: 440, md: 560 },
            display: "flex",
            justifyContent: "center",
            bgcolor: "var(--media-bg)",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => handleSinglePost(postdata._id)}
        >
          <Image
            src={postdata.image}
            alt="Post image"
            width={1200}
            height={800}
            style={{
              width: "auto",
              maxWidth: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </Box>
      ) : null}

      <Box sx={{ px: { xs: 1.75, sm: 2.25 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            py: 1.1,
          }}
        >
          <Button
            onClick={openLikesDialog}
            aria-label={`View ${postLikesCount} people who liked this post`}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              p: 0,
              minWidth: 0,
              color: "var(--text-secondary)",
              textTransform: "none",
              fontWeight: 400,
              "&:hover": {
                bgcolor: "transparent",
                color: "var(--text-secondary)",
              },
            }}
          >
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: "#2563EB",
                color: "#FFFFFF",
              }}
            >
              <ThumbUpAltOutlinedIcon sx={{ fontSize: 15 }} />
            </Box>

            <Typography
              component="span"
              sx={{ fontSize: 13, color: "inherit" }}
            >
              {postLikesCount} likes
            </Typography>
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2.5 },
              color: "var(--text-secondary)",
            }}
          >
            <Typography
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                alignItems: "center",
                gap: 0.5,
                fontSize: 12,
              }}
            >
              <RepeatOutlinedIcon sx={{ fontSize: 17 }} />{" "}
              {postdata.sharesCount ?? 0} shares
            </Typography>

            <Typography sx={{ fontSize: 12, whiteSpace: "nowrap" }}>
              {commentCount} {commentCount === 1 ? "comment" : "comments"}
            </Typography>

            <Button
              onClick={() => handleSinglePost(postdata._id)}
              sx={{
                px: 1,
                py: 0.35,
                minWidth: "auto",
                color: "var(--accent-strong)",
                fontWeight: 750,
                fontSize: 12,
                whiteSpace: "nowrap",
                textDecoration: "none",
                borderRadius: "8px",
                transition: "background-color 150ms ease, color 150ms ease",
                "&:hover": {
                  bgcolor: "var(--accent-soft)",
                  color: "var(--accent-strong)",
                },
              }}
            >
              View details
            </Button>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "var(--border)" }} />

        <CardActions
          disableSpacing
          sx={{
            px: 0,
            py: 0.35,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          <Button
            startIcon={<ThumbUpAltOutlinedIcon />}
            onClick={handleToggleLike}
            disabled={isLiking}
            sx={{
              minHeight: 40,
              color: isPostLiked ? "#3B82F6" : "var(--text-secondary)",
              fontSize: 13,
              fontWeight: isPostLiked ? 700 : 500,
              textTransform: "none",
              "&:hover": {
                bgcolor: "rgba(59, 130, 246, 0.08)",
              },
            }}
          >
            {isPostLiked ? "Liked" : "Like"}
          </Button>

          <Button
            startIcon={<CommentOutlinedIcon />}
            onClick={() => handleSinglePost(postdata._id)}
            sx={{
              minHeight: 40,
              color: "var(--text-secondary)",
              fontSize: 13,
              textTransform: "none",
            }}
          >
            Comment
          </Button>

          <Button
            startIcon={<ShareOutlinedIcon />}
            onClick={openShareDialog}
            sx={{
              minHeight: 40,
              color: "var(--text-secondary)",
              fontSize: 13,
              textTransform: "none",
            }}
          >
            Share
          </Button>
        </CardActions>

        {showAllComments ? (
          <Box
            sx={{
              mx: { xs: -1.75, sm: -2.25 },
              px: { xs: 1.75, sm: 2.25 },
              py: 2,
              bgcolor: "var(--surface-subtle)",
              borderTop: "1px solid var(--border)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                p: 1.25,
                mb: 2,
                border: "1px solid var(--border)",
                borderRadius: "14px",
                bgcolor: "var(--surface)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  sx={{
                    color: "var(--text-primary)",
                    fontWeight: 750,
                    fontSize: 14,
                  }}
                >
                  Comments
                </Typography>

                <Box
                  sx={{
                    px: 1,
                    py: 0.3,
                    borderRadius: "999px",
                    bgcolor: "var(--accent-soft)",
                    color: "var(--accent-strong)",
                    fontSize: 12,
                    fontWeight: 750,
                  }}
                >
                  {commentCount}
                </Box>
              </Box>

              <Select
                size="small"
                value={commentSort}
                onChange={(event) =>
                  setCommentSort(event.target.value as "relevant" | "newest")
                }
                inputProps={{ "aria-label": "Sort comments" }}
                sx={{
                  height: 38,
                  minWidth: 140,
                  borderRadius: "10px",
                  bgcolor: "var(--surface-subtle)",
                  color: "var(--text-primary)",
                  fontSize: 12,
                  fontWeight: 650,
                  "& .MuiSelect-icon": {
                    color: "var(--text-secondary)",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--border)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--border-strong)",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "var(--surface)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border)",
                      "& .MuiMenuItem-root:hover": {
                        bgcolor: "var(--surface-hover)",
                      },
                    },
                  },
                }}
              >
                <MenuItem value="relevant">Most relevant</MenuItem>
                <MenuItem value="newest">Newest</MenuItem>
              </Select>
            </Box>

            {isLoadingComments && comments.length === 0 ? (
              <Box
                role="status"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.25,
                  minHeight: 82,
                  mb: 2,
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  bgcolor: "var(--surface)",
                }}
              >
                <CircularProgress size={20} thickness={4} />
                <Typography
                  sx={{ color: "var(--text-secondary)", fontSize: 13 }}
                >
                  Loading comments
                </Typography>
              </Box>
            ) : commentsError && comments.length === 0 ? (
              <Paper
                role="alert"
                elevation={0}
                sx={{
                  display: "grid",
                  justifyItems: "center",
                  gap: 0.5,
                  p: 2.5,
                  mb: 2,
                  border: "1px solid var(--danger-border)",
                  borderRadius: "14px",
                  bgcolor: "var(--danger-soft)",
                  textAlign: "center",
                }}
              >
                <ErrorOutlineRounded
                  sx={{ color: "var(--danger-text)", fontSize: 26 }}
                />

                <Typography
                  sx={{
                    color: "var(--text-primary)",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  Comments couldn’t load
                </Typography>

                <Typography sx={{ color: "var(--text-muted)", fontSize: 12.5 }}>
                  {commentsError}
                </Typography>

                <Button
                  size="small"
                  startIcon={<RefreshRounded />}
                  onClick={loadCommentsPage}
                  disabled={isLoadingComments}
                  sx={{
                    mt: 0.5,
                    color: "var(--accent-strong)",
                    fontWeight: 750,
                    textTransform: "none",
                  }}
                >
                  Try again
                </Button>
              </Paper>
            ) : sortedComments.length > 0 ? (
              <Box sx={{ mb: 2 }}>
                {sortedComments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    currentUserId={currentUserId}
                    onDelete={handleDeleteFromUI}
                    onUpdate={handleUpdateFromUI}
                    currentUserPhoto={currentUserPhoto}
                  />
                ))}

                {commentsError && (
                  <Box
                    role="alert"
                    sx={{
                      mt: 1,
                      p: 1.25,
                      border: "1px solid var(--danger-border)",
                      borderRadius: "12px",
                      bgcolor: "var(--danger-soft)",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--danger-text)",
                        fontSize: 12.5,
                      }}
                    >
                      {commentsError}
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography
                sx={{
                  py: 3,
                  color: "var(--text-secondary)",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                No comments yet. Start the conversation.
              </Typography>
            )}

            {sortedComments.length > 0 &&
              (commentsHasMore || commentsError) && (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={
                    isLoadingComments ? (
                      <CircularProgress size={15} />
                    ) : commentsError ? (
                      <RefreshRounded />
                    ) : (
                      <ExpandMoreRounded />
                    )
                  }
                  onClick={loadCommentsPage}
                  disabled={isLoadingComments}
                  sx={{
                    mb: 2,
                    minHeight: 40,
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                    color: "var(--text-secondary)",
                    fontWeight: 750,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "var(--border-strong)",
                      bgcolor: "var(--surface-hover)",
                    },
                  }}
                >
                  {isLoadingComments
                    ? "Loading comments…"
                    : commentsError
                      ? "Retry loading comments"
                      : "Load more comments"}
                </Button>
              )}

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <Avatar
                src={currentUserPhoto || undefined}
                alt="Your profile"
                sx={{
                  width: 40,
                  height: 40,
                  mt: 0.25,
                  bgcolor: "var(--accent-soft)",
                  color: "var(--accent-strong)",
                }}
              >
                {!currentUserPhoto && <PersonIcon />}
              </Avatar>

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  p: { xs: 1.25, sm: 1.75 },
                  border: "1px solid var(--border)",
                  borderRadius: "22px",
                  bgcolor: "var(--surface-subtle)",
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={5}
                  placeholder={`Comment as ${currentUserName || "you"}...`}
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  inputProps={{ "aria-label": "Write a comment" }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      p: 0,
                      bgcolor: "transparent",
                      color: "var(--text-primary)",
                      borderRadius: 0,
                      fontSize: 14,
                      "& fieldset": { border: "none" },
                    },
                    "html[data-theme='dark'] & .MuiOutlinedInput-root": {
                      bgcolor: "transparent !important",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "var(--text-muted)",
                      opacity: 1,
                    },
                  }}
                />

                {commentImagePreview && (
                  <Box
                    sx={{
                      position: "relative",
                      width: "fit-content",
                      maxWidth: "100%",
                      mt: 1.25,
                      p: 0.5,
                      border: "1px solid var(--border)",
                      borderRadius: "13px",
                      bgcolor: "var(--surface)",
                    }}
                  >
                    <Image
                      src={commentImagePreview}
                      alt="Comment image preview"
                      width={480}
                      height={320}
                      unoptimized
                      style={{
                        display: "block",
                        width: "auto",
                        maxWidth: "min(100%, 280px)",
                        height: "auto",
                        maxHeight: 190,
                        objectFit: "contain",
                        borderRadius: 10,
                      }}
                    />

                    <IconButton
                      aria-label="Remove attached image"
                      onClick={() => {
                        setCommentImage(null);
                        setCommentImagePreview(null);
                      }}
                      disabled={isSubmittingComment}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 7,
                        right: 7,
                        width: 27,
                        height: 27,
                        bgcolor: "var(--surface)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border)",
                        boxShadow: "0 1px 5px rgb(15 23 42 / 0.2)",
                        "&:hover": {
                          bgcolor: "var(--surface-hover)",
                          color: "var(--danger-text)",
                        },
                      }}
                    >
                      <CloseRoundedIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 0.75,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <IconButton
                      component="label"
                      aria-label="Attach an image to comment"
                      disabled={isSubmittingComment}
                      size="small"
                      sx={{
                        color: commentImage
                          ? "var(--accent-strong)"
                          : "var(--text-secondary)",
                        width: 34,
                        height: 34,
                      }}
                    >
                      <ImageOutlinedIcon fontSize="small" />
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleCommentImageChange}
                      />
                    </IconButton>

                    <IconButton
                      aria-label="Add an emoji"
                      aria-haspopup="dialog"
                      aria-expanded={Boolean(commentEmojiAnchor)}
                      onClick={(event) =>
                        setCommentEmojiAnchor(event.currentTarget)
                      }
                      size="small"
                      sx={{
                        color: "var(--text-secondary)",
                        width: 34,
                        height: 34,
                      }}
                    >
                      <SentimentSatisfiedOutlinedIcon fontSize="small" />
                    </IconButton>

                    <Popover
                      open={Boolean(commentEmojiAnchor)}
                      anchorEl={commentEmojiAnchor}
                      onClose={() => setCommentEmojiAnchor(null)}
                      anchorOrigin={{ vertical: "top", horizontal: "left" }}
                      transformOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      slotProps={{
                        paper: {
                          sx: {
                            p: 0,
                            border: "1px solid var(--border)",
                            borderRadius: "14px",
                            overflow: "hidden",
                            bgcolor: "var(--surface)",
                          },
                        },
                      }}
                    >
                      <EmojiPicker
                        width={320}
                        height={400}
                        colorScheme={isDarkMode ? "dark" : "light"}
                        previewConfig={{ showPreview: false }}
                        onEmojiClick={(emojiData) => {
                          setCommentText(
                            (previous) => `${previous}${emojiData.emoji}`,
                          );
                          setCommentEmojiAnchor(null);
                        }}
                      />
                    </Popover>
                  </Box>

                  <IconButton
                    aria-label={
                      isSubmittingComment ? "Sending comment" : "Send comment"
                    }
                    onClick={handleCreateComment}
                    disabled={!commentText.trim() || isSubmittingComment}
                    sx={{
                      width: 44,
                      height: 44,
                      flexShrink: 0,
                      bgcolor: "var(--accent-strong)",
                      color: "#fff",
                      boxShadow: "0 2px 5px rgb(23 105 232 / 0.2)",
                      "&:hover": {
                        bgcolor: "var(--accent-strong)",
                        filter: "brightness(0.92)",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "var(--accent-disabled)",
                        color: "var(--text-muted)",
                      },
                      "html[data-theme='dark'] &": {
                        color: "#172033",
                      },
                    }}
                  >
                    {isSubmittingComment ? (
                      <CircularProgress size={19} color="inherit" />
                    ) : (
                      <SendOutlinedIcon />
                    )}
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : topComment ? (
          <Box
            sx={{
              mb: 2,
              p: { xs: 1.25, sm: 1.5 },
              border: "1px solid var(--border)",
              borderRadius: "18px",
              bgcolor: "var(--surface-subtle)",
            }}
          >
            <Typography
              sx={{
                mb: 1,
                color: "var(--text-secondary)",
                fontSize: 11,
                fontWeight: 750,
                textTransform: "uppercase",
              }}
            >
              Top comment
            </Typography>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <Avatar
                src={topComment.commentCreator.photo || undefined}
                alt={topComment.commentCreator.name}
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "var(--accent-soft)",
                  color: "var(--accent-strong)",
                }}
              >
                {!topComment.commentCreator.photo && <PersonIcon />}
              </Avatar>

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  p: 1.25,
                  borderRadius: "18px",
                  bgcolor: "var(--surface)",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--text-primary)",
                    fontSize: 12,
                    fontWeight: 750,
                  }}
                >
                  {topComment.commentCreator.name || "User"}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.4,
                    color: "var(--text-secondary)",
                    fontSize: 14,
                    overflowWrap: "anywhere",
                  }}
                >
                  {topComment.content}
                </Typography>

                {topComment.image && topComment.image !== "undefined" && (
                  <Image
                    src={topComment.image}
                    alt="Comment attachment"
                    width={560}
                    height={360}
                    unoptimized
                    style={{
                      display: "block",
                      width: "100%",
                      maxWidth: 340,
                      maxHeight: 190,
                      height: "auto",
                      objectFit: "contain",
                      marginTop: 8,
                      borderRadius: 10,
                    }}
                  />
                )}
              </Box>
            </Box>

            {commentCount > 1 && (
              <Button
                onClick={() => handleSinglePost(postdata._id)}
                sx={{
                  mt: 1,
                  px: 0,
                  color: "var(--accent-strong)",
                  fontWeight: 750,
                  fontSize: 13,
                  textTransform: "none",
                  textDecoration: "none",
                  "&:hover": {
                    bgcolor: "transparent",
                    color: "var(--accent-strong)",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  },
                }}
              >
                View all comments
              </Button>
            )}
          </Box>
        ) : null}
      </Box>

      {/* Likes Dialog */}
      <Dialog
        open={likesDialogOpen}
        onClose={() => setLikesDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            ...dialogPaperSx,
            m: 2,
            width: "calc(100% - 32px)",
            maxWidth: 480,
            height: { xs: "calc(100% - 32px)", sm: "min(90vh, 810px)" },
            maxHeight: "90vh",
            borderRadius: { xs: "20px", sm: "24px" },
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            px: { xs: 2, sm: 3 },
            py: 2,
            color: "var(--text-primary)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <PeopleAltOutlinedIcon
              sx={{ color: "var(--accent-strong)", fontSize: 25 }}
            />
            <Typography
              component="span"
              sx={{
                color: "var(--text-primary)",
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              People who reacted
            </Typography>
          </Box>

          <IconButton
            aria-label="Close likes dialog"
            onClick={() => setLikesDialogOpen(false)}
            size="small"
            sx={{ color: "var(--text-secondary)" }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 0,
            flex: 1,
            overflowY: "auto",
            bgcolor: "var(--surface)",
            color: "var(--text-primary)",
          }}
        >
          {likesLoading && likedUsers.length === 0 ? (
            <Box sx={{ display: "grid", placeItems: "center", minHeight: 240 }}>
              <CircularProgress size={30} />
            </Box>
          ) : likesError && likedUsers.length === 0 ? (
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                gap: 1,
                minHeight: 240,
                px: 3,
              }}
            >
              <Typography
                sx={{ color: "var(--text-secondary)" }}
                textAlign="center"
              >
                {likesError}
              </Typography>

              <Button
                onClick={() =>
                  dispatch(
                    getPostLikes({ postId: postdata._id, page: 1, limit: 20 }),
                  )
                }
                sx={{
                  color: "var(--accent-strong)",
                  textTransform: "none",
                }}
              >
                Try again
              </Button>
            </Box>
          ) : likedUsers.length === 0 ? (
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                minHeight: 240,
                px: 3,
              }}
            >
              <Typography sx={{ color: "var(--text-secondary)" }}>
                No reactions yet
              </Typography>
            </Box>
          ) : (
            <Box sx={{ py: 1 }}>
              {likedUsers.map((user: PostLike) => (
                <ButtonBase
                  key={user._id}
                  component="div"
                  onClick={() =>
                    user._id && router.push(`/profile/${user._id}`)
                  }
                  aria-label={`View ${user.name || "user"}'s profile`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 1.75,
                    minHeight: 90,
                    px: { xs: 2, sm: 3 },
                    width: "100%",
                    textAlign: "left",
                    borderRadius: "14px",
                    transition: "background-color 150ms ease, color 150ms ease",
                    "&:hover": { bgcolor: "var(--surface-hover)" },
                    "&:focus-visible": {
                      outline: "2px solid var(--accent-strong)",
                      outlineOffset: "-2px",
                    },
                  }}
                >
                  <Avatar
                    src={user.photo || undefined}
                    alt={user.name || "User"}
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: "var(--accent-soft)",
                      color: "var(--accent-strong)",
                    }}
                  >
                    {!user.photo && <PersonIcon />}
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: "var(--text-primary)",
                        fontSize: 15,
                        fontWeight: 750,
                      }}
                      noWrap
                    >
                      {user.name || "User"}
                    </Typography>

                    <Typography
                      sx={{ color: "var(--text-muted)", fontSize: 13 }}
                      noWrap
                    >
                      @{(user.username || "user").replace(/^@/, "")}
                    </Typography>
                  </Box>
                </ButtonBase>
              ))}

              {likesLoading && (
                <Box sx={{ display: "grid", placeItems: "center", py: 1.5 }}>
                  <CircularProgress size={24} />
                </Box>
              )}

              {likesError && (
                <Typography
                  sx={{
                    px: 3,
                    py: 1,
                    color: "var(--danger-text)",
                    fontSize: 13,
                  }}
                >
                  {likesError}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

        {(hasMoreLikes || (likesError && likedUsers.length > 0)) && (
          <DialogActions
            sx={{
              px: { xs: 2, sm: 3 },
              py: 1.5,
              borderTop: "1px solid var(--border)",
              bgcolor: "var(--surface)",
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              disabled={likesLoading}
              onClick={loadMoreLikes}
              sx={{
                minHeight: 48,
                borderRadius: "14px",
                borderColor: "var(--border-strong)",
                color: "var(--text-secondary)",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  borderColor: "var(--accent-strong)",
                  bgcolor: "var(--surface-hover)",
                },
              }}
            >
              {likesLoading
                ? "Loading…"
                : likesError
                  ? "Try again"
                  : "Load more"}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={closeShareDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            ...dialogPaperSx,
            borderRadius: { xs: "18px", sm: "22px" },
            boxShadow: "0 24px 70px rgb(15 23 42 / 0.24)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, sm: 2.5 },
            py: 1.75,
            color: "var(--text-primary)",
            fontSize: 19,
            fontWeight: 850,
            borderBottom: "1px solid var(--border)",
          }}
        >
          Share post
          <IconButton
            onClick={closeShareDialog}
            disabled={isSharing}
            aria-label="Close share dialog"
            size="small"
            sx={{ color: "var(--text-secondary)" }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: { xs: 2, sm: 2.5 },
            display: "grid",
            gap: 2,
            bgcolor: "var(--surface)",
          }}
        >
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={6}
            value={shareText}
            onChange={(event) => setShareText(event.target.value)}
            placeholder="Say something about this..."
            helperText={
              !shareText.trim() ? "Add a message to share this post." : " "
            }
            inputProps={{ "aria-label": "Add a message to your shared post" }}
            sx={{
              ...dialogTextFieldSx,
              mt: 0.5,
              "& .MuiOutlinedInput-root": {
                ...dialogTextFieldSx["& .MuiOutlinedInput-root"],
                alignItems: "flex-start",
                borderRadius: "15px",
                fontSize: 14,
              },
            }}
          />

          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 1.75 },
              border: "1px solid var(--border)",
              borderRadius: "17px",
              bgcolor: "var(--surface-subtle)",
              color: "var(--text-primary)",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}
            >
              <Avatar
                src={userPhoto || undefined}
                alt={postName}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "var(--accent-soft)",
                  color: "var(--accent-strong)",
                }}
              >
                {!userPhoto && <PersonIcon />}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: "var(--text-primary)",
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                  noWrap
                >
                  {postName}
                </Typography>

                <Typography
                  sx={{ color: "var(--text-muted)", fontSize: 12 }}
                  noWrap
                >
                  {postUsername}
                </Typography>
              </Box>
            </Box>

            {postdata.body && (
              <Typography
                sx={{
                  mb: postdata.image ? 1.25 : 0,
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {postdata.body}
              </Typography>
            )}

            {postdata.image && postdata.image !== "undefined" && (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxHeight: 330,
                  overflow: "hidden",
                  borderRadius: "12px",
                  bgcolor: "var(--media-bg)",
                }}
              >
                <Image
                  src={postdata.image}
                  alt="Preview of the post you are sharing"
                  width={1200}
                  height={800}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                    maxHeight: 330,
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
          </Paper>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 1.75,
            borderTop: "1px solid var(--border)",
            bgcolor: "var(--surface)",
            gap: 1,
          }}
        >
          <Button
            onClick={closeShareDialog}
            disabled={isSharing}
            sx={{
              minHeight: 42,
              px: 2,
              border: "1px solid var(--border)",
              borderRadius: "11px",
              color: "var(--text-secondary)",
              fontWeight: 750,
              textTransform: "none",
              "&:hover": {
                bgcolor: "var(--surface-hover)",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleShare}
            disabled={isSharing || !shareText.trim()}
            startIcon={
              isSharing ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <ShareOutlinedIcon />
              )
            }
            sx={{
              ...primaryButtonSx,
              minHeight: 42,
              px: 2.25,
              borderRadius: "11px",
            }}
          >
            {isSharing ? "Sharing…" : "Share now"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            ...dialogPaperSx,
            borderRadius: { xs: "18px", sm: "22px" },
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "var(--text-primary)",
            fontWeight: 800,
            borderBottom: "1px solid var(--border)",
          }}
        >
          Edit Post
        </DialogTitle>

        <DialogContent
          sx={{
            bgcolor: "var(--surface)",
            color: "var(--text-primary)",
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            sx={{
              ...dialogTextFieldSx,
              mt: 2,
            }}
          />

          {preview || postdata.image ? (
            <Box
              sx={{
                mt: 3,
                position: "relative",
                aspectRatio: "1 / 1",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "var(--media-bg)",
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

          <Button
            component="label"
            variant="outlined"
            fullWidth
            sx={{
              mt: 3,
              minHeight: 42,
              color: "var(--accent-strong)",
              borderColor: "var(--border-strong)",
              textTransform: "none",
              "&:hover": {
                borderColor: "var(--accent-strong)",
                bgcolor: "var(--surface-hover)",
              },
            }}
          >
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

        <DialogActions
          sx={{
            px: 2.5,
            py: 1.75,
            borderTop: "1px solid var(--border)",
            bgcolor: "var(--surface)",
          }}
        >
          <Button
            onClick={() => {
              setOpenEditModal(false);
              setPreview(null);
              setImage(null);
              setContent(postdata.body);
            }}
            sx={{
              color: "var(--text-secondary)",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            sx={{
              ...primaryButtonSx,
              px: 2.5,
              borderRadius: "10px",
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
