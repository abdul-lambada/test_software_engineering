"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, csrf } from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await csrf();
      await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.push("/posts");
    } catch (e: any) {
      setError(e.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <input className="input input-bordered w-full" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input input-bordered w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {error && <div className="alert alert-error text-sm">{error}</div>}
        <button className="btn btn-primary w-full" disabled={loading}>{loading?"Signing in...":"Sign In"}</button>
      </form>
      <div className="mt-3 text-sm">
        Belum punya akun? <a className="link" href="/auth/sign-up">Sign Up</a>
      </div>
    </div>
  );
}
