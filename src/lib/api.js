import { API_CONFIG } from "./config.js";

// Función mejorada para hacer peticiones a la API
export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY);
  const headers = new Headers(opts.headers || {});

  // Solo establecer Content-Type si no se está enviando FormData
  if (!(opts.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `${API_CONFIG.AUTH.TOKEN_PREFIX} ${token}`);
  }

  try {
    const res = await fetch(path, { ...opts, headers, credentials: "include" });

    // Si la respuesta no es JSON (como en algunos errores), manejarlo apropiadamente
    let data;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = { msg: `Respuesta no válida del servidor (${res.status})` };
    }

    if (!res.ok) {
      const msg = data?.msg || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(msg);
    }

    return { data, res };
  } catch (error) {
    // Si es un error de red, dar un mensaje más claro
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Error de conexión. Verifica que el servidor esté funcionando.");
    }
    throw error;
  }
}
