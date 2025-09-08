// src/pages/PerfilUser.jsx
import React, { useEffect, useState } from "react";
import { MapPin, Calendar, Briefcase, Mail, Users, FileText, Edit } from "lucide-react";
import { EditProfileModal } from "../components/profile/EditProfileModal";
import { EditBasicInfo } from "../components/profile/EditBasicInfo";
import EditContact from "../components/profile/EditContact";
import { EditAvatar } from "../components/profile/EditAvatar";
import { EditBio } from "../components/profile/EditBio";
import { EditPrivacy } from "../components/profile/EditPrivacy";
import { ImageDebugger } from "../components/profile/ImageDebugger";
import { ImageUrlTester } from "../components/profile/ImageUrlTester";
import { SimpleImageTest } from "../components/profile/SimpleImageTest";
import { ImageUploadTest } from "../components/profile/ImageUploadTest";
import { apiFetch } from "../lib/api.js";
import { buildApiUrl, API_CONFIG } from "../lib/config.js";
import { useProfile } from "../context/ProfileContext";
import PublicarComponente from "./PublicarComponente";

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
        <EditAvatar
          currentAvatar={user.fotoPerfil}
          version={user.version}
          onSaved={onUserUpdate}
        />
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
  const [openEdit, setOpenEdit] = useState(false);
  const [tabActiva, setTabActiva] = useState('publicaciones');
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [mostrarDetallesEvento, setMostrarDetallesEvento] = useState(false);
  const [mostrarEditarEvento, setMostrarEditarEvento] = useState(false);

  const cargarPublicaciones = async () => {
    try {
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
      }
    } finally {
      setLoadingPublicaciones(false);
    }
  };

  const cargarEventos = async () => {
    try {
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
      }
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
    console.log('🔄 [PerfilUser] Nueva publicación recibida, recargando lista...');
    await cargarPublicaciones();
    console.log('✅ [PerfilUser] Publicaciones recargadas desde el servidor');
  };

  const manejarNuevoEvento = async (nuevoEvento) => {
    console.log('🔄 [PerfilUser] Nuevo evento creado, recargando lista...');
    await cargarEventos();
    console.log('✅ [PerfilUser] Eventos recargados desde el servidor');
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

  const first_name = profile?.primernombreUsuario || profile?.nombreUsuario || profile?.first_name || "";
  const last_name = profile?.primerapellidoUsuario || profile?.apellidoUsuario || profile?.last_name || "";
  const avatar_url = profile?.fotoPerfil || profile?.avatar_url || "";
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
    <div className="container mt-4">
      {/* Header del perfil */}
      <div className="card shadow-sm border-0 overflow-hidden mb-4">
        <div style={{ height: 128, background: "linear-gradient(90deg, #60a5fa, #3b82f6, #f59e0b)", }} />
        <div className="px-4 px-md-5 pb-4 pb-md-5">
          <div className="d-flex align-items-end gap-3" style={{ marginTop: -64 }}>
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
            <div className="flex-grow-1">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h1 className="mb-1 fw-bold">
                    {first_name} {last_name}
                  </h1>
                  {position && (
                    <p className="text-muted mb-2 d-flex align-items-center gap-1">
                      <Briefcase size={16} />
                      {position}
                    </p>
                  )}
                </div>
                <button
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={() => setOpenEdit(true)}
                >
                  <Edit size={16} />
                  <span>Editar Perfil</span>
                </button>
              </div>
              <div className="d-flex flex-wrap gap-2">
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
            </div>
          </div>
          {bio && (
            <div className="mt-3">
              <p className="text-muted">{bio}</p>
            </div>
          )}
        </div>
      </div>

      <div className="row g-4">
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
                  ) : publicaciones.length > 0 ? (
                    publicaciones.map((publicacion) => (
                      <div key={publicacion._id} className="border-bottom pb-4 mb-4 last-child-no-border">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <img
                            src={
                              publicacion.autor?.fotoPerfil
                                ? `http://localhost:3001${publicacion.autor.fotoPerfil}`
                                : "/default-avatar.png"
                            }
                            alt={publicacion.autor?.primernombreUsuario}
                            className="rounded-circle"
                            style={{ width: 40, height: 40, objectFit: "cover" }}
                          />
                          <div>
                            <strong>
                              {publicacion.autor?.primernombreUsuario}{" "}
                              {publicacion.autor?.primerapellidoUsuario}
                            </strong>
                            <small className="text-muted d-block">
                              {new Date(
                                publicacion.fechaPublicacion
                              ).toLocaleDateString("es-ES")}
                            </small>
                          </div>
                        </div>

                        {publicacion.titulo && (
                          <h6 className="fw-bold text-primary mb-2">{publicacion.titulo}</h6>
                        )}

                        <p className="mb-3">{publicacion.contenido}</p>

                        {publicacion.imagenes &&
                          publicacion.imagenes.length > 0 && (
                            <div className="mb-3">
                              <img
                                src={`http://localhost:3001${publicacion.imagenes[0]}`}
                                alt="Publicación"
                                className="img-fluid rounded shadow-sm"
                                style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
                              />
                            </div>
                          )}

                        {publicacion.videos &&
                          publicacion.videos.length > 0 && (
                            <div className="mb-3">
                              <video
                                src={`http://localhost:3001${publicacion.videos[0]}`}
                                controls
                                className="img-fluid rounded shadow-sm"
                                style={{ maxHeight: "400px", width: "100%" }}
                              >
                                Tu navegador no soporta el elemento de video.
                              </video>
                            </div>
                          )}

                        <div className="d-flex gap-3">
                          <button className="btn btn-sm btn-outline-primary">
                            👍 Me gusta ({publicacion.likes?.length || 0})
                          </button>
                          <button className="btn btn-sm btn-outline-secondary">
                            💬 Comentar ({publicacion.comentarios?.length || 0})
                          </button>
                        </div>
                      </div>
                    ))
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
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="h5 mb-3">Estadísticas</h3>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <span className="text-secondary">Publicaciones</span>
                  </div>
                  <span className="fw-semibold">{publicaciones.length}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={16} className="text-warning" />
                    <span className="text-secondary">Eventos</span>
                  </div>
                  <span className="fw-semibold">{eventos.length}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <Users size={16} className="text-success" />
                    <span className="text-secondary">Amigos</span>
                  </div>
                  <span className="fw-semibold">{profile.amigos?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
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
  );
}

function DetallesEvento({ evento }) {
  return (
    <div className="p-3">
      <div className="row mb-4">
        <div className="col-md-8">
          <h4 className="fw-bold mb-3">{evento.nombre}</h4>
          <p className="text-muted mb-3">{evento.descripcion}</p>          <div className="d-flex flex-column gap-3">
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

