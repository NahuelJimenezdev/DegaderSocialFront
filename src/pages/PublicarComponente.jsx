import React, { useState, useRef } from 'react';
import {
  Image,
  Video,
  Smile,
  Calendar,
  Send,
  X
} from 'lucide-react';

const PublicarComponente = ({ usuario, onPublicar }) => {
  const [contenido, setContenido] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tipoPublicacion, setTipoPublicacion] = useState('publicacion');
  const [imagenes, setImagenes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');

  const imagenInputRef = useRef(null);
  const videoInputRef = useRef(null);

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
  // En PublicarComponente.jsx - REEMPLAZA la función handlePublicar completa:
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
    console.log('🔄 Intentando publicar...');

    try {
      // 1. PRIMERO crear la publicación localmente (instantáneo)
      const nuevaPublicacionSimulada = {
        _id: 'mock-' + Date.now(),
        autor: {
          _id: usuario._id,
          primernombreUsuario: usuario.primernombreUsuario,
          primerapellidoUsuario: usuario.primerapellidoUsuario,
          fotoPerfil: usuario.fotoPerfil
        },
        contenido,
        titulo: tipoPublicacion === 'evento' ? titulo : undefined,
        imagenes: imagenes.map(img => img.preview),
        videos: videos.map(vid => vid.preview),
        fechaPublicacion: new Date(),
        likes: [],
        comentarios: [],
        esLocal: true // Marcar como publicación local
      };

      // 2. Inmediatamente mostrar al usuario
      if (onPublicar) {
        onPublicar(nuevaPublicacionSimulada);
      }

      // 3. Limpiar el formulario (rápido)
      setContenido('');
      setTitulo('');

      // 4. Liberar memoria de previews
      imagenes.forEach(img => URL.revokeObjectURL(img.preview));
      videos.forEach(vid => URL.revokeObjectURL(vid.preview));

      setImagenes([]);
      setVideos([]);

      console.log('✅ Publicación local exitosa');

      // 5. Intentar enviar al backend en SEGUNDO PLANO (sin esperar)
      intentarEnviarAlBackend().catch(error => {
        console.warn('⚠️ No se pudo sincronizar con backend:', error.message);
      });

    } catch (error) {
      console.error('❌ Error inesperado:', error);
      setError('Error al crear la publicación');
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
      <div className="card-body">
        <div className="d-flex gap-3">
          {/* Foto de perfil */}
          <div className="flex-shrink-0">
            <div
              className="rounded-circle overflow-hidden"
              style={{ width: 50, height: 50 }}
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
                style={{ display: usuario.fotoPerfil ? 'none' : 'flex' }}
              >
                <span className="fw-bold">
                  {usuario.primernombreUsuario?.[0]?.toUpperCase()}
                  {usuario.primerapellidoUsuario?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Contenido de la publicación */}
          <div className="flex-grow-1">
            {/* Selector de tipo de publicación */}
            <div className="mb-3">
              <select
                className="form-select form-select-sm"
                value={tipoPublicacion}
                onChange={(e) => setTipoPublicacion(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="publicacion">Publicación</option>
                <option value="evento">Evento</option>
              </select>
            </div>

            {/* Título para eventos */}
            {tipoPublicacion === 'evento' && (
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Título del evento"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>
            )}

            {/* Área de texto */}
            <textarea
              className="form-control mb-3"
              placeholder={`¿Qué estás pensando, ${usuario.primernombreUsuario}?`}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              rows="3"
            />

            {/* Previews de imágenes */}
            {imagenes.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-3">
                {imagenes.map((imagen, index) => (
                  <div key={index} className="position-relative" style={{ width: 100, height: 100 }}>
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
              <div className="d-flex flex-wrap gap-2 mb-3">
                {videos.map((video, index) => (
                  <div key={index} className="position-relative" style={{ width: 100, height: 100 }}>
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
              <div className="alert alert-danger py-2 mb-3" role="alert">
                {error}
              </div>
            )}

            {/* Botones de acción */}
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2">
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
                  <span>Foto</span>
                </button>

                {/* Botón para subir video */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                  onClick={() => videoInputRef.current.click()}
                  disabled={subiendo}
                >
                  <Video size={16} />
                  <span>Video</span>
                </button>

                {/* Botón para emojis (placeholder) */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                  onClick={() => alert('Selector de emojis pronto')}
                  disabled={subiendo}
                >
                  <Smile size={16} />
                  <span>Emoji</span>
                </button>

                {/* Si es evento, mostrar selector de fecha */}
                {tipoPublicacion === 'evento' && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                    onClick={() => alert('Selector de fecha pronto')}
                    disabled={subiendo}
                  >
                    <Calendar size={16} />
                    <span>Fecha</span>
                  </button>
                )}
              </div>

              {/* Botón de publicar */}
              <button
                className="btn btn-primary d-flex align-items-center gap-1"
                onClick={handlePublicar}
                disabled={subiendo || (!contenido.trim() && imagenes.length === 0 && videos.length === 0)}
              >
                {subiendo ? (
                  <>
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Publicando...</span>
                    </div>
                    <span>Publicando...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Publicar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicarComponente;