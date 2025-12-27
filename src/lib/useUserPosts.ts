import { useState, useEffect } from "react";
import axios from "axios";
import { PostData } from "@/app/interfaces/postData";

export default function useUserInfo(id: string) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchPosts() {
    if (!id) return;
    try {
      setLoading(true);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const res = await axios.get(
        `https://linked-posts.routemisr.com/users/${id}/posts?limit=2`,
        { headers: { token: token || "" } }
      );
      setPosts(res.data.posts || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchPosts();
  }, [id]);

  return { posts, loading, error };
}
