const API_BASE = "http://localhost:8000";

//“cliente” HTTP que siempre envía el token si existe
export async function apiFetch(input: string, init: RequestInit = {}) {
  const token = localStorage.getItem("accessToken");

  const headers: HeadersInit = {
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE}${input}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    console.error("API error", res.status, await res.text());
  }

  return res;
}
