"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, csrf } from "@/lib/api";

export default function SignOutPage() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        await csrf();
        await apiFetch("/logout", { method: "POST" });
      } catch {}
      router.replace("/auth/sign-in");
    })();
  }, [router]);

  return <div className="text-center">Signing out...</div>;
}
