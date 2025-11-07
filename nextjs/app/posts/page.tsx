"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import useRequireAuth from "@/lib/useRequireAuth";

type Post = { id: number; title: string; content: string; user?: { id: number; name: string } };

type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
};

export default function PostsPage() {
  const authLoading = useRequireAuth();
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Paginated<Post> | null>(null);

  async function load(p = page) {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/posts?per_page=${perPage}&page=${p}`);
      setResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(page); /* eslint-disable-next-line */ }, [page]);

  if (authLoading) return <div className="loading loading-spinner" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link href="/posts/new" className="btn btn-primary">New Post</Link>
      </div>

      {loading && <div className="loading loading-spinner" />}
      {error && <div className="alert alert-error text-sm mb-3">{error}</div>}

      <div className="grid gap-3">
        {result?.data?.map((p) => (
          <div key={p.id} className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">
                <Link href={`/posts/${p.id}`}>{p.title}</Link>
              </h2>
              <p className="line-clamp-2">{p.content}</p>
              <div className="card-actions justify-end">
                <Link href={`/posts/${p.id}/edit`} className="btn btn-sm">Edit</Link>
                <Link href={`/posts/${p.id}`} className="btn btn-sm btn-outline">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {result && (
        <div className="join mt-6">
          <button className="join-item btn" disabled={page<=1} onClick={()=>setPage((p)=>p-1)}>«</button>
          <button className="join-item btn">Page {result.current_page} / {result.last_page}</button>
          <button className="join-item btn" disabled={page>=result.last_page} onClick={()=>setPage((p)=>p+1)}>»</button>
        </div>
      )}
    </div>
  );
}
