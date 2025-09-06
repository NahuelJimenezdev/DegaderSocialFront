// Componente de debug para diagnosticar problemas con imágenes
import { useState, useEffect } from "react";

export function ImageDebugger({ user }) {
  const [imageStatus, setImageStatus] = useState("loading");
  const [imageError, setImageError] = useState(null);
  const [imageInfo, setImageInfo] = useState({});

  useEffect(() => {
    if (!user) return;

    // Obtener la URL de la imagen del usuario
    const imageUrl = user.fotoPerfil || user.avatar_url || "";
    const fullImageUrl = imageUrl ? `http://localhost:3001${imageUrl}` : "";

    if (!imageUrl) {
      setImageStatus("no-image");
      return;
    }

    setImageStatus("checking");

    // Crear una imagen temporal para verificar si se puede cargar
    const img = new Image();

    img.onload = () => {
      setImageStatus("loaded");
      setImageInfo({
        width: img.width,
        height: img.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
        src: img.src
      });
    };

    img.onerror = (error) => {
      setImageStatus("error");
      setImageError({
        message: "Error al cargar la imagen",
        error: error,
        url: fullImageUrl
      });
    };

    img.src = fullImageUrl;
  }, [user]);

  if (!user) {
    return <div className="alert alert-warning">No hay usuario para debuggear</div>;
  }

  const imageUrl = user.fotoPerfil || user.avatar_url || "";
  const fullImageUrl = imageUrl ? `http://localhost:3001${imageUrl}` : "";

  return (
    <div className="card p-4 mb-3">
      <h5>🔍 Debug de Imagen</h5>

      <div className="row">
        <div className="col-md-6">
          <h6>Información del Usuario</h6>
          <ul className="list-unstyled">
            <li><strong>ID:</strong> {user._id}</li>
            <li><strong>Nombre:</strong> {user.primernombreUsuario} {user.primerapellidoUsuario}</li>
            <li><strong>fotoPerfil:</strong> {user.fotoPerfil || "No definido"}</li>
            <li><strong>avatar_url:</strong> {user.avatar_url || "No definido"}</li>
            <li><strong>URL de imagen:</strong> {imageUrl || "No hay imagen"}</li>
          </ul>
        </div>

        <div className="col-md-6">
          <h6>Estado de la Imagen</h6>
          <div className="mb-2">
            <span className={`badge ${imageStatus === "loaded" ? "bg-success" :
              imageStatus === "error" ? "bg-danger" :
                imageStatus === "no-image" ? "bg-warning" :
                  "bg-secondary"
              }`}>
              {imageStatus === "loaded" ? "✅ Cargada" :
                imageStatus === "error" ? "❌ Error" :
                  imageStatus === "no-image" ? "⚠️ Sin imagen" :
                    "⏳ Verificando..."}
            </span>
          </div>

          {imageStatus === "loaded" && (
            <ul className="list-unstyled">
              <li><strong>Dimensiones:</strong> {imageInfo.width} × {imageInfo.height}</li>
              <li><strong>Natural:</strong> {imageInfo.naturalWidth} × {imageInfo.naturalHeight}</li>
              <li><strong>Completa:</strong> {imageInfo.complete ? "Sí" : "No"}</li>
            </ul>
          )}

          {imageStatus === "error" && (
            <div className="alert alert-danger">
              <strong>Error:</strong> {imageError?.message}<br />
              <strong>URL:</strong> {imageError?.url}<br />
              <small>Verifica que la URL sea correcta y accesible</small>
            </div>
          )}
        </div>
      </div>

      {fullImageUrl && (
        <div className="mt-3">
          <h6>Vista Previa de la Imagen</h6>
          <div className="d-flex gap-3">
            <div>
              <strong>Vista pequeña (64x64):</strong>
              <div className="mt-2">
                <img
                  src={fullImageUrl}
                  alt="Avatar pequeño"
                  className="img-thumbnail"
                  style={{ width: "64px", height: "64px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <div className="d-none text-center text-muted" style={{ width: "64px", height: "64px", border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ❌
                </div>
              </div>
            </div>

            <div>
              <strong>Vista normal (128x128):</strong>
              <div className="mt-2">
                <img
                  src={fullImageUrl}
                  alt="Avatar normal"
                  className="img-thumbnail"
                  style={{ width: "128px", height: "128px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <div className="d-none text-center text-muted" style={{ width: "128px", height: "128px", border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ❌
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3">
        <h6>Pruebas de Acceso</h6>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => {
              if (fullImageUrl) {
                window.open(fullImageUrl, '_blank');
              }
            }}
            disabled={!fullImageUrl}
          >
            🔗 Abrir en nueva pestaña
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              if (fullImageUrl) {
                navigator.clipboard.writeText(fullImageUrl);
                alert("URL copiada al portapapeles");
              }
            }}
            disabled={!fullImageUrl}
          >
            📋 Copiar URL
          </button>
        </div>
      </div>
    </div>
  );
}
