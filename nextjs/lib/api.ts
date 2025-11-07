export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function csrf() {
  // Prepare CSRF cookie for Sanctum
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
    headers: { "Accept": "application/json" },
  });
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  // Attach XSRF-TOKEN header for Sanctum
  const token = getCookie("XSRF-TOKEN");
  if (token) headers.set("X-XSRF-TOKEN", token);

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    let detail: any = undefined;
    try { detail = await res.json(); } catch {}
    throw new Error(detail?.message || `Request failed (${res.status})`);
  }
  try { return await res.json(); } catch { return null; }
}
