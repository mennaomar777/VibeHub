"use client";
import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Skeleton, Typography } from "@mui/material";
import ErrorOutlineRounded from "@mui/icons-material/ErrorOutlineRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import { useDispatch, useSelector } from "react-redux";
import { dispatchType, stateType } from "@/lib/store";
import { getAllPosts, getHomeFeed, getUserBookmarks } from "@/lib/postSlice";
import { PostData } from "../../../app/interfaces/postData";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Post from "@/app/_components/Post/page";
import CreatePost from "@/app/_components/CreatePost/CreatePost";
import SideBar from "@/app/_components/SideBar/SideBar";
import SuggestedFriends from "@/app/_components/SuggestedFriends/SuggestedFriends";
import useUserInfo from "@/lib/useUserPosts";

type FeedView = "feed" | "myPosts" | "community" | "saved";

export default function Home() {
  const {
    homeFeed,
    allPosts,
    savedPosts,
    savedPostsLoading,
    savedPostsError,
    savedPostsHasMore,
    savedPostsPage,
    isLoading,
    isError,
    error: postsError,
  } = useSelector(
    (state: stateType) => state.post,
  );
  const [activeView, setActiveView] = useState<FeedView>("feed");

  const dispatch = useDispatch<dispatchType>();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();
  const { userData } = useSelector((state: stateType) => state.profile);
  const myPosts = useUserInfo(currentUserId ?? "", activeView === "myPosts", 10);

  const postsToShow =
    activeView === "saved"
      ? savedPosts
      : activeView === "myPosts"
        ? myPosts.posts
        : activeView === "community"
          ? allPosts
          : homeFeed;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const decoded = jwtDecode<{ user?: string }>(token);
      setCurrentUserId(decoded.user ?? null);

      if (activeView === "community") {
        dispatch(getAllPosts());
      } else if (activeView === "saved") {
        dispatch(getUserBookmarks({ page: 1, limit: 20 }));
      } else if (activeView === "feed") {
        dispatch(getHomeFeed({ only: "following" }));
      }
    }
  }, [activeView, dispatch, router]);

  function refreshActivePosts() {
    if (activeView === "community") {
      dispatch(getAllPosts());
      return;
    }

    if (activeView === "saved") {
      dispatch(getUserBookmarks({ page: 1, limit: 20 }));
      return;
    }

    if (activeView === "myPosts") {
      myPosts.refetch();
      return;
    }

    dispatch(getHomeFeed({ only: "following" }));
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 84px)",
        bgcolor: "#f0f2f5",
        px: { xs: 1.5, sm: 3, lg: 4 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1480,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "220px minmax(0, 1fr) 285px",
          },
          "& > :last-child": { display: { xs: "none", lg: "block" } },
          alignItems: "start",
          gap: { xs: 1.5, lg: 2 },
        }}
      >
        <SideBar activeView={activeView} onViewChange={setActiveView} />
        <Box sx={{ minWidth: 0, width: "100%" }}>
          {activeView !== "saved" && (
            <Box sx={{ mb: 2, width: "100%" }}>
              <CreatePost onPostChange={refreshActivePosts} />
            </Box>
          )}
          {(activeView === "saved"
            ? savedPostsLoading && !savedPosts?.length
            : activeView === "myPosts"
              ? myPosts.loading
              : isLoading) ? (
            <FeedPostsSkeleton />
          ) : activeView === "saved" && savedPostsError ? (
            <FeedErrorState message={savedPostsError} onRetry={refreshActivePosts} />
          ) : activeView === "myPosts" && myPosts.error ? (
            <FeedErrorState
              message={myPosts.error || "We couldn’t load your posts."}
              onRetry={refreshActivePosts}
            />
          ) : activeView !== "saved" && activeView !== "myPosts" && isError ? (
            <FeedErrorState
              message={postsError || "We couldn’t load these posts."}
              onRetry={refreshActivePosts}
            />
          ) : postsToShow && postsToShow.length > 0 ? (
            postsToShow.map((post: PostData) => (
              <Box key={post._id} sx={{ mb: 2, width: "100%" }}>
                <Post
                  postdata={post}
                  currentUserId={currentUserId}
                  showAllComments={false}
                  currentUserPhoto={userData?.photo || ""}
                  onPostChange={refreshActivePosts}
                />
              </Box>
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 12 }}>
              <Typography variant="h6" color="text.secondary">
                {activeView === "saved"
                  ? "No saved posts yet"
                  : activeView === "myPosts"
                    ? "No posts yet"
                    : "No posts yet"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {activeView === "saved"
                  ? "Posts you save will appear here."
                  : activeView === "myPosts"
                    ? "Your posts will appear here."
                    : "Be the first to share something!"}
              </Typography>
            </Box>
          )}
          {activeView === "saved" && savedPostsHasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <Button
                variant="outlined"
                disabled={savedPostsLoading}
                onClick={() =>
                  dispatch(
                    getUserBookmarks({ page: savedPostsPage + 1, limit: 20 }),
                  )
                }
              >
                {savedPostsLoading ? "Loading…" : "Load more saved posts"}
              </Button>
            </Box>
          )}
        </Box>
        <Box sx={{ minWidth: 0, alignSelf: "stretch" }}>
          <SuggestedFriends />
        </Box>
      </Box>
    </Box>
  );
}

function FeedPostsSkeleton() {
  return (
    <Box sx={{ display: "grid", gap: 2 }} aria-label="Loading posts">
      {[0, 1].map((item) => (
        <Paper key={item} elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, border: "1px solid #e1e8f1", borderRadius: "18px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Skeleton variant="circular" animation="wave" width={44} height={44} />
            <Box sx={{ flex: 1 }}>
              <Skeleton animation="wave" width="34%" height={20} />
              <Skeleton animation="wave" width="22%" height={16} />
            </Box>
          </Box>
          <Skeleton animation="wave" width="82%" height={20} sx={{ mt: 2 }} />
          {item === 0 && <Skeleton variant="rounded" animation="wave" height={230} sx={{ mt: 1.5, borderRadius: "14px" }} />}
          <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
            <Skeleton animation="wave" width={72} height={24} />
            <Skeleton animation="wave" width={82} height={24} />
            <Skeleton animation="wave" width={70} height={24} />
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

function FeedErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Paper
      elevation={0}
      role="alert"
      sx={{ p: { xs: 3, sm: 4 }, textAlign: "center", border: "1px solid #e1e8f1", borderRadius: "20px", bgcolor: "#fff" }}
    >
      <Box sx={{ width: 54, height: 54, mx: "auto", mb: 1.5, display: "grid", placeItems: "center", borderRadius: "17px", bgcolor: "#fff1f1", color: "#d14343" }}>
        <ErrorOutlineRounded sx={{ fontSize: 28 }} />
      </Box>
      <Typography sx={{ color: "#172033", fontSize: 17, fontWeight: 800 }}>
        Posts couldn’t load
      </Typography>
      <Typography sx={{ mt: 0.5, color: "#71809a", fontSize: 13.5 }}>
        {message}
      </Typography>
      <Button
        variant="contained"
        startIcon={<RefreshRounded />}
        onClick={onRetry}
        sx={{ mt: 2, borderRadius: "11px", fontWeight: 750, textTransform: "none", boxShadow: "none" }}
      >
        Try again
      </Button>
    </Paper>
  );
}
