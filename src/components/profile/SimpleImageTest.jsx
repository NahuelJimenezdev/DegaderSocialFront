// Componente simple para probar la carga de imágenes
import { useState } from "react";

export function SimpleImageTest({ imageUrl }) {
  const [imageStatus, setImageStatus] = useState("loading");
  const [error, setError] = useState(null);

  const fullUrl = imageUrl ? `http://localhost:3001${imageUrl}` : "";

  const handleImageLoad = () => {
    setImageStatus("loaded");
    setError(null);
  };

  const handleImageError = () => {
    setImageStatus("error");
    setError("Error al cargar la imagen");
  };

  if (!imageUrl) {
    return (
      <div className="alert alert-warning">
        No hay imagen para mostrar
      </div>
    );
  }

  return (
    <div className="card p-3">
      <h6>🧪 Prueba Simple de Imagen</h6>

      <div className="mb-2">
        <strong>URL relativa:</strong> {imageUrl}<br />
        <strong>URL completa:</strong> {fullUrl}<br />
        <strong>Estado:</strong>
        <span className={`badge ms-2 ${imageStatus === "loaded" ? "bg-success" :
          imageStatus === "error" ? "bg-danger" :
            "bg-secondary"
          }`}>
          {imageStatus === "loaded" ? "✅ Cargada" :
            imageStatus === "error" ? "❌ Error" :
              "⏳ Cargando..."}
        </span>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="text-center">
        <img
          src={fullUrl}
          alt="Test de imagen"
          className="img-thumbnail"
          style={{ maxWidth: "200px", maxHeight: "200px" }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      <div className="mt-2">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => window.open(fullUrl, '_blank')}
        >
          🔗 Abrir en nueva pestaña
        </button>
      </div>
    </div>
  );
}
