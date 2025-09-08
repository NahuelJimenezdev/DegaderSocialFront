// src/components/comments/ImageUploader.jsx
import React, { useState, useRef } from 'react';
import { ImagePlus, X, Upload } from 'lucide-react';

const ImageUploader = ({ onImageSelect, onImageRemove, selectedImages = [] }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Use: JPG, PNG, GIF, WEBP');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('El archivo es demasiado grande. Máximo 5MB');
    }
    return true;
  };

  const processFiles = async (files) => {
    setUploading(true);
    try {
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        validateFile(file);

        // Crear preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            file,
            preview: e.target.result,
            name: file.name,
            size: file.size,
            id: Date.now() + Math.random()
          };
          onImageSelect(imageData);
        };
        reader.readAsDataURL(file);
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
              <span className="d-none d-sm-inline">Subiendo...</span>
            </>
          ) : (
            <>
              <ImagePlus size={16} />
              <span className="d-none d-sm-inline">Imagen</span>
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
          JPG, PNG, GIF, WEBP (máx. 5MB)
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
            Arrastra imágenes aquí o haz clic para seleccionar
          </small>
          <small className="d-md-none">
            Toca para seleccionar imágenes
          </small>
        </div>
      </div>

      {/* Preview de imágenes seleccionadas */}
      {selectedImages.length > 0 && (
        <div className="d-flex flex-wrap gap-2">
          {selectedImages.map((image) => (
            <div key={image.id} className="position-relative">
              <img
                src={image.preview}
                alt={image.name}
                className="rounded"
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover'
                }}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle p-1"
                onClick={() => onImageRemove(image.id)}
                style={{
                  transform: 'translate(50%, -50%)',
                  width: '20px',
                  height: '20px',
                  fontSize: '10px'
                }}
              >
                <X size={10} />
              </button>
              <div className="text-center mt-1 d-none d-md-block">
                <small className="text-muted" style={{ fontSize: '10px' }}>
                  {(image.size / 1024).toFixed(1)}KB
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
