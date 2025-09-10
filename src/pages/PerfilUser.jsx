// src/pages/PerfilUser.jsx
import React, { useEffect, useState } from "react";
import { MapPin, Calendar, Briefcase, Mail, Users, FileText, Edit, ThumbsUp, MessageSquare } from "lucide-react";
import { EditProfileModal } from "../components/profile/EditProfileModal";
import { EditBasicInfo } from "../components/profile/EditBasicInfo";
import EditContact from "../components/profile/EditContact";
import BannerUpload from "../components/profile/BannerUpload";
import EditPerfil from "../components/profile/EditPerfil";
import { EditBio } from "../components/profile/EditBio";
import { EditPrivacy } from "../components/profile/EditPrivacy";
import { ImageDebugger } from "../components/profile/ImageDebugger";
import { ImageUrlTester } from "../components/profile/ImageUrlTester";
import { SimpleImageTest } from "../components/profile/SimpleImageTest";
import { ImageUploadTest } from "../components/profile/ImageUploadTest";
import { apiFetch } from "../lib/api.js";
import { buildApiUrl, API_CONFIG } from "../lib/config.js";
import { useProfile } from "../context/AuthContext";
import PublicarComponente from "./PublicarComponente";
import { CommentEditor, CommentDisplay } from "../components/comments";

