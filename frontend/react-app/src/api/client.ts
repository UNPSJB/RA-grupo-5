const API_BASE = "http://localhost:8000";
//pequeño “cliente” HTTP que siempre envíe ese header
export async function apiFetch(input: string, init: RequestInit = {}) {
  const personaId = localStorage.getItem("personaId") ?? "1"; // dev: por defecto docente

  const headers = {
    ...(init.headers || {}),
    "X-Persona-Id": personaId,
  };

  const res = await fetch(`${API_BASE}${input}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    // acá podés loguear 401/403, etc.
    console.error("API error", res.status, await res.text());
  }

  return res;
}
