// src/components/profile/EditAvatar.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api.js";
import { API_CONFIG, buildApiUrl } from "../../lib/config.js";

const ALLOWED = API_CONFIG.UPLOAD.ALLOWED_TYPES;
const SERVER_LIMIT_MB = API_CONFIG.UPLOAD.MAX_SIZE_MB;
const SERVER_LIMIT_BYTES = API_CONFIG.UPLOAD.MAX_SIZE_BYTES;
const MAX_SIDE = API_CONFIG.UPLOAD.MAX_SIDE_PX;

// Helpers de compresión (sin librerías externas)
async function loadBitmapOrImage(file) {
  if (window.createImageBitmap) {
    const bmp = await createImageBitmap(file);
    return {
      width: bmp.width,
      height: bmp.height,
      draw: (ctx, w, h) => ctx.drawImage(bmp, 0, 0, w, h),
      close: () => bmp.close?.(),
    };
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    return {
      width: img.width,
      height: img.height,
      draw: (ctx, w, h) => ctx.drawImage(img, 0, 0, w, h),
      close: () => URL.revokeObjectURL(url),
    };
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
}

async function toWebPBlob(canvas, quality) {
  if (canvas.convertToBlob) {
    return await canvas.convertToBlob({ type: "image/webp", quality });
  }
  return await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
}

async function compressImage(file, { maxSide = MAX_SIDE, qualities = [0.82, 0.7] } = {}) {
  const img = await loadBitmapOrImage(file);
  try {
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const outW = Math.max(1, Math.round(img.width * scale));
    const outH = Math.max(1, Math.round(img.height * scale));

    const canvas =
      typeof OffscreenCanvas !== "undefined"
        ? new OffscreenCanvas(outW, outH)
        : Object.assign(document.createElement("canvas"), { width: outW, height: outH });

    const ctx = canvas.getContext("2d");
    img.draw(ctx, outW, outH);

    for (const q of qualities) {
      const blob = await toWebPBlob(canvas, q);
      if (blob && blob.size > 0) {
        const webpFile = new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
          type: "image/webp",
          lastModified: Date.now(),
        });
        // Si ya cabe en el límite del servidor, devolvemos
        if (webpFile.size <= SERVER_LIMIT_BYTES) return webpFile;
        // Sino seguimos con menor calidad; si es el último intento, devolvemos igual
        if (q === qualities[qualities.length - 1]) return webpFile;
      }
    }
    return file; // fallback
  } finally {
    img.close?.();
  }
}

