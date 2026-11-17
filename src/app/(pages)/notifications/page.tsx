"use client";

import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Container,
  CircularProgress,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";

import DoneAllOutlined from "@mui/icons-material/DoneAllOutlined";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";
import ChatBubbleOutlineOutlined from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ErrorOutlineRounded from "@mui/icons-material/ErrorOutlineRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import NotificationsNoneRounded from "@mui/icons-material/NotificationsNoneRounded";
import PersonAddAlt1Outlined from "@mui/icons-material/PersonAddAlt1Outlined";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { dispatchType, stateType } from "@/lib/store";

import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/notificationSlice";

function formatRelativeDate(value?: string | null): string {
  if (!value) return "Date unavailable";

  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "Date unavailable";

  const elapsed = Math.max(0, Date.now() - timestamp);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (elapsed < minute) return "now";
  if (elapsed < hour) return `${Math.floor(elapsed / minute)}m`;
  if (elapsed < day) return `${Math.floor(elapsed / hour)}h`;

  const days = Math.floor(elapsed / day);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

export default function NotificationsPage() {
  const dispatch = useDispatch<dispatchType>();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");

  const {
    notifications,
    unreadCount,
    currentPage,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMoreError,
    isError,
    error,
    markAllNotificationsLoading,
    markAllNotificationsError,
    pendingNotificationIds,
    markNotificationErrors,
  } = useSelector((state: stateType) => state.notifications);

  useEffect(() => {
    dispatch(getUnreadCount());
    dispatch(getNotifications({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleFilterChange = (filter: "all" | "unread") => {
    setActiveFilter(filter);
    dispatch(
      getNotifications({
        ...(filter === "unread" && { unread: true }),
        page: 1,
        limit: 10,
      }),
    );
  };

  const handleLoadMore = () => {
    if (isLoading || isLoadingMore || !hasMore) return;

    dispatch(
      getNotifications({
        ...(activeFilter === "unread" && { unread: true }),
        page: currentPage + 1,
        limit: 10,
      }),
    );
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        py: 2,
        px: { xs: 1.5, md: 2.5 },
      }}
    >
      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid #e1e8f0",
          borderRadius: "16px",
          boxShadow: "0 2px 5px rgb(15 23 42 / 0.08)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box sx={{ p: { xs: 1.8, md: 2.5 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.4 }}>
              <Box
                aria-hidden="true"
                sx={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "14px",
                  bgcolor: "#edf4ff",
                  color: "#1976ed",
                }}
              >
                <NotificationsNoneRounded />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: "#172033",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Notifications
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    mt: 0.25,
                    fontSize: 13.5,
                  }}
                >
                  Updates about likes, comments, shares, and follows.
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "flex-start", sm: "flex-end" },
                gap: 0.5,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<DoneAllOutlined />}
                onClick={() => dispatch(markAllNotificationsAsRead())}
                disabled={
                  markAllNotificationsLoading || notifications.length === 0
                }
                sx={{
                  borderColor: "#e1e8f0",
                  color: "#34445c",
                  borderRadius: "10px",
                  px: 1.7,
                  py: 0.8,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  transition:
                    "background-color 150ms ease, border-color 150ms ease, color 150ms ease",
                  "&:hover": {
                    bgcolor: "#f5f9ff",
                    borderColor: "#bfd7fb",
                    color: "#1976ed",
                  },
                }}
              >
                {markAllNotificationsLoading
                  ? "Marking..."
                  : "Mark all as read"}
              </Button>
              {markAllNotificationsError && (
                <Typography
                  role="alert"
                  sx={{
                    color: "#b42318",
                    fontSize: 12,
                    textAlign: { xs: "left", sm: "right" },
                  }}
                >
                  {markAllNotificationsError}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Filters */}
          <Box sx={{ display: "flex", gap: 1, mt: 2.5 }}>
            <Button
              onClick={() => handleFilterChange("all")}
              aria-pressed={activeFilter === "all"}
              variant={activeFilter === "all" ? "contained" : "outlined"}
              sx={{
                borderRadius: "30px",
                px: 2.2,
                minWidth: 58,
                minHeight: 36,
                bgcolor: activeFilter === "all" ? "#1976ed" : "#f1f5f9",
                color: activeFilter === "all" ? "#fff" : "#34445c",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "none",
                transition: "background-color 150ms ease, color 150ms ease",
                "&:focus-visible": {
                  outline: "3px solid #bfdbfe",
                  outlineOffset: 2,
                },
                "&:hover": {
                  bgcolor: activeFilter === "all" ? "#1769d8" : "#e8eef5",
                  boxShadow: "none",
                },
              }}
            >
              All
            </Button>

            <Button
              onClick={() => handleFilterChange("unread")}
              aria-pressed={activeFilter === "unread"}
              variant={activeFilter === "unread" ? "contained" : "outlined"}
              sx={{
                borderRadius: "30px",
                px: 2,
                minHeight: 36,
                bgcolor: activeFilter === "unread" ? "#1976ed" : "#f1f5f9",
                color: activeFilter === "unread" ? "#fff" : "#34445c",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "none",
                gap: 0.8,
                boxShadow: "none",
                transition: "background-color 150ms ease, color 150ms ease",
                "&:focus-visible": {
                  outline: "3px solid #bfdbfe",
                  outlineOffset: 2,
                },
                "&:hover": {
                  bgcolor: activeFilter === "unread" ? "#1769d8" : "#e8eef5",
                  boxShadow: "none",
                },
              }}
            >
              Unread
              <Box
                sx={{
                  bgcolor: "#fff",
                  color: "#1976ed",
                  borderRadius: "50%",
                  width: 22,
                  height: 22,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {unreadCount}
              </Box>
            </Button>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#e3eaf2" }} />

        {/* Notifications List */}
        <Box
          sx={{
            p: { xs: 1.2, md: 2 },
            display: "flex",
            flexDirection: "column",
            gap: 1.2,
          }}
        >
          {isLoading ? (
            Array.from({ length: 4 }, (_, index) => (
              <Box
                key={`notification-skeleton-${index}`}
                aria-hidden="true"
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.2,
                  px: { xs: 1.1, md: 1.4 },
                  py: { xs: 0.8, md: 1 },
                  minHeight: 82,
                  borderRadius: "17px",
                  border: "1px solid #e1e8f0",
                  borderRight: "none",
                  bgcolor: "#fff",
                }}
              >
                <Box sx={{ position: "relative", flexShrink: 0 }}>
                  <Skeleton
                    variant="circular"
                    animation="wave"
                    width={42}
                    height={42}
                  />

                  <Skeleton
                    variant="circular"
                    animation="wave"
                    width={22}
                    height={22}
                    sx={{
                      position: "absolute",
                      right: -4,
                      bottom: -4,
                      bgcolor: "#e8eef5",
                      border: "2px solid #fff",
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Skeleton
                      animation="wave"
                      variant="text"
                      width="58%"
                      height={23}
                    />

                    <Skeleton
                      animation="wave"
                      variant="text"
                      width={68}
                      height={19}
                      sx={{ flexShrink: 0 }}
                    />
                  </Box>

                  <Skeleton
                    animation="wave"
                    variant="text"
                    width="76%"
                    height={20}
                    sx={{ mt: 0.2 }}
                  />

                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={100}
                    height={28}
                    sx={{ mt: 0.75, borderRadius: "8px" }}
                  />
                </Box>

                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={6}
                  height={6}
                  sx={{ mt: 1.2, flexShrink: 0 }}
                />
              </Box>
            ))
          ) : isError ? (
            <Box
              role="alert"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 1,
                p: { xs: 3, md: 4 },
                minHeight: 220,
                borderRadius: "17px",
                border: "1px solid #e1e8f0",
                bgcolor: "#fff",
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  bgcolor: "#fff1f2",
                  color: "#e11d48",
                }}
              >
                <ErrorOutlineRounded />
              </Box>

              <Typography
                sx={{ color: "#172033", fontSize: 16, fontWeight: 800 }}
              >
                Notifications couldn’t load
              </Typography>

              <Typography
                sx={{ color: "#64748b", fontSize: 14, maxWidth: 420 }}
              >
                {error || "Something went wrong while loading notifications."}
              </Typography>

              <Button
                variant="outlined"
                startIcon={<RefreshRounded />}
                onClick={() =>
                  dispatch(
                    getNotifications({
                      ...(activeFilter === "unread" && { unread: true }),
                      page: 1,
                      limit: 10,
                    }),
                  )
                }
                sx={{
                  mt: 0.5,
                  borderColor: "#d5e5ff",
                  color: "#1976ed",
                  borderRadius: "10px",
                  fontWeight: 700,
                  textTransform: "none",
                  px: 2,
                  "&:hover": {
                    bgcolor: "#f5f9ff",
                    borderColor: "#1976ed",
                  },
                }}
              >
                Try again
              </Button>
            </Box>
          ) : notifications.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 1,
                p: { xs: 3, md: 4 },
                minHeight: 220,
                borderRadius: "17px",
                border: "1px solid #e1e8f0",
                bgcolor: "#fff",
              }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  bgcolor: "#edf4ff",
                  color: "#1976ed",
                }}
              >
                <NotificationsNoneRounded sx={{ fontSize: 28 }} />
              </Box>

              <Typography
                sx={{ color: "#172033", fontSize: 16, fontWeight: 800 }}
              >
                No notifications yet
              </Typography>

              <Typography
                sx={{ color: "#64748b", fontSize: 14, maxWidth: 420 }}
              >
                You&apos;re all caught up! We&apos;ll let you know when
                something happens.
              </Typography>
            </Box>
          ) : (
            notifications.map((notification) => {
              const notificationType = notification.type?.toLowerCase() ?? "";
              const isFollowNotification = notificationType.includes("follow");
              const isPostNotification =
                notificationType === "like_post" ||
                notificationType === "comment_post";
              const canOpenPost =
                isPostNotification && Boolean(notification.entityId);
              const isMarkingThisNotification = pendingNotificationIds.includes(
                notification._id,
              );
              const markNotificationError =
                markNotificationErrors[notification._id];

              const handleOpenPost = () => {
                if (canOpenPost) {
                  router.push(`/singlePost/${notification.entityId}`);
                }
              };

              return (
                <Box
                  key={notification._id}
                  onClick={handleOpenPost}
                  onKeyDown={(event) => {
                    if (
                      canOpenPost &&
                      event.target === event.currentTarget &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      handleOpenPost();
                    }
                  }}
                  role={canOpenPost ? "link" : undefined}
                  tabIndex={canOpenPost ? 0 : undefined}
                  aria-label={
                    canOpenPost
                      ? `Open post ${notification.entityId}`
                      : undefined
                  }
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.2,
                    px: { xs: 1.1, md: 1.4 },
                    pt: { xs: 0.8, md: 2 },
                    pb: { xs: 0.8, md: 1 },
                    minHeight: 82,
                    borderRadius: "17px",
                    border: "1px solid",
                    borderColor: notification.isRead ? "#e1e8f0" : "#d7e7ff",
                    bgcolor: notification.isRead ? "#fff" : "#edf4ff",
                    borderLeft: notification.isRead ? "1px solid #e1e8f0" : "",
                    boxShadow: notification.isRead
                      ? "0 1px 3px rgb(15 23 42 / 0.03)"
                      : "0 2px 8px rgb(25 118 237 / 0.06)",
                    transition:
                      "background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
                    cursor: canOpenPost ? "pointer" : "default",
                    "&:focus-visible": canOpenPost
                      ? {
                          outline: "3px solid #93c5fd",
                          outlineOffset: 2,
                        }
                      : undefined,
                    "&:hover": {
                      borderColor: notification.isRead ? "#cbd5e1" : "#b7d4ff",
                      boxShadow: "0 6px 16px rgb(15 23 42 / 0.07)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {/* Avatar and notification type */}
                  <Box
                    sx={{
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    <ButtonBase
                      component="span"
                      onClick={(event) => {
                        event.stopPropagation();
                        router.push(`/profile/${notification.actor._id}`);
                      }}
                      aria-label={`View ${notification.actor.name}'s profile`}
                      sx={{
                        borderRadius: "50%",
                        transition: "transform 150ms ease",
                        "&:hover": { transform: "scale(1.04)" },
                        "&:focus-visible": {
                          outline: "3px solid #93c5fd",
                          outlineOffset: 2,
                        },
                      }}
                    >
                      <Avatar
                        src={notification.actor.photo}
                        sx={{
                          width: 42,
                          height: 42,
                          bgcolor: "#dce7fb",
                          fontSize: 15,
                        }}
                      >
                        {notification.actor.name.charAt(0)}
                      </Avatar>
                    </ButtonBase>

                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -4,
                        right: -4,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        bgcolor: "#fff",
                        display: "grid",
                        placeItems: "center",
                        color: isFollowNotification
                          ? "#9333ea"
                          : notificationType === "like_post"
                            ? "#f43f5e"
                            : "#1976ed",
                      }}
                    >
                      {isFollowNotification ? (
                        <PersonAddAlt1Outlined sx={{ fontSize: 16 }} />
                      ) : notificationType === "like_post" ? (
                        <FavoriteBorderOutlined sx={{ fontSize: 16 }} />
                      ) : (
                        <ChatBubbleOutlineOutlined sx={{ fontSize: 16 }} />
                      )}
                    </Box>
                  </Box>

                  {/* Notification content */}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#172033",
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        <ButtonBase
                          component="span"
                          onClick={(event) => {
                            event.stopPropagation();
                            router.push(`/profile/${notification.actor._id}`);
                          }}
                          aria-label={`View ${notification.actor.name}'s profile`}
                          sx={{
                            display: "inline",
                            p: 0,
                            color: "inherit",
                            font: "inherit",
                            fontWeight: 800,
                            lineHeight: "inherit",
                            textAlign: "left",
                            verticalAlign: "baseline",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {notification.actor.name}
                        </ButtonBase>{" "}
                        {isFollowNotification
                          ? "followed you"
                          : notificationType === "like_post"
                            ? "liked your post"
                            : notificationType === "comment_post"
                              ? "commented on your post"
                              : "interacted with your post"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.8,
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#64748b",
                            fontSize: 12,
                            lineHeight: 1,
                            whiteSpace: "nowrap",
                            px: 0.8,
                            py: 0.45,
                            borderRadius: "999px",
                            bgcolor: "#f1f5f9",
                            fontWeight: 700,
                          }}
                        >
                          {formatRelativeDate(notification.createdAt)}
                        </Typography>
                        {!notification.isRead && (
                          <Box
                            aria-label="Unread"
                            sx={{
                              width: 6,
                              height: 6,
                              flexShrink: 0,
                              borderRadius: "50%",
                              bgcolor: "#1976ed",
                              boxShadow: "0 0 0 3px #dbeafe",
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {!("unavailable" in notification.entity) &&
                      notification.entity.body && (
                        <Typography
                          sx={{
                            color: "#64748b",
                            mt: 0.4,
                            fontSize: 13,
                          }}
                        >
                          {notification.entity.body}
                        </Typography>
                      )}

                    <Box sx={{ mt: 0.8 }}>
                      {notification.isRead ? (
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.4,
                            color: "#059669",
                            fontSize: 12.5,
                          }}
                        >
                          <CheckOutlined sx={{ fontSize: 16 }} />
                          Read
                        </Box>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<CheckOutlined />}
                          onClick={(event) => {
                            event.stopPropagation();
                            dispatch(
                              markNotificationAsRead({
                                id: notification._id,
                              }),
                            );
                          }}
                          disabled={isMarkingThisNotification}
                          sx={{
                            borderColor: "#d5e5ff",
                            bgcolor: "#fff",
                            color: "#1976ed",
                            borderRadius: "8px",
                            fontSize: 12,
                            fontWeight: 700,
                            textTransform: "none",
                            px: 1,
                            py: 0.35,
                            "&:hover": {
                              bgcolor: "#f5f9ff",
                              borderColor: "#1976ed",
                            },
                          }}
                        >
                          {isMarkingThisNotification
                            ? "Marking..."
                            : "Mark as read"}
                        </Button>
                      )}
                      {markNotificationError && (
                        <Typography
                          role="alert"
                          sx={{ color: "#b42318", mt: 0.6, fontSize: 12 }}
                        >
                          {markNotificationError}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
          {!isLoading && !isError && notifications.length > 0 && hasMore && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.8,
                pt: 0.5,
              }}
            >
              {loadMoreError && (
                <Typography
                  role="alert"
                  sx={{ color: "#b42318", fontSize: 13, textAlign: "center" }}
                >
                  {loadMoreError}
                </Typography>
              )}
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                startIcon={
                  isLoadingMore ? <CircularProgress size={16} /> : undefined
                }
                sx={{
                  minWidth: 140,
                  borderColor: "#d5e5ff",
                  color: "#1976ed",
                  borderRadius: "10px",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#f5f9ff",
                    borderColor: "#1976ed",
                  },
                }}
              >
                {isLoadingMore
                  ? "Loading more..."
                  : loadMoreError
                    ? "Try again"
                    : "Load more"}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}
