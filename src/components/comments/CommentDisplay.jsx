// src/components/comments/CommentDisplay.jsx
import React, { useState } from 'react';
import { Play, Maximize2, X, MessageCircle } from 'lucide-react';
import { ReactionButton } from '../reactions';
import CommentEditor from './CommentEditor';

const CommentDisplay = ({ comentario, onReaction, publicacionId, onReply, isReply = false }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleReaction = async (reactionType, commentId) => {
    if (onReaction) {
      await onReaction(reactionType, commentId, publicacionId);
    }
  };

  // Procesar reacciones para el formato esperado por ReactionButton
  const getReactionData = () => {
    if (!comentario.reacciones) {
      return { reactions: {}, userReaction: null };
    }

    const reactions = {};
    let userReaction = null;

    // Obtener ID del usuario desde el token
    const token = localStorage.getItem('token');
    let currentUserId = null;

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUserId = payload.id;
      } catch (error) {
        console.error('Error decodificando token:', error);
      }
    }

    Object.entries(comentario.reacciones).forEach(([type, users]) => {
      reactions[type] = users.length;
      if (users.includes(currentUserId)) {
        userReaction = type;
      }
    });

    return { reactions, userReaction };
  };

  const { reactions, userReaction } = getReactionData();

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)}KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="d-flex gap-3 mb-3 w-100">
        <img
          src={comentario.autor?.fotoPerfil ?
            `http://localhost:3001${comentario.autor.fotoPerfil}` :
            '/default-avatar.png'
          }
          alt={comentario.autor?.primernombreUsuario || 'Usuario'}
          className="rounded-circle flex-shrink-0"
          style={{ width: 32, height: 32, objectFit: 'cover' }}
        />
        <div className="flex-grow-1 w-100" style={{ minWidth: 0 }}>
          {/* Card del comentario con diseño diferenciado */}
          <div
            className={`rounded-lg border-0 p-3 w-100 ${isReply ? 'bg-light' : ''}`}
            style={{
              backgroundColor: isReply ? '#f8f9fa' : '#ffffff',
              border: isReply ? '1px solid #e9ecef' : '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: isReply ? '0 1px 3px rgba(0,0,0,0.05)' : '0 2px 4px rgba(0,0,0,0.08)',
              borderLeft: isReply ? '3px solid #6c757d' : '3px solid #e5e7eb'
            }}
          >
            {/* Header del comentario */}
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center gap-2">
                <strong
                  style={{
                    color: isReply ? '#495057' : '#111827',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {comentario.autor?.primernombreUsuario || 'Usuario'} {comentario.autor?.primerapellidoUsuario || ''}
                </strong>
                <small
                  className="text-muted"
                  style={{
                    fontSize: '11px',
                    color: '#6b7280'
                  }}
                >
                  {new Date(comentario.fecha).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </small>
              </div>
            </div>

            {/* Texto del comentario */}
            {comentario.texto && (
              <div
                className="mb-2"
                style={{
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.4'
                }}
              >
                {comentario.texto}
              </div>
            )}

            {/* Imágenes adjuntas */}
            {comentario.imagenes && comentario.imagenes.length > 0 && (
              <div className="mb-2">
                <div className="d-flex flex-wrap gap-2">
                  {comentario.imagenes.map((imagen, index) => (
                    <div key={index} className="position-relative">
                      <img
                        src={`http://localhost:3001${imagen.url}`}
                        alt={`Imagen ${index + 1}`}
                        className="rounded cursor-pointer"
                        style={{
                          width: '70px',
                          height: '70px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          borderRadius: '8px'
                        }}
                        onClick={() => handleImageClick(`http://localhost:3001${imagen.url}`)}
                      />
                      <button
                        className="btn btn-dark btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-1 d-none d-md-block"
                        onClick={() => handleImageClick(`http://localhost:3001${imagen.url}`)}
                        style={{ width: '18px', height: '18px' }}
                      >
                        <Maximize2 size={8} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos adjuntos */}
            {comentario.videos && comentario.videos.length > 0 && (
              <div className="mb-2">
                <div className="d-flex flex-column gap-2">
                  {comentario.videos.map((video, index) => (
                    <div key={index} className="position-relative border rounded w-100">
                      <video
                        src={`http://localhost:3001${video.url}`}
                        className="w-100"
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          maxHeight: '180px',
                          borderRadius: '8px'
                        }}
                        controls
                        preload="metadata"
                      >
                        Tu navegador no soporta el elemento de video.
                      </video>
                      {video.duracion && (
                        <div className="position-absolute bottom-0 end-0 bg-dark text-white px-1 rounded-top-start"
                          style={{ fontSize: '8px' }}>
                          <Play size={6} className="me-1" />
                          {formatDuration(video.duracion)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer del comentario con acciones */}
            <div className="d-flex justify-content-between align-items-center mt-2 pt-2" style={{ borderTop: '1px solid #f1f5f9' }}>
              <div className="d-flex align-items-center gap-3">
                {/* Solo mostrar botón responder si NO es una respuesta (evitar anidamiento infinito) */}
                {!isReply && (
                  <button
                    className="btn btn-sm d-flex align-items-center gap-1 px-2 py-1 rounded border-0"
                    onClick={() => setShowReplyEditor(!showReplyEditor)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      fontSize: '12px',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#374151';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#6b7280';
                    }}
                  >
                    <MessageCircle size={12} />
                    <span>Responder</span>
                  </button>
                )}
              </div>

              {/* Botón de reacciones */}
              <ReactionButton
                reactions={reactions}
                userReaction={userReaction}
                onReact={handleReaction}
                commentId={comentario._id}
                publicacionId={publicacionId}
                size="sm"
                showLabels={false}
              />
            </div>
          </div>

          {/* Editor de respuesta */}
          {!isReply && showReplyEditor && (
            <div
              className="mt-3 p-3"
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '2px solid #e2e8f0',
                borderLeft: '4px solid #3b82f6'
              }}
            >
              <div className="mb-2">
                <small style={{ color: '#64748b', fontSize: '12px', fontWeight: '500' }}>
                  Respondiendo a este comentario:
                </small>
              </div>
              <CommentEditor
                onSubmit={(replyData) => {
                  if (onReply) {
                    // Agregar indicador de que es una respuesta en el texto
                    const replyText = `@${comentario.autor?.primernombreUsuario || 'Usuario'} ${replyData.texto}`;
                    onReply(comentario._id, { ...replyData, texto: replyText });
                    setShowReplyEditor(false);
                  }
                }}
                placeholder={`Responder a ${comentario.autor?.primernombreUsuario || 'Usuario'}...`}
                size="sm"
                showEmojiPicker={true}
                showImageUpload={false} // Simplificar respuestas
                showVideoUpload={false} // Simplificar respuestas
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal para ver imagen en grande */}
      {showImageModal && selectedImage && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={() => setShowImageModal(false)}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-header border-0 pb-0">
                <button
                  type="button"
                  className="btn btn-light btn-sm ms-auto"
                  onClick={() => setShowImageModal(false)}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="modal-body text-center p-0">
                <img
                  src={selectedImage}
                  alt="Imagen ampliada"
                  className="img-fluid rounded"
                  style={{ maxHeight: '80vh' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentDisplay;