export function EditAvatar({ currentAvatar, onSaved, onUserUpdate }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onFileChange = (e) => {
    setErr("");
    const f = e.target.files?.[0];
    if (!f) {
      setFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
      return;
    }
    if (!ALLOWED.includes(f.type)) {
      setErr("Formato no permitido. Usa JPG, JPEG, PNG, WEBP o AVIF.");
      e.target.value = "";
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
    setFile(f);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErr("Selecciona una imagen primero.");
      return;
    }
    setUploading(true);
    setErr("");
    try {
      // Comprimir siempre a WebP razonable para evitar 413 y acelerar subida
      let toSend = await compressImage(file, { maxSide: MAX_SIDE, qualities: [0.82, 0.7] });

      // Chequeo final contra límite del servidor
      if (toSend.size > SERVER_LIMIT_BYTES) {
        setErr(
          `La imagen sigue siendo muy grande (${(toSend.size / 1024 / 1024).toFixed(
            1
          )}MB). Reduce resolución o peso por debajo de ${SERVER_LIMIT_MB}MB.`
        );
        setUploading(false);
        return;
      }

      const fd = new FormData();
      fd.append("avatar", toSend);

      console.log("Enviando imagen:", {
        fileName: toSend.name,
        fileSize: `${(toSend.size / 1024 / 1024).toFixed(2)}MB`,
        fileType: toSend.type
      });

      const { data } = await apiFetch(buildApiUrl(API_CONFIG.ENDPOINTS.AVATAR), {
        method: "POST",
        body: fd,
      });

      console.log("Respuesta del servidor:", data);

      // Debug adicional para la URL de la imagen
      console.log("Usuario actualizado:", data.usuario);
      console.log("URL de la imagen:", data.usuario.fotoPerfil);
      console.log("Campo fotoPerfil:", data.usuario.fotoPerfil);
      console.log("Campo avatar_url:", data.usuario.avatar_url);
      console.log("Todos los campos del usuario:", Object.keys(data.usuario));

      // Actualizar el estado del usuario en el componente padre
      if (onUserUpdate) {
        onUserUpdate(data.usuario);
      }

      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
      setFile(null);
      onSaved?.(data.usuario);
    } catch (e) {
      console.error("Error al subir avatar:", e);
      let errorMessage = e.message || "Error subiendo avatar";

      // Mensajes de error más específicos
      if (e.message?.includes("413")) {
        errorMessage = "La imagen es demasiado grande. Reduce el tamaño o la resolución.";
      } else if (e.message?.includes("401")) {
        errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
      } else if (e.message?.includes("500")) {
        errorMessage = "Error del servidor. Intenta más tarde.";
      } else if (e.message?.includes("fetch")) {
        errorMessage = "Error de conexión. Verifica que el servidor esté funcionando.";
      }

      setErr(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async () => {
    setRemoving(true);
    setErr("");
    try {
      const { data } = await apiFetch(buildApiUrl(API_CONFIG.ENDPOINTS.AVATAR), {
        method: "DELETE",
      });
      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
      setFile(null);

      // Actualizar el estado del usuario en el componente padre
      if (onUserUpdate) {
        onUserUpdate(data.usuario);
      }

      onSaved?.(data.usuario);
    } catch (e) {
      console.error("Error al eliminar avatar:", e);
      let errorMessage = e.message || "Error eliminando avatar";

      // Mensajes de error más específicos
      if (e.message?.includes("401")) {
        errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
      } else if (e.message?.includes("500")) {
        errorMessage = "Error del servidor. Intenta más tarde.";
      } else if (e.message?.includes("fetch")) {
        errorMessage = "Error de conexión. Verifica que el servidor esté funcionando.";
      }

      setErr(errorMessage);
    } finally {
      setRemoving(false);
    }
  };

  // Construir la URL completa para mostrar la imagen actual
  const fullCurrentAvatar = currentAvatar ? `http://localhost:3001${currentAvatar}?t=${Date.now()}` : "";
  const showing = preview || fullCurrentAvatar;

  return (
    <form onSubmit={onSubmit} className="d-grid gap-3">
      <div className="d-flex align-items-center gap-3">
        <div
          className="rounded-circle overflow-hidden border"
          style={{ width: 112, height: 112, background: "#f3f4f6" }}
        >
          {showing ? (
            <img
              src={showing}
              alt="avatar preview"
              className="w-100 h-100 object-fit-cover"
              onError={(e) => {
                console.error('Error loading image:', e);
                e.target.style.display = 'none';
                // Busca el fallback de manera segura
                const container = e.target.parentElement;
                const fallback = container.querySelector('.avatar-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : (
              <div className="avatar-fallback w-100 h-100 d-flex align-items-center justify-content-center text-secondary">
              Sin avatar
            </div>
          )}
        </div>

        <div className="flex-grow-1">
          <input
            type="file"
            accept={ALLOWED.join(",")}
            onChange={onFileChange}
            className="form-control"
          />
          <small className="text-secondary d-block mt-1">
            Formatos: JPG, JPEG, PNG, WEBP o AVIF. Máx {SERVER_LIMIT_MB} MB (servidor). Se
            optimiza a WebP y se recorta a 256×256 en el servidor.
          </small>
          {err && <small className="text-danger d-block mt-1">{err}</small>}
        </div>
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary" disabled={!file || uploading}>
          {uploading ? "Subiendo..." : "Subir avatar"}
        </button>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={onDelete}
          disabled={removing}
        >
          {removing ? "Eliminando..." : "Eliminar avatar"}
        </button>
      </div>
    </form>
  );
}
