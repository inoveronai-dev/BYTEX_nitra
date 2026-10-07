"use client";

let csrfToken: string | null = null;

export async function refreshCsrf() {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) {
    csrfToken = null;
    throw new Error("Nie ste prihlásený.");
  }
  const data = (await res.json()) as { csrfToken: string };
  csrfToken = data.csrfToken;
  return csrfToken;
}

export async function adminFetch(input: string, init: RequestInit = {}) {
  if (!csrfToken) await refreshCsrf();

  const headers = new Headers(init.headers);
  if (init.method && init.method !== "GET") {
    headers.set("x-csrf-token", csrfToken || "");
  }
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res = await fetch(input, { ...init, headers, credentials: "include" });

  if (res.status === 403) {
    await refreshCsrf();
    headers.set("x-csrf-token", csrfToken || "");
    res = await fetch(input, { ...init, headers, credentials: "include" });
  }

  return res;
}
