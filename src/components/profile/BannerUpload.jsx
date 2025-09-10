// BannerUpload.jsx - Componente para subir banner
import { useState } from "react";
import { useProfile } from "../../context/AuthContext";

export default function BannerUpload() {
  const { updateProfile } = useProfile();
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBannerFile(file);
    setMessage('');

    if (file) {
      // Crear preview inmediato
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);
    } else {
      setBannerPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!bannerFile) return;

    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append("banner", bannerFile);

    try {
      const response = await fetch('http://localhost:3001/api/me/banner', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();

        // Actualizar estado global inmediatamente
        updateProfile(data.usuario);

        setMessage('✅ Banner actualizado exitosamente');
        setBannerFile(null);
        setBannerPreview(null);
      } else {
        setMessage('❌ Error al subir banner');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error de conexión');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="form-control mb-3"
      />

      {bannerPreview && (
        <div className="mb-3">
          <p><strong>Vista previa:</strong></p>
          <img
            src={bannerPreview}
            alt="Vista previa del banner"
            style={{
              width: '100%',
              maxHeight: '200px',
              objectFit: 'cover',
              border: '2px solid #ddd',
              borderRadius: '8px'
            }}
          />
        </div>
      )}

      {bannerFile && (
        <div className="mb-3">
          <p>Archivo: <strong>{bannerFile.name}</strong></p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn btn-primary"
          >
            {uploading ? 'Subiendo...' : 'Subir Banner'}
          </button>
        </div>
      )}

      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} mt-3`}>
          {message}
        </div>
      )}
    </div>
  );
}
