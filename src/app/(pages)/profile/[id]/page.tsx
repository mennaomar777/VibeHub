"use client";

import Post from "@/app/_components/Post/page";
import useUserInfo from "@/lib/useUserPosts";
import {
  Box,
  Container,
  Avatar,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { dispatchType, stateType } from "@/lib/store";
import ProfilePhoto from "@/app/_components/ProfilePhoto/ProfilePhoto";
import { getUserData } from "@/lib/profileSlice";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [tab, setTab] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);

  const { posts, loading, error } = useUserInfo(id);
  const { userData } = useSelector((state: stateType) => state.profile);
  const dispatch = useDispatch<dispatchType>();

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
    if (currentUserId) {
      dispatch(getUserData());
    }
  }, [currentUserId, dispatch]);

  if (loading || !currentUserId) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress color="primary" size={60} thickness={5} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Oops! Something went wrong
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      {/* Cover */}
      <Box
        sx={{
          height: { xs: 180, sm: 240 },
          bgcolor: "#e0e7ff",
          borderRadius: 2,
          mb: { xs: 6, sm: 8 },
          mt: { xs: 3, sm: 4 },
          position: "relative",
        }}
      >
        {/* Avatar */}
        <Avatar
          src={
            uploadedPhotoUrl ||
            userData.photo ||
            "https://via.placeholder.com/150"
          }
          sx={{
            width: 120,
            height: 120,
            position: "absolute",
            bottom: -60,
            left: 24,
            border: "4px solid white",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: -40,
            left: 110,
            width: 100,
            height: 100,
          }}
        >
          <ProfilePhoto />
        </Box>
      </Box>

      {/* Profile Info */}
      <Box sx={{ mt: { xs: 8, sm: 10 }, ml: { xs: 2, sm: 0 } }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          {userData.name}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {userData.email}
        </Typography>

        <Divider sx={{ my: 4 }} />
      </Box>

      {/* Tabs */}
      <Box sx={{ mt: 4 }}>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
          <Tab label="Posts" />
          <Tab label="About" />
        </Tabs>

        <Box>
          {tab === 0 && (
            <>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Box key={post._id} sx={{ mb: 4 }}>
                    <Post
                      postdata={post}
                      currentUserId={currentUserId}
                      showAllComments={false}
                    />
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No posts yet.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Share your first post!
                  </Typography>
                </Box>
              )}
            </>
          )}

          {tab === 1 && (
            <Box sx={{ py: 6 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  <strong>Name:</strong> {userData.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Email:</strong> {userData.email}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Date of Birth:</strong> {userData.dateOfBirth}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Gender:</strong> {userData.gender}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Member Since:</strong>{" "}
                  {new Date(userData.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}
