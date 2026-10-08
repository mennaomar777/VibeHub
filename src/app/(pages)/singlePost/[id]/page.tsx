"use client";
import Post from "@/app/_components/Post/page";
import Loading from "@/app/loading";
import { getSinglePost } from "@/lib/postSlice";
import {
  getAllComments,
  setCurrentCommentsPostId,
} from "@/lib/commentsSlice";
import { dispatchType, stateType } from "@/lib/store";
import { Container, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SinglePost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const dispatch = useDispatch<dispatchType>();
  const { singlePost, isLoading } = useSelector(
    (state: stateType) => state.post
  );
  const { allComments } = useSelector((state: stateType) => state.comments);

  const { id } = React.use(params);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { userData } = useSelector((state: stateType) => state.profile);

  if (userData._id !== "") {
    console.log(userData.photo);
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
    dispatch(getAllComments(id));
  }, [dispatch, id]);

  if (isLoading) {
    return <Loading />;
  }

  if (!singlePost) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Post not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Post
        key={singlePost._id}
        postdata={{
          ...singlePost,
          comments: allComments || singlePost.comments || [],
        }}
        currentUserId={currentUserId}
        showAllComments={true}
        currentUserPhoto={userData?.photo || ""}
      />
    </Container>
  );
}
