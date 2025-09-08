// src/components/comments/VideoUploader.jsx
import React, { useState, useRef } from 'react';
import { Video, X, Upload, Play } from 'lucide-react';

const VideoUploader = ({ onVideoSelect, onVideoRemove, selectedVideos = [] }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Tipo de video no permitido. Use: MP4, WEBM, OGG, AVI, MOV');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('El video es demasiado grande. Máximo 50MB');
    }
    return true;
  };

  const createVideoThumbnail = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        canvas.width = 160;
        canvas.height = 90;
        video.currentTime = 1; // Obtener frame del segundo 1
      };

      video.oncanplay = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
        resolve(thumbnail);
      };

      video.onerror = () => {
        reject(new Error('Error al procesar el video'));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const processFiles = async (files) => {
    setUploading(true);
    try {
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        validateFile(file);

        // Crear thumbnail y obtener duración
        const [thumbnail, duration] = await Promise.all([
          createVideoThumbnail(file).catch(() => null),
          getVideoDuration(file).catch(() => 0)
        ]);

        const videoData = {
          file,
          preview: URL.createObjectURL(file),
          thumbnail,
          name: file.name,
          size: file.size,
          duration,
          id: Date.now() + Math.random()
        };

        onVideoSelect(videoData);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files?.length > 0) {
      processFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files?.length > 0) {
      processFiles(files);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)}KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="d-flex flex-column gap-2">
      {/* Botón para seleccionar archivos */}
      <div className="d-flex gap-2 align-items-center flex-wrap">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Subiendo...</span>
              </div>
              <span className="d-none d-sm-inline">Procesando...</span>
            </>
          ) : (
            <>
              <Video size={16} />
              <span className="d-none d-sm-inline">Video</span>
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          multiple
          onChange={handleFileSelect}
          className="d-none"
        />

        <small className="text-muted d-none d-md-block">
          MP4, WEBM, OGG (máx. 50MB)
        </small>
      </div>

      {/* Zona de drop */}
      <div
        className={`border border-2 border-dashed rounded p-2 p-md-3 text-center ${dragOver ? 'border-primary bg-light' : 'border-secondary'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ cursor: 'pointer' }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={20} className="text-muted mb-1 mb-md-2" />
        <div className="text-muted">
          <small className="d-none d-md-block">
            Arrastra videos aquí o haz clic para seleccionar
          </small>
          <small className="d-md-none">
            Toca para seleccionar videos
          </small>
        </div>
      </div>

      {/* Preview de videos seleccionados */}
      {selectedVideos.length > 0 && (
        <div className="d-flex flex-column gap-2">
          {selectedVideos.map((video) => (
            <div key={video.id} className="position-relative border rounded p-2">
              <div className="d-flex align-items-center gap-2">
                {/* Thumbnail o ícono de video */}
                <div className="position-relative flex-shrink-0">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      className="rounded"
                      style={{
                        width: '50px',
                        height: '35px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div
                      className="bg-secondary rounded d-flex align-items-center justify-content-center"
                      style={{
                        width: '50px',
                        height: '35px'
                      }}
                    >
                      <Video size={16} className="text-white" />
                    </div>
                  )}
                  <div className="position-absolute bottom-0 end-0 bg-dark text-white px-1 rounded-top-start"
                    style={{ fontSize: '8px' }}>
                    <Play size={6} className="me-1" />
                    {formatDuration(video.duration)}
                  </div>
                </div>

                {/* Info del video */}
                <div className="flex-grow-1 overflow-hidden">
                  <div className="fw-bold text-truncate" style={{ fontSize: '11px' }}>
                    {video.name}
                  </div>
                  <div className="text-muted d-none d-sm-block" style={{ fontSize: '9px' }}>
                    {formatFileSize(video.size)}
                  </div>
                </div>

                {/* Botón eliminar */}
                <button
                  type="button"
                  className="btn btn-danger btn-sm rounded-circle p-1 flex-shrink-0"
                  onClick={() => onVideoRemove(video.id)}
                  style={{
                    width: '20px',
                    height: '20px',
                    fontSize: '10px'
                  }}
                >
                  <X size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
