"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, csrf } from "@/lib/api";
import useRequireAuth from "@/lib/useRequireAuth";

export default function NewPostPage() {
  const router = useRouter();
  const authLoading = useRequireAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await csrf();
      const post = await apiFetch(`/api/posts`, {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });
      router.push(`/posts/${post.id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return <div className="loading loading-spinner" />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">New Post</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="input input-bordered w-full" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <textarea className="textarea textarea-bordered w-full min-h-40" placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} required />
        {error && <div className="alert alert-error text-sm">{error}</div>}
        <button className="btn btn-primary" disabled={loading}>{loading?"Saving...":"Create"}</button>
      </form>
    </div>
  );
}
