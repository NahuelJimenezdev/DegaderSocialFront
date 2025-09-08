// src/components/comments/CommentEditor.jsx
import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import ImageUploader from './ImageUploader';
import VideoUploader from './VideoUploader';

const CommentEditor = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Escribe un comentario...",
  size = "normal", // "normal" o "sm" para respuestas
  showEmojiPicker: showEmojiPickerProp = true, // Permitir desactivar picker para respuestas
  showImageUpload = true, // Permitir desactivar carga de imágenes para respuestas
  showVideoUpload = true  // Permitir desactivar carga de videos para respuestas
}) => {
  const [internalText, setInternalText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showVideoUploader, setShowVideoUploader] = useState(false);
  const textareaRef = useRef(null);

  // Usar estado interno si no se pasa value (para respuestas)
  const currentValue = value !== undefined ? value : internalText;
  const handleChange = onChange || setInternalText;

  const handleEmojiSelect = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = currentValue.substring(0, start) + emoji + currentValue.substring(end);
      handleChange(newValue);

      // Mover cursor después del emoji
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      handleChange(currentValue + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleImageSelect = (imageData) => {
    setSelectedImages(prev => [...prev, imageData]);
  };

  const handleImageRemove = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleVideoSelect = (videoData) => {
    setSelectedVideos(prev => [...prev, videoData]);
  };

  const handleVideoRemove = (videoId) => {
    setSelectedVideos(prev => prev.filter(vid => vid.id !== videoId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('📝 [CommentEditor] Enviando comentario...');
    console.log('📄 [CommentEditor] Texto:', currentValue);
    console.log('🖼️ [CommentEditor] Imágenes seleccionadas:', selectedImages);
    console.log('🎬 [CommentEditor] Videos seleccionados:', selectedVideos);

    // Verificar que hay contenido
    if (!currentValue.trim() && selectedImages.length === 0 && selectedVideos.length === 0) {
      alert('Agrega texto, una imagen o un video');
      return;
    }

    const comentarioData = {
      texto: currentValue,
      imagenes: selectedImages,
      videos: selectedVideos
    };

    console.log('📦 [CommentEditor] Datos a enviar:', comentarioData);

    // Enviar datos al componente padre
    onSubmit(comentarioData);

    // Limpiar el editor
    if (onChange) {
      onChange('');
    } else {
      setInternalText('');
    }
    setSelectedImages([]);
    setSelectedVideos([]);
    setShowEmojiPicker(false);
    setShowImageUploader(false);
    setShowVideoUploader(false);
  };

  return (
    <div className="border rounded p-2 p-md-3 bg-light position-relative" style={{ overflow: 'visible' }}>
      <form onSubmit={handleSubmit}>
        {/* Área de texto */}
        <div className="mb-3">
          <textarea
            ref={textareaRef}
            className="form-control"
            rows={size === "sm" ? "2" : "3"}
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            style={{ resize: 'vertical', minHeight: size === "sm" ? '60px' : '80px' }}
          />
        </div>

        {/* Sección de carga de imágenes (colapsible) */}
        {showImageUpload && showImageUploader && (
          <div className="mb-3">
            <ImageUploader
              selectedImages={selectedImages}
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
            />
          </div>
        )}

        {/* Sección de carga de videos (colapsible) */}
        {showVideoUpload && showVideoUploader && (
          <div className="mb-3">
            <VideoUploader
              selectedVideos={selectedVideos}
              onVideoSelect={handleVideoSelect}
              onVideoRemove={handleVideoRemove}
            />
          </div>
        )}

        {/* Barra de herramientas */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
          <div className="d-flex flex-wrap gap-1 gap-md-2 align-items-center position-relative" style={{ overflow: 'visible' }}>
            {/* Selector de emojis */}
            {showEmojiPickerProp && (
              <div style={{ position: 'relative', overflow: 'visible' }}>
                <EmojiPicker
                  show={showEmojiPicker}
                  onToggle={() => setShowEmojiPicker(!showEmojiPicker)}
                  onEmojiSelect={handleEmojiSelect}
                />
              </div>
            )}

            {/* Botón para subir imágenes */}
            {showImageUpload && (
              <button
                type="button"
                className={`btn ${showImageUploader ? 'btn-primary' : 'btn-outline-secondary'} btn-sm d-flex align-items-center gap-1`}
                onClick={() => setShowImageUploader(!showImageUploader)}
                disabled={isLoading}
              >
                📷 {size === "sm" ? "" : "Imagen"}
              </button>
            )}

            {/* Botón para subir videos */}
            {showVideoUpload && (
              <button
                type="button"
                className={`btn ${showVideoUploader ? 'btn-primary' : 'btn-outline-secondary'} btn-sm d-flex align-items-center gap-1`}
                onClick={() => setShowVideoUploader(!showVideoUploader)}
                disabled={isLoading}
              >
                🎥 {size === "sm" ? "" : "Video"}
              </button>
            )}
          </div>

          {/* Botón enviar */}
          <button
            type="submit"
            className="btn btn-primary btn-sm d-flex align-items-center gap-1 align-self-end align-self-sm-center"
            disabled={isLoading || (!currentValue.trim() && selectedImages.length === 0 && selectedVideos.length === 0)}
          >
            {isLoading ? (
              <>
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Enviando...</span>
                </div>
                <span className="d-none d-sm-inline">Enviando...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span className="d-none d-sm-inline">Enviar</span>
              </>
            )}
          </button>
        </div>

        {/* Resumen de archivos seleccionados */}
        {(selectedImages.length > 0 || selectedVideos.length > 0) && (
          <div className="mt-2 p-2 bg-white rounded border">
            <small className="text-muted">
              📎 Adjuntos:
              {selectedImages.length > 0 && ` ${selectedImages.length} imagen(es)`}
              {selectedImages.length > 0 && selectedVideos.length > 0 && ', '}
              {selectedVideos.length > 0 && ` ${selectedVideos.length} video(s)`}
            </small>
          </div>
        )}
      </form>
    </div>
  );
};

export default CommentEditor;
