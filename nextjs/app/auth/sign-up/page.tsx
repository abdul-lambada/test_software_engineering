"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, csrf } from "@/lib/api";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await csrf();
      await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, password_confirmation }),
      });
      router.push("/posts");
    } catch (e: any) {
      setError(e.message ?? "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="input input-bordered w-full" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="input input-bordered w-full" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input input-bordered w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <input className="input input-bordered w-full" placeholder="Confirm Password" type="password" value={password_confirmation} onChange={e=>setPasswordConfirmation(e.target.value)} required />
        {error && <div className="alert alert-error text-sm">{error}</div>}
        <button className="btn btn-primary w-full" disabled={loading}>{loading?"Signing up...":"Create Account"}</button>
      </form>
      <div className="mt-3 text-sm">
        Sudah punya akun? <a className="link" href="/auth/sign-in">Sign In</a>
      </div>
    </div>
  );
}
