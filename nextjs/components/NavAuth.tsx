"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, csrf } from "@/lib/api";

type User = { id: number; name: string; email: string } | null;

export default function NavAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const me = await apiFetch("/api/user");
        if (mounted) setUser(me);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function onSignOut() {
    try {
      setSigningOut(true);
      await csrf();
      await apiFetch("/api/logout", { method: "POST" });
      setUser(null);
      router.push("/auth/sign-in");
    } catch (e) {
      // ignore
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="navbar-end flex items-center gap-4 pr-4">
      <Link href="/posts" className="btn btn-sm">Posts</Link>
      {loading ? null : user ? (
        <button className="btn btn-sm btn-outline" onClick={onSignOut} disabled={signingOut}>
          {signingOut ? "Signing out..." : "Sign Out"}
        </button>
      ) : (
        <>
          <Link href="/auth/sign-in" className="btn btn-sm btn-outline">Sign In</Link>
          <Link href="/auth/sign-up" className="btn btn-sm btn-primary">Sign Up</Link>
        </>
      )}
    </div>
  );
}
