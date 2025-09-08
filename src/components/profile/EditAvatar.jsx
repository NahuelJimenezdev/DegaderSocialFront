import { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';

function EditAvatar({ onUpdate }) {
  const { updateProfile } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setMessage('');

    if (!file) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }

    setAvatarFile(file);

    // Crear preview inmediato
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleUpload = async () => {
    if (!avatarFile) return;

    setIsUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('avatar', avatarFile);

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

        if (onUpdate) {
          onUpdate({ foto: data.usuario.foto });
        }

        setMessage('✅ Avatar actualizado exitosamente');
        setAvatarFile(null);
        setAvatarPreview(null);
      } else {
        setMessage('❌ Error al actualizar el avatar');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error al actualizar el avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="form-label">
        Cambiar foto de perfil:
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="form-control mb-3"
      />

      {avatarPreview && (
        <div className="mb-3">
          <p><strong>Vista previa:</strong></p>
          <img
            src={avatarPreview}
            alt="Vista previa del avatar"
            style={{
              width: '150px',
              height: '150px',
              objectFit: 'cover',
              border: '2px solid #ddd',
              borderRadius: '50%'
            }}
          />
        </div>
      )}

      {avatarFile && (
        <div className="mb-3">
          <p>Archivo: <strong>{avatarFile.name}</strong></p>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="btn btn-primary"
          >
            {isUploading ? 'Subiendo...' : 'Subir Avatar'}
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

export { EditAvatar };