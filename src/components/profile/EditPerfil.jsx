// EditPerfil.jsx - Componente para subir foto de perfil
import { useState } from "react";
import { useProfile } from "../../context/ProfileContext";

export default function EditPerfil() {
  const { updateProfile } = useProfile();
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileFile(file);
    setMessage('');

    if (file) {
      // Crear preview inmediato
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
    } else {
      setProfilePreview(null);
    }
  };

  const handleUpload = async () => {
    if (!profileFile) return;

    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append("avatar", profileFile);

    try {
      const response = await fetch('http://localhost:3001/api/me/avatar', {
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

        setMessage('✅ Foto de perfil actualizada exitosamente');
        setProfileFile(null);
        setProfilePreview(null);
      } else {
        setMessage('❌ Error al subir foto de perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error de conexión');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setUploading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/me/avatar', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();

        // Actualizar estado global inmediatamente
        updateProfile(data.usuario);

        setMessage('✅ Foto de perfil eliminada exitosamente');
        setProfileFile(null);
        setProfilePreview(null);
      } else {
        setMessage('❌ Error al eliminar foto de perfil');
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

      {profilePreview && (
        <div className="mb-3">
          <p><strong>Vista previa:</strong></p>
          <img
            src={profilePreview}
            alt="Vista previa de la foto de perfil"
            style={{
              width: '150px',
              height: '150px',
              objectFit: 'cover',
              border: '2px solid #ddd',
              borderRadius: '50%',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </div>
      )}

      <div className="d-flex gap-2 mb-3">
        {profileFile && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn btn-primary"
          >
            {uploading ? 'Subiendo...' : 'Subir Foto'}
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={uploading}
          className="btn btn-outline-danger"
        >
          {uploading ? 'Eliminando...' : 'Eliminar Foto Actual'}
        </button>
      </div>

      {profileFile && (
        <div className="mb-3">
          <p>Archivo: <strong>{profileFile.name}</strong></p>
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
