// src/pages/PerfilUser.jsx
import React, { useEffect, useState } from "react";
import { MapPin, Calendar, Briefcase, Mail, Users, FileText, Edit } from "lucide-react";
import { EditProfileModal } from "../components/profile/EditProfileModal";
import { ImageDebugger } from "../components/profile/ImageDebugger";
import { ImageUrlTester } from "../components/profile/ImageUrlTester";
import { SimpleImageTest } from "../components/profile/SimpleImageTest";
import { ImageUploadTest } from "../components/profile/ImageUploadTest";
import { apiFetch } from "../lib/api.js";
import { buildApiUrl, API_CONFIG } from "../lib/config.js";
import { useProfile } from "../context/ProfileContext.jsx";
import PublicarComponente from "./PublicarComponente.jsx";

function SimpleModal({ open, onClose, title = "Editar Perfil", children }) {
  if (!open) return null;
  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1055, }} onClick={onClose} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(720px, 95vw)", maxHeight: "85vh", overflow: "auto", zIndex: 1060, background: "#fff", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,.25)", }}>
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
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPublicaciones, setLoadingPublicaciones] = useState(true);
  const [err, setErr] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
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

    if (profile) cargarPublicaciones();
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
        } catch (e) {
          if (e.name !== "AbortError") setErr(e.message || "Error al cargar");
        } finally {
          setLoadingUser(false);
        }
      })();
      return () => ac.abort();
    } else {
      setLoadingUser(false);
    }
  }, [profile, setProfile]);

  const manejarNuevaPublicacion = (nuevaPublicacion) => {
    setPublicaciones([nuevaPublicacion, ...publicaciones]);
  };

  const first_name = profile?.primernombreUsuario || profile?.nombreUsuario || profile?.first_name || "";
  const last_name = profile?.primerapellidoUsuario || profile?.apellidoUsuario || profile?.last_name || "";
  const avatar_url = profile?.fotoPerfil || profile?.avatar_url || "";
  const position = profile?.position || profile?.cargo || "";
  const role = (profile?.rolUsuario || profile?.role || "visitante")?.toString().toLowerCase();
  const status = (profile?.status || profile?.estado || "activo")?.toString().toLowerCase();
  const hierarchy_level = profile?.hierarchy_level || profile?.jerarquiaUsuario || "";
  const bio = profile?.biografia || "";
  const email = profile?.correoUsuario || "";
  const city = profile?.city || profile?.ciudadUsuario || "";
  const country = profile?.country || profile?.paisUsuario || "";
  const address = profile?.address || profile?.direccionUsuario || "";
  const created_at = profile?.created_at || profile?.createdAt || profile?.fechaCreacion;

  const roleBadgeClass = (() => {
    switch (role) {
      case "admin":
        return "bg-danger-subtle text-danger-emphasis";
      case "director":
        return "bg-primary-subtle text-primary-emphasis";
      case "subdirector":
        return "bg-info-subtle text-info-emphasis";
      case "encargado":
        return "bg-success-subtle text-success-emphasis";
      case "profesional":
        return "bg-indigo text-white";
      default:
        return "bg-secondary-subtle text-secondary-emphasis";
    }
  })();

  const statusBadgeClass = (() => {
    switch (status) {
      case "activo":
        return "bg-success-subtle text-success-emphasis";
      case "inactivo":
        return "bg-danger-subtle text-danger-emphasis";
      case "pendiente":
        return "bg-warning-subtle text-warning-emphasis";
      default:
        return "bg-secondary-subtle text-secondary-emphasis";
    }
  })();

  if (loadingUser) {
    return (
      <div className="container my-4" style={{ maxWidth: "64rem" }}>
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="placeholder-wave">
              <span className="placeholder col-4 me-2"></span>
              <span className="placeholder col-6"></span>
              <div className="mt-3">
                <span className="placeholder col-8 me-2"></span>
                <span className="placeholder col-3"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container my-4" style={{ maxWidth: "64rem" }}>
        <div className="alert alert-danger mb-0" role="alert">
          Error: {err}
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="container my-4" style={{ maxWidth: "64rem" }}>
      <div className="card shadow-sm border-0 overflow-hidden mb-4">
        <div style={{ height: 128, background: "linear-gradient(90deg, #60a5fa, #3b82f6, #f59e0b)", }} />
        <div className="px-4 px-md-5 pb-4 pb-md-5">
          <div className="d-flex align-items-end gap-3" style={{ marginTop: -64 }} >
            <div className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden border border-4 border-white shadow" style={{ width: 128, height: 128, background: "linear-gradient(135deg,#60a5fa,#fbbf24)", }} >
              {avatar_url ? (
                <>
                  <img src={`http://localhost:3001${avatar_url}?t=${new Date().getTime()}`} alt={first_name} className="w-100 h-100 object-fit-cover" onError={(e) => {
                    e.target.style.display = "none"; const fallback = e.target.parentElement.querySelector(".avatar-fallback");
                    if (fallback) fallback.style.display = "flex";
                  }} />
                  <div className="w-100 h-100 d-none align-items-center justify-content-center avatar-fallback" style={{ display: "none" }} >
                    <span className="text-white fw-bold" style={{ fontSize: 36 }} >
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

            <div className="flex-grow-1 mt-4">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <h1 className="h2 mb-1">
                    {first_name} {last_name}
                  </h1>
                  <p className="text-secondary mb-2">{position}</p>
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge rounded-pill ${statusBadgeClass} text-capitalize`} >
                      {status}
                    </span>
                    <span className={`badge rounded-pill ${roleBadgeClass} text-capitalize`} >
                      {role}
                    </span>
                    <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis text-capitalize">
                      Nivel {hierarchy_level}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={() => setOpenEdit(true)}
                >
                  <Edit size={16} />
                  <span>Editar Perfil</span>
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-12 mt-3 d-flex flex-column gap-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h3 className="h5 mb-3">Acerca de</h3>
                {bio ? (
                  <p className="mb-0">{bio}</p>
                ) : (
                  <p className="fst-italic text-secondary mb-0 text-justify">
                    Lorem Ipsum es simplemente el texto de relleno de las
                    imprentas y archivos de texto. Lorem Ipsum ha sido el texto
                    de relleno estándar de las industrias desde el año 1500.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8 d-flex flex-column gap-4">
          {profile && (<PublicarComponente usuario={profile} onPublicar={manejarNuevaPublicacion} />)}
          <div>
            <h3 className="h5 mb-3">Publicaciones</h3>
            {publicaciones.length > 0 ? (
              publicaciones.map((publicacion) => (
                <div key={publicacion._id} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <img
                        src={
                          publicacion.autor?.fotoPerfil
                            ? `http://localhost:3001${publicacion.autor.fotoPerfil}`
                            : "/default-avatar.png"
                        }
                        alt={publicacion.autor?.primernombreUsuario}
                        className="rounded-circle"
                        style={{
                          width: "32px",
                          height: "32px",
                          objectFit: "cover",
                        }}
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
                      <h6 className="card-title">{publicacion.titulo}</h6>
                    )}

                    <p className="card-text">{publicacion.contenido}</p>

                    {publicacion.imagenes &&
                      publicacion.imagenes.length > 0 && (
                        <div className="mt-2">
                          <img
                            src={`http://localhost:3001${publicacion.imagenes[0]}`}
                            alt="Publicación"
                            className="img-fluid rounded"
                            style={{ maxHeight: "300px" }}
                          />
                        </div>
                      )}

                    <div className="d-flex gap-3 mt-3">
                      <button className="btn btn-sm btn-outline-primary">
                        Me gusta ({publicacion.likes?.length || 0})
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        Comentar ({publicacion.comentarios?.length || 0})
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted">
                <p>No hay publicaciones aún</p>
                <small>¡Sé el primero en publicar algo!</small>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4 d-flex flex-column gap-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="h5 mb-3">Estadísticas</h3>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <Users size={16} className="text-primary" />
                    <span className="text-secondary">Amigos</span>
                  </div>
                  <span className="fw-semibold">
                    {profile.amigos?.length || 0}
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <FileText size={16} className="text-success" />
                    <span className="text-secondary">Publicaciones</span>
                  </div>
                  <span className="fw-semibold">{publicaciones.length}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <MapPin size={16} className="text-warning" />
                    <span className="text-secondary">Grupos</span>
                  </div>
                  <span className="fw-semibold">
                    {profile.grupos?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="h5 mb-3">Acciones Rápidas</h3>
              <div className="d-grid gap-2">
                <button className="btn btn-light text-start">
                  Ver mis publicaciones
                </button>
                <button className="btn btn-light text-start">
                  Gestionar carpetas
                </button>
                <button className="btn btn-light text-start">
                  Configuración de privacidad
                </button>
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
                  <span> {city} {city && country ? ", " : ""} {country} </span>
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
                    <span> Miembro desde{" "} {new Date(created_at).toLocaleDateString("es-ES")} </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={profile}
        onUserUpdate={(updatedUser) => {
          setProfile(updatedUser);
          setOpenEdit(false);
        }}
      />

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
    </div>
  );
}
export default PerfilUser;
