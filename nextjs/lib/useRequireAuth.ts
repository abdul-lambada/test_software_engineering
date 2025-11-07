"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function useRequireAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      setLoading(true);
      try {
        await apiFetch("/api/user");
        if (mounted) setLoading(false);
      } catch {
        const next = typeof window !== "undefined" ? window.location.pathname : "/";
        router.push(`/auth/sign-in?next=${encodeURIComponent(next)}`);
      }
    }
    check();
    return () => { mounted = false; };
  }, [router]);

  return loading;
}
