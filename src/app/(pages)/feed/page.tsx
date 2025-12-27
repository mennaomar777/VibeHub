"use client";
import React, { useEffect, useState } from "react";
import { Box, Container, CircularProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { dispatchType, stateType } from "@/lib/store";
import { getAllPosts } from "@/lib/postSlice";
import { PostData } from "../../../app/interfaces/postData";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Post from "@/app/_components/Post/page";
import CreatePost from "@/app/_components/CreatePost/CreatePost";

export default function Home() {
  const { allPost, isLoading } = useSelector((state: stateType) => state.post);
  const dispatch = useDispatch<dispatchType>();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const decoded: any = jwtDecode(token);
      setCurrentUserId(decoded.user);

      dispatch(getAllPosts());
    }
  }, [dispatch, router]);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 4 } }}>
      {/* Create Post Card */}
      <Box sx={{ mb: 5 }}>
        <CreatePost />
      </Box>

      {/* Posts Feed */}
      <Box>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
            <CircularProgress color="primary" size={60} thickness={5} />
          </Box>
        ) : allPost && allPost.length > 0 ? (
          allPost.map((post: PostData) => (
            <Box key={post._id} sx={{ mb: 5 }}>
              <Post
                postdata={post}
                currentUserId={currentUserId}
                showAllComments={false}
              />
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography variant="h6" color="text.secondary">
              No posts yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Be the first to share something!
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}
