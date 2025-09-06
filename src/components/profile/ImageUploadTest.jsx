// Componente de prueba para verificar la carga de imágenes
import { useState } from "react";
import { apiFetch } from "../../lib/api.js";
import { API_CONFIG, buildApiUrl } from "../../lib/config.js";

export function ImageUploadTest() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError("");
      setResult("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Selecciona un archivo primero");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      console.log("Archivo a enviar:", {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        type: file.type
      });

      const response = await apiFetch(buildApiUrl(API_CONFIG.ENDPOINTS.AVATAR), {
        method: "POST",
        body: formData,
      });

      console.log("Respuesta exitosa:", response);
      setResult("¡Imagen subida exitosamente!");

      // Limpiar después de éxito
      setFile(null);
      setPreview("");
      if (preview) URL.revokeObjectURL(preview);

    } catch (err) {
      console.error("Error en la carga:", err);
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await apiFetch(buildApiUrl(API_CONFIG.ENDPOINTS.ME), {
        method: "GET",
      });

      console.log("Conexión exitosa:", response);
      setResult("Conexión al servidor exitosa");

    } catch (err) {
      console.error("Error de conexión:", err);
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h4>Prueba de Carga de Imágenes</h4>

      <div className="mb-3">
        <button
          className="btn btn-secondary me-2"
          onClick={handleTestConnection}
          disabled={loading}
        >
          {loading ? "Probando..." : "Probar Conexión"}
        </button>
      </div>

      <div className="mb-3">
        <input
          type="file"
          accept={API_CONFIG.UPLOAD.ALLOWED_TYPES.join(",")}
          onChange={handleFileChange}
          className="form-control"
        />
        <small className="text-muted">
          Formatos permitidos: {API_CONFIG.UPLOAD.ALLOWED_TYPES.join(", ")}
          <br />
          Tamaño máximo: {API_CONFIG.UPLOAD.MAX_SIZE_MB}MB
        </small>
      </div>

      {preview && (
        <div className="mb-3">
          <img
            src={preview}
            alt="Preview"
            className="img-thumbnail"
            style={{ maxWidth: "200px", maxHeight: "200px" }}
          />
        </div>
      )}

      <div className="mb-3">
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? "Subiendo..." : "Subir Imagen"}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="alert alert-success">
          <strong>Éxito:</strong> {result}
        </div>
      )}

      <div className="mt-3">
        <h6>Información de Debug:</h6>
        <ul className="list-unstyled">
          <li><strong>URL del servidor:</strong> {API_CONFIG.BASE_URL}</li>
          <li><strong>Endpoint de avatar:</strong> {API_CONFIG.ENDPOINTS.AVATAR}</li>
          <li><strong>Token disponible:</strong> {localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY) ? "Sí" : "No"}</li>
        </ul>
      </div>
    </div>
  );
}