function EditProfileContent({ user, onUserUpdate }) {
  const [tab, setTab] = useState("Nombre Usuario");

  return (
    <>
      <ul className="nav nav-tabs mb-3">
        {["Nombre Usuario", "Contacto", "Biografía", "Perfil", "Privacidad"].map((t) => (
          <li className="nav-item" key={t}>
            <button
              className={`nav-link ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>

      {tab === "Nombre Usuario" && (
        <EditBasicInfo
          initial={{
            primernombreUsuario: user.primernombreUsuario,
            primerapellidoUsuario: user.primerapellidoUsuario,
          }}
          version={user.version}
          onSaved={onUserUpdate}
        />
      )}
      {tab === "Contacto" && (
        <EditContact
          initial={{
            correoUsuario: user.correoUsuario,
            celularUsuario: user.celularUsuario,
            direccionUsuario: user.direccionUsuario,
            ciudadUsuario: user.ciudadUsuario,
            paisUsuario: user.paisUsuario,
          }}
          version={user.version}
          onSaved={onUserUpdate}
        />
      )}
      {tab === "Biografía" && (
        <EditBio
          initial={{ biografia: user.biografia }}
          version={user.version}
          onSaved={onUserUpdate}
        />
      )}
      {tab === "Perfil" && (
        <div>
          <div className="mb-4">
            <h5>Foto de Perfil</h5>
            <EditPerfil />
          </div>
          <div className="mb-4">
            <h5>Banner de Perfil</h5>
            <BannerUpload />
          </div>
        </div>
      )}
      {tab === "Privacidad" && (
        <EditPrivacy
          initial={{ jerarquiaUsuario: user.jerarquiaUsuario }}
          version={user.version}
          onSaved={onUserUpdate}
        />
      )}
    </>
  );
}

function SimpleModal({ open, onClose, title = "Editar Perfil", children }) {
  if (!open) return null;
  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1055, }} onClick={onClose} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(720px, 95vw)", maxHeight: "90vh", overflow: "auto", zIndex: 1060, background: "#fff", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,.25)", }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,.1)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#fff", zIndex: 1, }}>
          <strong>{title}</strong>
          <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: 22, lineHeight: 1, cursor: "pointer", }} aria-label="Cerrar" title="Cerrar" >
            ×
          </button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </>
  );
}

function PerfilUser() {
  const { profile, setProfile } = useProfile();
  const [publicaciones, setPublicaciones] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPublicaciones, setLoadingPublicaciones] = useState(true);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [err, setErr] = useState(null);
  const [errorPublicaciones, setErrorPublicaciones] = useState(false);
  const [errorEventos, setErrorEventos] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [tabActiva, setTabActiva] = useState('publicaciones');
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [mostrarDetallesEvento, setMostrarDetallesEvento] = useState(false);
  const [mostrarEditarEvento, setMostrarEditarEvento] = useState(false);

  // Estados para comentarios
  const [comentarios, setComentarios] = useState({});
  const [mostrandoComentarios, setMostrandoComentarios] = useState(null);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [procesandoLike, setProcesandoLike] = useState(null);

  const cargarPublicaciones = async () => {
    try {
      setErrorPublicaciones(false);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        "http://localhost:3001/api/publicaciones/usuario",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPublicaciones(data.publicaciones || []);
      } else {
        setErrorPublicaciones(true);
      }
    } catch (error) {
      console.error('Error cargando publicaciones:', error);
      setErrorPublicaciones(true);
    } finally {
      setLoadingPublicaciones(false);
    }
  };

  const cargarEventos = async () => {
    try {
      setErrorEventos(false);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        "http://localhost:3001/api/eventos/usuario/mis-eventos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEventos(data.eventos || []);
      } else {
        setErrorEventos(true);
      }
    } catch (error) {
      console.error('Error cargando eventos:', error);
      setErrorEventos(true);
    } finally {
      setLoadingEventos(false);
    }
  };

  useEffect(() => {
    if (profile) {
      cargarPublicaciones();
      cargarEventos();
    }
  }, [profile]);

  useEffect(() => {
    if (!profile) {
      const ac = new AbortController();
      (async () => {
        try {
          setLoadingUser(true);
          setErr(null);
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No hay token");
          const { data } = await apiFetch(
            buildApiUrl(API_CONFIG.ENDPOINTS.ME),
            {
              signal: ac.signal,
            }
          );
          setProfile(data?.usuario || data);
        } catch (error) {
          if (error.name === "AbortError") return;
          console.error("Error al cargar perfil:", error);
          setErr(error.message || "Error al cargar el perfil");
        } finally {
          setLoadingUser(false);
        }
      })();
      return () => ac.abort();
    } else {
      // Si ya hay un perfil, no necesitamos cargar
      setLoadingUser(false);
    }
  }, [profile, setProfile]);

  const manejarNuevaPublicacion = async (nuevaPublicacion) => {
    await cargarPublicaciones();
  };

  const manejarNuevoEvento = async (nuevoEvento) => {
    await cargarEventos();
  };

  const manejarVerDetallesEvento = (evento) => {
    setEventoSeleccionado(evento);
    setMostrarDetallesEvento(true);
  };

  const manejarEditarEvento = (evento) => {
    setEventoSeleccionado(evento);
    setMostrarEditarEvento(true);
  };

  const cerrarModalesEvento = () => {
    setEventoSeleccionado(null);
    setMostrarDetallesEvento(false);
    setMostrarEditarEvento(false);
  };

  // Funciones para manejar comentarios y likes
  const handleToggleLike = async (publicacionId) => {
    try {
      setProcesandoLike(publicacionId);
      const token = localStorage.getItem("token");
      const url = `http://localhost:3001/api/publicaciones/${publicacionId}/like`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        const updatedPublicacion = responseData.publicacion;

        setPublicaciones(prev =>
          prev.map(pub =>
            pub._id === publicacionId
              ? {
                ...pub,
                likes: Array.isArray(updatedPublicacion?.likes) ? updatedPublicacion.likes : []
              }
              : pub
          )
        );
      } else {
        const errorData = await response.text();
        console.error('Error al dar like:', response.statusText, errorData);
        setErrorMensaje('Error al procesar el like');
      }
    } catch (error) {
      console.error('Error al dar like:', error);
      setErrorMensaje('Error de conexión');
    } finally {
      setProcesandoLike(null);
    }
  }; const handleMostrarComentarios = (publicacionId) => {
    if (mostrandoComentarios === publicacionId) {
      setMostrandoComentarios(null);
    } else {
      setMostrandoComentarios(publicacionId);
    }
  };

  const handleEnviarComentario = async (publicacionId, comentarioData) => {
    try {
      setEnviandoComentario(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append('texto', comentarioData.texto);

      // Agregar imágenes
      if (comentarioData.imagenes && comentarioData.imagenes.length > 0) {
        comentarioData.imagenes.forEach((imagen, index) => {
          formData.append('imagenes', imagen.file);
        });
      }

      // Agregar videos
      if (comentarioData.videos && comentarioData.videos.length > 0) {
        comentarioData.videos.forEach((video, index) => {
          formData.append('videos', video.file);
        });
      }

      const response = await fetch(`http://localhost:3001/api/publicaciones/${publicacionId}/comentarios`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        // El backend retorna la publicación completa con el nuevo comentario
        setPublicaciones(prev =>
          prev.map(pub =>
            pub._id === publicacionId
              ? result.publicacion
              : pub
          )
        );
        setNuevoComentario('');
      } else {
        console.error('Error al enviar comentario:', response.statusText);
        setErrorMensaje('Error al enviar comentario');
      }
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      setErrorMensaje('Error de conexión');
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleReaccionComentario = async (reactionType, commentId, publicacionId) => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:3001/api/publicaciones/${publicacionId}/comentarios/${commentId}/reacciones`;
      const body = { reactionType };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const result = await response.json();
        // El backend retorna la publicación completa actualizada
        setPublicaciones(prev =>
          prev.map(pub =>
            pub._id === publicacionId
              ? result.publicacion
              : pub
          )
        );
      } else {
        const errorData = await response.text();
        console.error('Error al reaccionar al comentario:', response.statusText, errorData);
      }
    } catch (error) {
      console.error('Error de conexión al reaccionar al comentario:', error);
    }
  };

  const handleEnviarRespuesta = async (comentarioId, respuestaData) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append('texto', respuestaData.texto);

      // Agregar imágenes si las hay
      if (respuestaData.imagenes && respuestaData.imagenes.length > 0) {
        respuestaData.imagenes.forEach((imagen) => {
          formData.append('imagenes', imagen.file);
        });
      }

      // Agregar videos si los hay
      if (respuestaData.videos && respuestaData.videos.length > 0) {
        respuestaData.videos.forEach((video) => {
          formData.append('videos', video.file);
        });
      }

      // Encontrar la publicación que contiene el comentario
      const publicacionConComentario = publicaciones.find(pub =>
        pub.comentarios?.some(com => com._id === comentarioId)
      );

      if (!publicacionConComentario) {
        console.error('No se encontró la publicación para el comentario');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/publicaciones/${publicacionConComentario._id}/comentarios`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        // Actualizar con la publicación completa retornada por el backend
        setPublicaciones(prev =>
          prev.map(pub =>
            pub._id === publicacionConComentario._id
              ? result.publicacion
              : pub
          )
        );
      } else {
        console.error('Error al enviar respuesta:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
    }
  };

  // Función para agrupar comentarios y sus respuestas
  const agruparComentariosConRespuestas = (comentarios) => {
    if (!comentarios || comentarios.length === 0) return [];

    // Crear una copia para no mutar el original
    const comentariosOrdenados = [...comentarios].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    const comentariosAgrupados = [];
    const respuestasMap = new Map();

    // Primera pasada: identificar comentarios principales
    comentariosOrdenados.forEach(comentario => {
      if (!comentario.texto || !comentario.texto.startsWith('@')) {
        // Es un comentario principal
        comentariosAgrupados.push({
          ...comentario,
          respuestas: []
        });
      }
    });

    // Segunda pasada: asociar respuestas con comentarios principales
    comentariosOrdenados.forEach(comentario => {
      if (comentario.texto && comentario.texto.startsWith('@')) {
        // Es una respuesta
        const match = comentario.texto.match(/^@(\w+)\s/);
        if (match) {
          const nombreUsuario = match[1];

          // Buscar el comentario principal más reciente de ese usuario antes de esta respuesta
          let comentarioPrincipal = null;
          for (let i = comentariosAgrupados.length - 1; i >= 0; i--) {
            const cp = comentariosAgrupados[i];
            if (cp.autor?.primernombreUsuario === nombreUsuario &&
              new Date(cp.fecha) < new Date(comentario.fecha)) {
              comentarioPrincipal = cp;
              break;
            }
          }

          if (comentarioPrincipal) {
            comentarioPrincipal.respuestas.push(comentario);
          } else {
            // Si no encuentra el comentario principal, tratarlo como comentario normal
            comentariosAgrupados.push({
              ...comentario,
              respuestas: []
            });
          }
        }
      }
    });

    return comentariosAgrupados;
  }; const first_name = profile?.primernombreUsuario || profile?.nombreUsuario || profile?.first_name || "";
  const last_name = profile?.primerapellidoUsuario || profile?.apellidoUsuario || profile?.last_name || "";
  const avatar_url = profile?.fotoPerfil || profile?.avatar_url || "";
  const banner_url = profile?.fotoBannerPerfil || profile?.banner_url || "";
  const position = profile?.position || profile?.cargo || "";
  const role = (profile?.rolUsuario || profile?.role || "visitante")?.toString().toLowerCase();
  const status = (profile?.status || profile?.estado || "activo")?.toString().toLowerCase();
  const hierarchy_level = profile?.hierarchy_level || profile?.jerarquiaUsuario || "";
  const bio = profile?.biografia || "";
  const email = profile?.emailUsuario || profile?.email || "";
  const city = profile?.ciudadUsuario || profile?.city || "";
  const country = profile?.paisUsuario || profile?.country || "";
  const address = profile?.direccionUsuario || profile?.address || "";
  const created_at = profile?.fechaRegistro || profile?.created_at || "";
  const userId = profile?._id || profile?.id || "";

  // Debug log para verificar userId (solo cuando cambie el profile)
  // useEffect(() => {
  //   console.log('🔍 [Debug] Profile:', profile);
  //   console.log('🔍 [Debug] userId extraído:', userId);
  // }, [profile, userId]);

  // Helper function para manejar likes correctamente
  const usuarioYaDioLike = (likes, userId) => {
    if (!Array.isArray(likes) || !userId) {
      return false;
    }

    // Los likes pueden ser strings (userIds) u objetos (usuarios populados)
    return likes.some(like => {
      if (typeof like === 'string') {
        return like === userId;
      } else if (typeof like === 'object' && like._id) {
        return like._id === userId;
      }
      return false;
    });
  };

  const contarLikes = (likes) => {
    return Array.isArray(likes) ? likes.length : 0;
  };

  if (loadingUser) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4>Error al cargar el perfil</h4>
          <p>{err}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          <h4>Perfil no encontrado</h4>
          <p>No se pudo cargar la información del perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .like-button-active {
          background-color: #f0f9ff !important;
          color: #0ea5e9 !important;
          border: 1px solid #e0f2fe !important;
          box-shadow: 0 1px 3px rgba(14, 165, 233, 0.1) !important;
        }
        
        .like-button-inactive {
          background-color: transparent !important;
          color: #4b5563 !important;
          border: 1px solid transparent !important;
        }
        
        .like-button-active:hover {
          background-color: #e0f2fe !important;
          transform: scale(1.02) !important;
        }
        
        .like-button-inactive:hover {
          background-color: #f9fafb !important;
          color: #111827 !important;
        }
      `}</style>
      <div style={{ backgroundColor: '#f3f4f6', minHeight: 'calc(100vh - 120px)', margin: '-12px', padding: '12px' }}>
        <div className="container-fluid px-0 pb-4">
          {/* Header del perfil completo */}
          <div className="card shadow-sm border-0 overflow-hidden mb-4">
            {/* Banner */}
            <div
              style={{
                height: 180,
                background: banner_url
                  ? `url(http://localhost:3001${banner_url}?t=${new Date().getTime()}) center/cover`
                  : "linear-gradient(90deg, #60a5fa, #3b82f6, #f59e0b)",
                borderRadius: '12px 12px 0 0'
              }}
            />

            <div className="px-4 px-md-5 pb-4">
              {/* Foto de perfil y botón editar */}
              <div className="d-flex align-items-end justify-content-between" style={{ marginTop: -80 }}>
                <div className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden border border-4 border-white shadow" style={{ width: 128, height: 128, background: "linear-gradient(135deg,#60a5fa,#fbbf24)" }}>
                  {avatar_url ? (
                    <>
                      <img src={`http://localhost:3001${avatar_url}?t=${new Date().getTime()}`} alt={first_name} className="w-100 h-100 object-fit-cover" onError={(e) => {
                        e.target.style.display = "none"; const fallback = e.target.parentElement.querySelector(".avatar-fallback");
                        if (fallback) fallback.style.display = "flex";
                      }} />
                      <div className="w-100 h-100 d-none align-items-center justify-content-center avatar-fallback" style={{ display: "none" }}>
                        <span className="text-white fw-bold" style={{ fontSize: 36 }}>
                          {(first_name?.[0] || "").toUpperCase()}
                          {(last_name?.[0] || "").toUpperCase()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-white fw-bold" style={{ fontSize: 36 }}>
                      {(first_name?.[0] || "").toUpperCase()}
                      {(last_name?.[0] || "").toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Ícono editar perfil */}
                <button
                  className="btn btn-light border-0 rounded-circle d-flex align-items-center justify-content-center"
                  onClick={() => setOpenEdit(true)}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  title="Editar perfil"
                >
                  <Edit size={18} className="text-secondary" />
                </button>
              </div>

              {/* Nombre y badges */}
              <div className="mt-3">
                <div className="mb-3">
                  <h1 className="mb-1 fw-bold">
                    {first_name} {last_name}
                  </h1>
                  {position && (
                    <p className="text-muted mb-0 d-flex align-items-center gap-1">
                      <Briefcase size={16} />
                      {position}
                    </p>
                  )}
                </div>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className={`badge ${role === 'admin' ? 'bg-danger' :
                    role === 'moderador' ? 'bg-warning' :
                      role === 'usuario' ? 'bg-primary' :
                        'bg-secondary'
                    } text-uppercase`}>
                    {role}
                  </span>
                  {hierarchy_level && (
                    <span className="badge bg-info text-uppercase">
                      {hierarchy_level}
                    </span>
                  )}
                  <span className={`badge ${status === 'activo' ? 'bg-success' :
                    status === 'inactivo' ? 'bg-danger' :
                      'bg-secondary'
                    } text-uppercase`}>
                    {status}
                  </span>
                </div>

                {/* Contadores */}
                <div className="border-top pt-3">
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <span className="h5 fw-bold mb-0">{eventos.length}</span>
                        <small className="text-muted">Eventos</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <span className="h5 fw-bold mb-0">{publicaciones.length}</span>
                        <small className="text-muted">Publicaciones</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="d-flex flex-column">
                        <span className="h5 fw-bold mb-0">{profile.amigos?.length || 0}</span>
                        <small className="text-muted">Amigos</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {bio && (
                  <div className="mt-3">
                    <p className="text-muted">{bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row g-4 mx-2">
            <div className="col-lg-8 d-flex flex-column gap-4">
              {profile && (<PublicarComponente usuario={profile} onPublicar={manejarNuevaPublicacion} onEventoCreado={manejarNuevoEvento} />)}

              {/* Pestañas de navegación */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 pb-0">
                  <ul className="nav nav-tabs card-header-tabs border-0">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${tabActiva === 'publicaciones' ? 'active text-primary border-primary' : 'text-muted'} border-0 fw-medium`}
                        onClick={() => setTabActiva('publicaciones')}
                      >
                        <FileText size={16} className="me-2" />
                        Publicaciones ({publicaciones.length})
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${tabActiva === 'eventos' ? 'active text-primary border-primary' : 'text-muted'} border-0 fw-medium`}
                        onClick={() => setTabActiva('eventos')}
                      >
                        <Calendar size={16} className="me-2" />
                        Eventos ({eventos.length})
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="card-body">
                  {/* Contenido de Publicaciones */}
                  {tabActiva === 'publicaciones' && (
                    <div>
                      {loadingPublicaciones ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                          </div>
                        </div>
                      ) : errorPublicaciones ? (
                        <div className="text-center py-5">
                          <div className="text-danger mb-3">
                            <FileText size={48} className="opacity-50" />
                          </div>
                          <p className="text-danger mb-2">No se pudieron cargar las publicaciones</p>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={cargarPublicaciones}
                          >
                            Intentar de nuevo
                          </button>
                        </div>
                      ) : publicaciones.length > 0 ? (
                        <div className="d-flex flex-column gap-4">
                          {publicaciones.map((publicacion) => {
                            // console.log('🗂️ [Renderizando] Publicación:', publicacion._id, 'Likes:', publicacion.likes);
                            return (
                              <div key={publicacion._id} className="bg-white rounded-xl border shadow-sm" style={{ borderColor: '#e5e7eb' }}>
                                {/* Header de la publicación */}
                                <div className="p-4 pb-0">
                                  <div className="d-flex align-items-start gap-3">
                                    <img
                                      src={
                                        publicacion.autor?.fotoPerfil
                                          ? `http://localhost:3001${publicacion.autor.fotoPerfil}`
                                          : "/default-avatar.png"
                                      }
                                      alt={publicacion.autor?.primernombreUsuario}
                                      className="rounded-circle"
                                      style={{
                                        width: 40,
                                        height: 40,
                                        objectFit: "cover"
                                      }}
                                    />
                                    <div className="flex-grow-1">
                                      <h6 className="fw-semibold mb-0" style={{ color: '#111827' }}>
                                        {publicacion.autor?.primernombreUsuario}{" "}
                                        {publicacion.autor?.primerapellidoUsuario}
                                      </h6>
                                      <small style={{ fontSize: '12px', color: '#6b7280' }}>
                                        {new Date(publicacion.fechaPublicacion).toLocaleDateString("es-ES", {
                                          day: 'numeric',
                                          month: 'short',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </small>
                                    </div>
                                  </div>
                                </div>

                                {/* Contenido de la publicación */}
                                <div className="px-4 py-3">
                                  {publicacion.titulo && (
                                    <h6 className="fw-bold text-primary mb-2">{publicacion.titulo}</h6>
                                  )}

                                  <div
                                    style={{
                                      fontSize: '15px',
                                      color: '#111827',
                                      lineHeight: '1.5',
                                      whiteSpace: 'pre-line'
                                    }}
                                  >
                                    {publicacion.contenido}
                                  </div>

                                  {/* Multimedia de la publicación */}
                                  {publicacion.multimedia && publicacion.multimedia.length > 0 && (
                                    <div className="mt-3">
                                      {publicacion.multimedia.map((media, index) => (
                                        <div key={index} className="position-relative mb-2">
                                          <img
                                            src={`http://localhost:3001${media.url}`}
                                            alt={`Imagen ${index + 1}`}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {publicacion.imagenes && publicacion.imagenes.length > 0 && (
                                    <div className="mt-3">
                                      <img
                                        src={`http://localhost:3001${publicacion.imagenes[0]}`}
                                        alt="Publicación"
                                        className="img-fluid rounded"
                                        style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                                      />
                                    </div>
                                  )}

                                  {publicacion.videos && publicacion.videos.length > 0 && (
                                    <div className="mt-3">
                                      <video
                                        controls
                                        className="w-100 rounded"
                                        style={{ maxHeight: "400px" }}
                                      >
                                        <source src={`http://localhost:3001${publicacion.videos[0]}`} type="video/mp4" />
                                        Tu navegador no soporta videos.
                                      </video>
                                    </div>
                                  )}
                                </div>

                                {/* Footer con acciones */}
                                <div className="px-4 pt-3 pb-4" style={{ borderTop: '1px solid #e5e7eb' }}>
                                  <div className="d-flex align-items-center gap-4">
                                    {/* Botón Me gusta */}
                                    <button
                                      className={`btn btn-sm d-flex align-items-center gap-2 px-2 py-1 rounded border-0 ${usuarioYaDioLike(publicacion.likes, userId)
                                        ? 'like-button-active'
                                        : 'like-button-inactive'
                                        }`}
                                      onClick={() => {
                                        handleToggleLike(publicacion._id);
                                      }}
                                      disabled={procesandoLike === publicacion._id}
                                      style={{
                                        backgroundColor: usuarioYaDioLike(publicacion.likes, userId)
                                          ? '#f0f9ff !important'
                                          : 'transparent !important',
                                        color: usuarioYaDioLike(publicacion.likes, userId)
                                          ? '#0ea5e9 !important'
                                          : '#4b5563 !important',
                                        border: usuarioYaDioLike(publicacion.likes, userId)
                                          ? '1px solid #e0f2fe !important'
                                          : '1px solid transparent !important',
                                        transition: 'all 0.2s ease',
                                        boxShadow: usuarioYaDioLike(publicacion.likes, userId)
                                          ? '0 1px 3px rgba(14, 165, 233, 0.1)'
                                          : 'none'
                                      }}
                                      onMouseEnter={(e) => {
                                        if (!usuarioYaDioLike(publicacion.likes, userId)) {
                                          e.target.style.backgroundColor = '#f9fafb !important';
                                          e.target.style.color = '#111827 !important';
                                        } else {
                                          e.target.style.backgroundColor = '#e0f2fe !important';
                                          e.target.style.transform = 'scale(1.02)';
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (!usuarioYaDioLike(publicacion.likes, userId)) {
                                          e.target.style.backgroundColor = 'transparent !important';
                                          e.target.style.color = '#4b5563 !important';
                                        } else {
                                          e.target.style.backgroundColor = '#f0f9ff !important';
                                          e.target.style.transform = 'scale(1)';
                                        }
                                      }}
                                      aria-label={`Me gusta. Estado: ${usuarioYaDioLike(publicacion.likes, userId) ? 'activado' : 'desactivado'}. Total: ${contarLikes(publicacion.likes)}`}
                                      aria-pressed={usuarioYaDioLike(publicacion.likes, userId)}
                                    >
                                      {procesandoLike === publicacion._id ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                      ) : (
                                        <ThumbsUp size={16} />
                                      )}
                                      <span style={{ fontSize: '14px' }}>
                                        Me gusta ({contarLikes(publicacion.likes)})
                                      </span>
                                    </button>

                                    {/* Botón Comentar */}
                                    <button
                                      className="btn btn-sm d-flex align-items-center gap-2 px-2 py-1 rounded border-0"
                                      onClick={() => handleMostrarComentarios(publicacion._id)}
                                      style={{
                                        backgroundColor: 'transparent',
                                        color: '#4b5563',
                                        transition: 'color 0.2s ease'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.color = '#111827';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.color = '#4b5563';
                                      }}
                                      aria-label={`Comentar. Total: ${publicacion.comentarios?.length || 0}`}
                                    >
                                      <MessageSquare size={16} />
                                      <span style={{ fontSize: '14px' }}>
                                        Comentar ({publicacion.comentarios?.length || 0})
                                      </span>
                                    </button>
                                  </div>
                                </div>

                                {/* Sección de comentarios expandible */}
                                {mostrandoComentarios === publicacion._id && (
                                  <div className="border-top px-4 py-3" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
                                    {/* Comentarios existentes */}
                                    {publicacion.comentarios && publicacion.comentarios.length > 0 && (
                                      <div className="mb-3">
                                        {agruparComentariosConRespuestas(publicacion.comentarios.filter(comentario => comentario && comentario._id)).map((comentario) => (
                                          <div key={comentario._id}>
                                            {/* Comentario principal */}
                                            <CommentDisplay
                                              comentario={comentario}
                                              onReaction={handleReaccionComentario}
                                              onReply={handleEnviarRespuesta}
                                              publicacionId={publicacion._id}
                                              isReply={false}
                                            />

                                            {/* Respuestas anidadas */}
                                            {comentario.respuestas && comentario.respuestas.length > 0 && (
                                              <div className="ms-4 mt-2 border-start border-2 border-light ps-3">
                                                {comentario.respuestas.map((respuesta) => (
                                                  <CommentDisplay
                                                    key={respuesta._id}
                                                    comentario={respuesta}
                                                    onReaction={handleReaccionComentario}
                                                    publicacionId={publicacion._id}
                                                    isReply={true}
                                                  />
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Nuevo comentario */}
                                    <div className="mt-3">
                                      <CommentEditor
                                        value={nuevoComentario}
                                        onChange={setNuevoComentario}
                                        onSubmit={(comentarioData) => handleEnviarComentario(publicacion._id, comentarioData)}
                                        isLoading={enviandoComentario}
                                        placeholder="Escribe un comentario..."
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-5 text-muted">
                          <FileText size={48} className="mb-3 opacity-50" />
                          <p className="mb-1">No hay publicaciones aún</p>
                          <small>¡Sé el primero en publicar algo!</small>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contenido de Eventos */}
                  {tabActiva === 'eventos' && (
                    <div>
                      {loadingEventos ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando eventos...</span>
                          </div>
                        </div>
                      ) : errorEventos ? (
                        <div className="text-center py-5">
                          <div className="text-danger mb-3">
                            <Calendar size={48} className="opacity-50" />
                          </div>
                          <p className="text-danger mb-2">No se pudieron cargar los eventos</p>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={cargarEventos}
                          >
                            Intentar de nuevo
                          </button>
                        </div>
                      ) : eventos.length > 0 ? (
                        <div className="row g-3">
                          {eventos.map((evento) => (
                            <div key={evento._id} className="col-12">
                              <div className="card border-0 shadow-sm h-100 overflow-hidden">
                                {/* Imagen de portada del evento */}
                                {evento.imagenPortada && evento.tienePortada && (
                                  <div className="position-relative" style={{ height: '200px' }}>
                                    <img
                                      src={`http://localhost:3001${evento.imagenPortada}`}
                                      alt={evento.nombre}
                                      className="w-100 h-100"
                                      style={{ objectFit: 'cover' }}
                                    />
                                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"></div>
                                    <div className="position-absolute bottom-0 start-0 p-3">
                                      <span className="badge bg-primary px-3 py-2 fs-6">
                                        {evento.categoria}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                <div className="card-body">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="card-title fw-bold mb-1 text-truncate">
                                      {evento.nombre}
                                    </h5>
                                    <span className={`badge ${evento.estado === 'publicado' ? 'bg-success' :
                                      evento.estado === 'borrador' ? 'bg-warning' :
                                        evento.estado === 'cancelado' ? 'bg-danger' :
                                          'bg-secondary'
                                      }`}>
                                      {evento.estado}
                                    </span>
                                  </div>

                                  <p className="card-text text-muted small mb-3 text-truncate" style={{ maxHeight: '40px', overflow: 'hidden' }}>
                                    {evento.descripcion}
                                  </p>

                                  <div className="d-flex flex-column gap-2 mb-3">
                                    {/* Fecha y hora */}
                                    <div className="d-flex align-items-center gap-2 text-muted small">
                                      <Calendar size={14} />
                                      <span>
                                        {new Date(evento.fechaInicio).toLocaleDateString('es-ES', {
                                          weekday: 'long',
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    </div>

                                    {/* Hora */}
                                    <div className="d-flex align-items-center gap-2 text-muted small">
                                      <span className="text-primary">🕐</span>
                                      <span>{evento.horaInicio}</span>
                                      {evento.horaFin && <span> - {evento.horaFin}</span>}
                                    </div>

                                    {/* Modalidad */}
                                    <div className="d-flex align-items-center gap-2 text-muted small">
                                      <span className="text-primary">
                                        {evento.tipoModalidad === 'presencial' ? '📍' :
                                          evento.tipoModalidad === 'virtual' ? '💻' : '🌐'}
                                      </span>
                                      <span className="text-capitalize">{evento.tipoModalidad}</span>
                                      {evento.tipoModalidad === 'presencial' && evento.ubicacion?.ciudad && (
                                        <span>- {evento.ubicacion.ciudad}</span>
                                      )}
                                    </div>

                                    {/* Asistentes */}
                                    {evento.asistentesConfirmados > 0 && (
                                      <div className="d-flex align-items-center gap-2 text-muted small">
                                        <Users size={14} />
                                        <span>{evento.asistentesConfirmados} asistentes confirmados</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-primary btn-sm flex-fill"
                                      onClick={() => manejarVerDetallesEvento(evento)}
                                    >
                                      Ver Detalles
                                    </button>
                                    <button
                                      className="btn btn-outline-secondary btn-sm"
                                      onClick={() => manejarEditarEvento(evento)}
                                      title="Editar evento"
                                    >
                                      <Edit size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-5 text-muted">
                          <Calendar size={48} className="mb-3 opacity-50" />
                          <p className="mb-1">No tienes eventos aún</p>
                          <small>¡Crea tu primer evento!</small>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4 d-flex flex-column gap-4">
              <div className="card shadow-sm border-0 mx-2">
                <div className="card-body">
                  <h3 className="h5 mb-3">Información de Contacto</h3>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <Mail size={18} className="text-secondary" />
                      <span>{email}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <MapPin size={18} className="text-secondary" />
                      <span>{city} {city && country ? ", " : ""} {country}</span>
                    </div>
                    {address && (
                      <div className="d-flex align-items-center gap-2">
                        <Briefcase size={18} className="text-secondary" />
                        <span>{address}</span>
                      </div>
                    )}
                    {created_at && (
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={18} className="text-secondary" />
                        <span>Miembro desde {new Date(created_at).toLocaleDateString("es-ES")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {openEdit && (
            <SimpleModal
              open={openEdit}
              onClose={() => setOpenEdit(false)}
              title="Editar Perfil"
            >
              <EditProfileContent
                user={profile}
                onUserUpdate={(updatedUser) => {
                  setProfile(updatedUser);
                  setOpenEdit(false);
                }}
              />
            </SimpleModal>
          )}

          {role === "admin" && (
            <>
              <div className="mt-4">
                <ImageDebugger user={profile} />
              </div>
              <div className="mt-4">
                <ImageUrlTester currentImageUrl={avatar_url} />
              </div>
              <div className="mt-4">
                <SimpleImageTest imageUrl={avatar_url} />
              </div>
              <div className="mt-4">
                <ImageUploadTest />
              </div>
            </>
          )}

          {/* Modal para ver detalles del evento */}
          {mostrarDetallesEvento && eventoSeleccionado && (
            <SimpleModal
              open={mostrarDetallesEvento}
              onClose={cerrarModalesEvento}
              title={`Detalles: ${eventoSeleccionado.nombre}`}
            >
              <DetallesEvento evento={eventoSeleccionado} />
            </SimpleModal>
          )}

          {/* Modal para editar evento */}
          {mostrarEditarEvento && eventoSeleccionado && (
            <SimpleModal
              open={mostrarEditarEvento}
              onClose={cerrarModalesEvento}
              title={`Editar: ${eventoSeleccionado.nombre}`}
            >
              <EditarEvento
                evento={eventoSeleccionado}
                onEventoActualizado={async () => {
                  await cargarEventos();
                  cerrarModalesEvento();
                }}
                onCancelar={cerrarModalesEvento}
              />
            </SimpleModal>
          )}
        </div>
      </div>
    </>
  );
}

function DetallesEvento({ evento }) {
  return (
    <div className="p-3">
      <div className="row mb-4">
        <div className="col-md-8">
          <h4 className="fw-bold mb-3">{evento.nombre}</h4>
          <p className="text-muted mb-3">{evento.descripcion}</p>

          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-3">
              <Calendar size={20} className="text-primary" />
              <div>
                <strong>Fecha:</strong> {new Date(evento.fechaInicio).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span className="text-primary fs-5">🕐</span>
              <div>
                <strong>Hora:</strong> {evento.horaInicio}
                {evento.horaFin && ` - ${evento.horaFin}`}
              </div>
            </div>

            <div className="d-flex align-items-start gap-3">
              <span className="text-primary fs-5">
                {evento.tipoModalidad === 'presencial' ? '📍' :
                  evento.tipoModalidad === 'virtual' ? '💻' : '🌐'}
              </span>
              <div className="flex-grow-1">
                <div><strong>Modalidad:</strong> <span className="text-capitalize">{evento.tipoModalidad}</span></div>

                {evento.tipoModalidad === 'presencial' && (
                  <div className="mt-2">
                    {evento.ubicacion?.direccion && (
                      <div className="text-muted">
                        <strong>Dirección:</strong> {evento.ubicacion.direccion}
                      </div>
                    )}
                    {evento.ubicacion?.ciudad && (
                      <div className="text-muted">
                        <strong>Ciudad:</strong> {evento.ubicacion.ciudad}
                      </div>
                    )}
                    {evento.ubicacion?.estado && (
                      <div className="text-muted">
                        <strong>Estado/Provincia:</strong> {evento.ubicacion.estado}
                      </div>
                    )}
                    {evento.ubicacion?.codigoPostal && (
                      <div className="text-muted">
                        <strong>Código Postal:</strong> {evento.ubicacion.codigoPostal}
                      </div>
                    )}
                  </div>
                )}

                {evento.tipoModalidad === 'virtual' && (
                  <div className="mt-2">
                    {(evento.linkVirtual || evento.enlaceVirtual || evento.enlace || evento.url || evento.link || evento.meetingLink) ? (
                      <>
                        <div className="text-muted">
                          <strong>Enlace de acceso:</strong>
                        </div>
                        <a
                          href={evento.linkVirtual || evento.enlaceVirtual || evento.enlace || evento.url || evento.link || evento.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm mt-1"
                        >
                          🔗 Unirse al evento
                        </a>
                        {evento.plataformaVirtual && (
                          <div className="text-muted mt-1">
                            <small>Plataforma: {evento.plataformaVirtual}</small>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-muted">
                        <small>No se ha configurado enlace para este evento virtual</small>
                      </div>
                    )}
                  </div>
                )}                {evento.tipoModalidad === 'hibrido' && (
                  <div className="mt-2">
                    {evento.ubicacion?.direccion && (
                      <div className="text-muted">
                        <strong>Presencial:</strong> {evento.ubicacion.direccion}
                        {evento.ubicacion.ciudad && `, ${evento.ubicacion.ciudad}`}
                      </div>
                    )}
                    {evento.enlaceVirtual && (
                      <div className="text-muted mt-1">
                        <strong>Virtual:</strong>
                        <a
                          href={evento.enlaceVirtual}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm ms-2"
                        >
                          🔗 Enlace virtual
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {evento.categoria && (
              <div className="d-flex align-items-center gap-3">
                <span className="text-primary fs-5">🏷️</span>
                <div>
                  <strong>Categoría:</strong> {evento.categoria}
                </div>
              </div>
            )}

            {/* Configuración de Privacidad */}
            <div className="d-flex align-items-start gap-3">
              <span className="text-primary fs-5">🔒</span>
              <div className="flex-grow-1">
                <div><strong>Configuración de Privacidad:</strong></div>
                <div className="mt-2">
                  {evento.esPrivado ? (
                    <div className="d-flex flex-column gap-1">
                      <span className="badge bg-warning text-dark">
                        🔐 Evento Privado
                      </span>
                      <small className="text-muted">Solo visible para invitados</small>

                      {evento.requiereAprobacion && (
                        <>
                          <span className="badge bg-info mt-1">
                            ✋ Requiere Aprobación
                          </span>
                          <small className="text-muted">Revisar registros manualmente</small>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-1">
                      <span className="badge bg-success">
                        🌐 Evento Público
                      </span>
                      <small className="text-muted">Visible para todos los usuarios</small>

                      {evento.requiereAprobacion && (
                        <>
                          <span className="badge bg-info mt-1">
                            ✋ Requiere Aprobación
                          </span>
                          <small className="text-muted">Revisar registros manualmente</small>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h6 className="card-title">Estado del Evento</h6>
              <span className={`badge fs-6 px-3 py-2 ${evento.estado === 'publicado' ? 'bg-success' :
                evento.estado === 'borrador' ? 'bg-warning' :
                  evento.estado === 'cancelado' ? 'bg-danger' :
                    'bg-secondary'
                }`}>
                {evento.estado}
              </span>

              {evento.asistentesConfirmados > 0 && (
                <div className="mt-3">
                  <Users size={24} className="text-muted mb-2" />
                  <div className="fw-bold">{evento.asistentesConfirmados}</div>
                  <small className="text-muted">Asistentes confirmados</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditarEvento({ evento, onEventoActualizado, onCancelar }) {
  return (
    <div className="p-3">
      <div className="alert alert-info">
        <strong>Funcionalidad en desarrollo</strong>
        <p className="mb-0">La edición de eventos estará disponible próximamente. Por ahora puedes ver los detalles del evento.</p>
      </div>

      <div className="d-flex gap-2 justify-content-end">
        <button className="btn btn-secondary" onClick={onCancelar}>
          Cerrar
        </button>
        <button className="btn btn-primary" disabled>
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

export default PerfilUser;

