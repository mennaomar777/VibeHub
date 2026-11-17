import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { PostData } from "@/app/interfaces/postData";

export default function useUserInfo(
  id: string,
  enabled = true,
  limit = 2,
) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!id || !enabled) return;
    try {
      setError(null);
      setLoading(true);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const res = await axios.get(
        `https://route-posts.routemisr.com/users/${id}/posts?limit=${limit}`,
        { headers: { Authorization: `Bearer ${token || ""}` } }
      );
      setPosts(res.data.data?.posts ?? res.data.posts ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [id, enabled, limit]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}
