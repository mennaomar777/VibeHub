"use client";

import Post from "@/app/_components/Post/Post";
import Loading from "@/app/loading";
import { getSinglePost } from "@/lib/postSlice";
import { getAllComments, setCurrentCommentsPostId } from "@/lib/commentsSlice";
import { dispatchType, stateType } from "@/lib/store";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineRounded from "@mui/icons-material/ErrorOutlineRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function SinglePost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const dispatch = useDispatch<dispatchType>();
  const router = useRouter();

  const { singlePost, isLoading, isError, error } = useSelector(
    (state: stateType) => state.post,
  );

  const { allComments, commentsFetchLoading: areCommentsLoading } = useSelector(
    (state: stateType) => state.comments,
  );

  const { id } = React.use(params);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { userData } = useSelector((state: stateType) => state.profile);

  function retryPostLoad() {
    dispatch(getSinglePost(id));
    dispatch(getAllComments({ postId: id, page: 1, limit: 10 }));
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        const decoded: any = jwtDecode(token);
        setCurrentUserId(decoded.user);
      }
    }
  }, []);

  useEffect(() => {
    dispatch(getSinglePost(id));
    dispatch(setCurrentCommentsPostId(id));
    dispatch(getAllComments({ postId: id, page: 1, limit: 10 }));
  }, [dispatch, id]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 84px)",
          display: "grid",
          placeItems: "center",
          bgcolor: "var(--app-bg)",
          px: 2,
          py: 5,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            role="alert"
            sx={{
              p: { xs: 3, sm: 4 },
              textAlign: "center",
              border: "1px solid var(--border)",
              borderRadius: "22px",
              bgcolor: "var(--surface)",
              boxShadow: "0 8px 24px rgb(24 34 55 / 0.07)",
            }}
          >
            <Box
              sx={{
                width: 58,
                height: 58,
                mx: "auto",
                mb: 1.75,
                display: "grid",
                placeItems: "center",
                borderRadius: "18px",
                bgcolor: "var(--danger-soft)",
                color: "var(--danger-text)",
              }}
            >
              <ErrorOutlineRounded sx={{ fontSize: 30 }} />
            </Box>

            <Typography
              component="h1"
              sx={{
                color: "var(--text-primary)",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              This post couldn’t load
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                color: "var(--text-muted)",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {error || "Please check your connection and try again."}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 1,
                mt: 2.5,
              }}
            >
              <Button
                variant="contained"
                startIcon={<RefreshRounded />}
                onClick={retryPostLoad}
                sx={{
                  borderRadius: "12px",
                  px: 2,
                  py: 1,
                  bgcolor: "var(--accent-strong)",
                  color: "#fff",
                  fontWeight: 750,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "var(--accent-strong)",
                    filter: "brightness(0.92)",
                    boxShadow: "none",
                  },
                  "html[data-theme='dark'] &": {
                    color: "#172033",
                  },
                }}
              >
                Try again
              </Button>

              <Button
                startIcon={<HomeRounded />}
                onClick={() => router.push("/feed")}
                sx={{
                  borderRadius: "12px",
                  px: 2,
                  py: 1,
                  color: "var(--text-secondary)",
                  fontWeight: 750,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "var(--surface-hover)",
                  },
                }}
              >
                Back to feed
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (!singlePost) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 84px)",
          display: "grid",
          placeItems: "center",
          bgcolor: "var(--app-bg)",
          px: 2,
          py: 5,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              textAlign: "center",
              border: "1px solid var(--border)",
              borderRadius: "22px",
              bgcolor: "var(--surface)",
            }}
          >
            <Typography
              component="h1"
              sx={{
                color: "var(--text-primary)",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              Post not found
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                color: "var(--text-muted)",
                fontSize: 14,
              }}
            >
              This post may have been deleted or is no longer available.
            </Typography>

            <Button
              startIcon={<HomeRounded />}
              onClick={() => router.push("/feed")}
              sx={{
                mt: 2,
                color: "var(--text-secondary)",
                fontWeight: 750,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "var(--surface-hover)",
                },
              }}
            >
              Back to feed
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 84px)",
        bgcolor: "var(--app-bg)",
        py: { xs: 2.5, md: 3.5 },
      }}
    >
      <Container maxWidth="md" sx={{ maxWidth: "800px !important" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{
            mb: 2,
            minHeight: 42,
            px: 2,
            border: "1px solid var(--border)",
            borderRadius: "12px",
            bgcolor: "var(--surface)",
            color: "var(--text-primary)",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              bgcolor: "var(--surface-subtle)",
            },
          }}
        >
          Back
        </Button>

        <Post
          key={singlePost._id}
          postdata={{
            ...singlePost,
            comments: allComments || singlePost.comments || [],
          }}
          currentUserId={currentUserId}
          showAllComments={true}
          commentsLoading={areCommentsLoading}
          currentUserPhoto={userData?.photo || ""}
          currentUserName={userData?.name || ""}
        />
      </Container>
    </Box>
  );
}
