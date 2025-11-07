"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, csrf } from "@/lib/api";

type Post = { id: number; title: string; content: string; user?: { id: number; name: string } };

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/posts/${id}`);
      setPost(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (id) load(); /* eslint-disable-next-line */ }, [id]);

  async function onDelete() {
    if (!confirm("Delete this post?")) return;
    try {
      setDeleting(true);
      await csrf();
      await apiFetch(`/api/posts/${id}`, { method: "DELETE" });
      router.push("/posts");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Post Detail</h1>
        <div className="space-x-2">
          <Link className="btn btn-sm" href={`/posts/${id}/edit`}>Edit</Link>
          <button className="btn btn-sm btn-error" onClick={onDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
      {loading && <div className="loading loading-spinner" />}
      {error && <div className="alert alert-error text-sm mb-3">{error}</div>}
      {post && (
        <div className="prose">
          <h2>{post.title}</h2>
          <p className="whitespace-pre-wrap">{post.content}</p>
          <p className="text-sm opacity-70">By {post.user?.name ?? "Unknown"}</p>
        </div>
      )}
    </div>
  );
}
