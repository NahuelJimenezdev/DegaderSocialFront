import React, { useState, useRef } from 'react';
import {
  Image,
  Video,
  Smile,
  Calendar,
  Send,
  X
} from 'lucide-react';
import EmojiSelector from '../components/EmojiSelector';
import CrearEventoModal from '../components/CrearEventoModal';

const PublicarComponente = ({ usuario, onPublicar, onEventoCreado }) => {
  const [contenido, setContenido] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tipoPublicacion, setTipoPublicacion] = useState('publicacion');
  const [imagenes, setImagenes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');
  const [mostrarModalEvento, setMostrarModalEvento] = useState(false);

  const imagenInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const contenidoInputRef = useRef(null);

  // Función para agregar emoji al contenido
  const handleEmojiSelect = (emoji) => {
    const textarea = contenidoInputRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = contenido.substring(0, start) + emoji + contenido.substring(end);
      setContenido(newText);

      // Reposicionar el cursor después del emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setContenido(contenido + emoji);
    }
  };

  const handleImagenChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Validar que sean imágenes
      const imagenesValidas = files.filter(file => file.type.startsWith('image/'));

      if (imagenesValidas.length === 0) {
        setError('Por favor, selecciona solo archivos de imagen');
        return;
      }

      // Crear previews para mostrar
      const nuevasImagenes = imagenesValidas.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setImagenes([...imagenes, ...nuevasImagenes]);
      setError('');
    }
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Validar que sean videos
      const videosValidos = files.filter(file => file.type.startsWith('video/'));

      if (videosValidos.length === 0) {
        setError('Por favor, selecciona solo archivos de video');
        return;
      }

      // Crear previews para mostrar
      const nuevosVideos = videosValidos.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setVideos([...videos, ...nuevosVideos]);
      setError('');
    }
  };

  const quitarImagen = (index) => {
    const nuevasImagenes = [...imagenes];
    URL.revokeObjectURL(nuevasImagenes[index].preview); // Liberar memoria
    nuevasImagenes.splice(index, 1);
    setImagenes(nuevasImagenes);
  };

  const quitarVideo = (index) => {
    const nuevosVideos = [...videos];
    URL.revokeObjectURL(nuevosVideos[index].preview); // Liberar memoria
    nuevosVideos.splice(index, 1);
    setVideos(nuevosVideos);
  };

  // En PublicarComponente.jsx - modifica handlePublicar
  // Función principal mejorada
  const handlePublicar = async () => {
    // Validaciones
    if (!contenido.trim() && imagenes.length === 0 && videos.length === 0) {
      setError('Por favor, escribe algo o añade una imagen/video');
      return;
    }

    if (tipoPublicacion === 'evento' && !titulo.trim()) {
      setError('Los eventos necesitan un título');
      return;
    }

    setSubiendo(true);
    setError('');
    console.log('🔄 Enviando publicación al backend...');

    try {
      // Enviar directamente al backend
      const data = await intentarEnviarAlBackend();

      console.log('✅ Publicación creada exitosamente:', data);

      // Limpiar el formulario
      setContenido('');
      setTitulo('');

      // Liberar memoria de previews
      imagenes.forEach(img => URL.revokeObjectURL(img.preview));
      videos.forEach(vid => URL.revokeObjectURL(vid.preview));

      setImagenes([]);
      setVideos([]);

      // Notificar al componente padre para que recargue las publicaciones
      if (onPublicar) {
        onPublicar(data.publicacion);
      }

    } catch (error) {
      console.error('❌ Error creando publicación:', error);
      setError('Error al crear la publicación: ' + error.message);
    } finally {
      setSubiendo(false);
    }
  };

  // Añade esta función
  // En PublicarComponente.jsx - modifica intentarEnviarAlBackend
  const intentarEnviarAlBackend = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      console.log('📡 Intentando enviar al backend...');

      const formData = new FormData();
      formData.append('autor', usuario._id);
      formData.append('contenido', contenido);
      formData.append('tipo', tipoPublicacion);

      if (titulo) {
        formData.append('titulo', titulo);
      }

      imagenes.forEach((imagen) => {
        formData.append('imagenes', imagen.file);
      });

      videos.forEach((video) => {
        formData.append('videos', video.file);
      });

      // Añade timeout manual en lugar de abort controller
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout después de 8 segundos')), 8000);
      });

      const fetchPromise = fetch('http://localhost:3001/api/publicaciones', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Publicación sincronizada con backend:', data);
      return data;

    } catch (error) {
      console.error('❌ Error en intentarEnviarAlBackend:', error);
      throw error;
    }
  };


  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-2 p-md-3">
        <div className="d-flex gap-2 gap-md-3">
          {/* Foto de perfil */}
          <div className="flex-shrink-0">
            <div
              className="rounded-circle overflow-hidden"
              style={{ width: 40, height: 40 }}
            >
              {usuario.fotoPerfil ? (
                <img
                  src={`http://localhost:3001${usuario.fotoPerfil}`}
                  alt={usuario.primernombreUsuario}
                  className="w-100 h-100 object-fit-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-100 h-100 d-flex align-items-center justify-content-center bg-primary text-white"
                style={{ display: usuario.fotoPerfil ? 'none' : 'flex', fontSize: '14px' }}
              >
                <span className="fw-bold">
                  {usuario.primernombreUsuario?.[0]?.toUpperCase()}
                  {usuario.primerapellidoUsuario?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Contenido de la publicación */}
          <div className="flex-grow-1 min-width-0">
            {/* Selector de tipo de publicación */}
            <div className="mb-2 mb-md-3">
              <select
                className="form-select form-select-sm"
                value={tipoPublicacion}
                onChange={(e) => setTipoPublicacion(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="publicacion">📝 Publicación Normal</option>
                <option value="evento">📅 Evento Simple</option>
              </select>
              <small className="text-muted d-block mt-1 d-none d-md-block">
                {tipoPublicacion === 'publicacion'
                  ? 'Comparte pensamientos, fotos y videos'
                  : 'Evento básico con título y descripción'
                }
              </small>
            </div>

            {/* Título para eventos */}
            {tipoPublicacion === 'evento' && (
              <div className="mb-2 mb-md-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Título del evento"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>
            )}

            {/* Área de texto */}
            <textarea
              ref={contenidoInputRef}
              className="form-control mb-2 mb-md-3"
              placeholder={`¿Qué estás pensando, ${usuario.primernombreUsuario}?`}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              rows="2"
              style={{ minHeight: '60px' }}
            />

            {/* Previews de imágenes */}
            {imagenes.length > 0 && (
              <div className="d-flex flex-wrap gap-1 gap-md-2 mb-2 mb-md-3">
                {imagenes.map((imagen, index) => (
                  <div key={index} className="position-relative" style={{ width: 80, height: 80 }}>
                    <img
                      src={imagen.preview}
                      alt={`Preview ${index}`}
                      className="img-fluid rounded h-100 w-100 object-fit-cover"
                    />
                    <button
                      type="button"
                      className="btn-close position-absolute top-0 end-0 m-1 bg-white"
                      onClick={() => quitarImagen(index)}
                    ></button>
                  </div>
                ))}
              </div>
            )}

            {/* Previews de videos */}
            {videos.length > 0 && (
              <div className="d-flex flex-wrap gap-1 gap-md-2 mb-2 mb-md-3">
                {videos.map((video, index) => (
                  <div key={index} className="position-relative" style={{ width: 80, height: 80 }}>
                    <video
                      src={video.preview}
                      className="img-fluid rounded h-100 w-100 object-fit-cover"
                    />
                    <button
                      type="button"
                      className="btn-close position-absolute top-0 end-0 m-1 bg-white"
                      onClick={() => quitarVideo(index)}
                    ></button>
                  </div>
                ))}
              </div>
            )}

            {/* Mensaje de error */}
            {error && (
              <div className="alert alert-danger py-1 py-md-2 mb-2 mb-md-3" role="alert">
                <small>{error}</small>
              </div>
            )}

            {/* Botones de acción */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex gap-1 gap-md-2 flex-wrap">
                {/* Input oculto para imágenes */}
                <input
                  type="file"
                  ref={imagenInputRef}
                  onChange={handleImagenChange}
                  accept="image/*"
                  multiple
                  className="d-none"
                />

                {/* Input oculto para videos */}
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoChange}
                  accept="video/*"
                  multiple
                  className="d-none"
                />

                {/* Botón para subir imagen */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                  onClick={() => imagenInputRef.current.click()}
                  disabled={subiendo}
                >
                  <Image size={16} />
                  <span className="d-none d-sm-inline">Foto</span>
                </button>

                {/* Botón para subir video */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                  onClick={() => videoInputRef.current.click()}
                  disabled={subiendo}
                >
                  <Video size={16} />
                  <span className="d-none d-sm-inline">Video</span>
                </button>

                {/* Selector de emojis */}
                <EmojiSelector
                  onEmojiSelect={handleEmojiSelect}
                  className="d-inline-block"
                />

                {/* Botón para crear evento completo */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 d-none d-md-flex"
                  onClick={() => setMostrarModalEvento(true)}
                  disabled={subiendo}
                  title="Crear evento profesional con fechas, ubicación, asistentes y más opciones"
                >
                  <Calendar size={16} />
                  <span>Evento/Reunión</span>
                </button>
              </div>

              {/* Botón de publicar */}
              <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                onClick={handlePublicar}
                disabled={subiendo || (!contenido.trim() && imagenes.length === 0 && videos.length === 0)}
              >
                {subiendo ? (
                  <>
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Publicando...</span>
                    </div>
                    <span className="d-none d-sm-inline">Publicando...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span className="d-none d-sm-inline">Publicar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear evento */}
      <CrearEventoModal
        show={mostrarModalEvento}
        onHide={() => setMostrarModalEvento(false)}
        usuario={usuario}
        onEventoCreado={(evento) => {
          console.log('✅ Evento creado:', evento);
          setMostrarModalEvento(false);
          // Llamar al callback del padre para recargar eventos
          if (onEventoCreado) {
            onEventoCreado(evento);
          }
        }}
      />
    </div>
  );
};

export default PublicarComponente;