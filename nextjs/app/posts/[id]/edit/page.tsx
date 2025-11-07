"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, csrf } from "@/lib/api";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/posts/${id}`);
      setTitle(res.title);
      setContent(res.content);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (id) load(); /* eslint-disable-next-line */ }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      setSaving(true);
      await csrf();
      await apiFetch(`/api/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, content })
      });
      router.replace(`/posts/${id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Post</h1>
      {loading && <div className="loading loading-spinner" />}
      {error && <div className="alert alert-error text-sm">{error}</div>}
      {!loading && (
        <form className="space-y-3" onSubmit={onSubmit}>
          <input className="input input-bordered w-full" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
          <textarea className="textarea textarea-bordered w-full min-h-40" placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} required />
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}
    </div>
  );
}
