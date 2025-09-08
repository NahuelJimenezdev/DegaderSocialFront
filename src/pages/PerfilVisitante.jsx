import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Briefcase,
  Mail,
  Users,
  FileText,
  ArrowLeft,
  MessageCircle
} from "lucide-react";
import BotonAmistad from "../components/common/BotonAmistad";// Usar el componente que se sincroniza

function PerfilVisitante() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:3001/api/usuariosInicios/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.usuario) {
          setUsuario(data.usuario);
        } else if (data) {
          setUsuario(data);
        } else {
          setError("Usuario no encontrado");
        }
      } catch (err) {
        setError(err.message || "Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUsuario();
    }
  }, [id]);

  const handleSendMessage = () => {
    navigate(`/mensajes/${id}`);
  };

  // Verificar si el usuario está viendo su propio perfil
  const isOwnProfile = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // Decodificar token para obtener userId (simplificado)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentUserId = payload.idUsuario || payload.id || payload._id || payload.userId;
      return currentUserId === id;
    } catch (error) {
      console.error('Error verificando usuario propio:', error);
      return false;
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="container my-4" style={{ maxWidth: "64rem" }}>
        <div className="alert alert-danger mb-0" role="alert">
          Error: {error}
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="me-2" />
          Volver atrás
        </button>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="container my-4" style={{ maxWidth: "64rem" }}>
        <div className="alert alert-warning mb-0" role="alert">
          Usuario no encontrado
        </div>
      </div>
    );
  }

  const first_name = usuario?.primernombreUsuario || "";
  const last_name = usuario?.primerapellidoUsuario || "";
  const avatar_url = usuario?.fotoPerfil || "";
  const position = usuario?.position || usuario?.cargo || "";
  const role = (usuario?.rolUsuario || "visitante").toString().toLowerCase();
  const bio = usuario?.biografia || "";
  const email = usuario?.correoUsuario || "";
  const city = usuario?.ciudadUsuario || "";
  const country = usuario?.paisUsuario || "";
  const address = usuario?.direccionUsuario || "";
  const created_at = usuario?.fechaCreacion || usuario?.createdAt;

  const roleBadgeClass = (() => {
    switch (role) {
      case "admin": return "bg-danger-subtle text-danger-emphasis";
      case "director": return "bg-primary-subtle text-primary-emphasis";
      case "subdirector": return "bg-info-subtle text-info-emphasis";
      case "encargado": return "bg-success-subtle text-success-emphasis";
      case "profesional": return "bg-indigo text-white";
      default: return "bg-secondary-subtle text-secondary-emphasis";
    }
  })();

  return (
    <div className="container my-4" style={{ maxWidth: "64rem" }}>
      <button
        className="btn btn-outline-secondary mb-3 d-flex align-items-center"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} className="me-2" />
        Volver
      </button>

      <div className="card shadow-sm border-0 overflow-hidden mb-4">
        <div
          style={{
            height: 128,
            background: "linear-gradient(90deg, #60a5fa, #3b82f6, #f59e0b)",
          }}
        />
        <div className="px-4 px-md-5 pb-4 pb-md-5">
          <div className="d-flex align-items-end gap-3" style={{ marginTop: -64 }}>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden border border-4 border-white shadow"
              style={{
                width: 128,
                height: 128,
                background: "linear-gradient(135deg,#60a5fa,#fbbf24)",
              }}
            >
              {avatar_url ? (
                <img
                  src={`http://localhost:3001${avatar_url}?t=${new Date().getTime()}`}
                  alt={first_name}
                  className="w-100 h-100 object-fit-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.nextSibling;
                    if (fallback && fallback.style) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div
                className="w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ display: avatar_url ? 'none' : 'flex' }}
              >
                <span className="text-white fw-bold" style={{ fontSize: 36 }}>
                  {(first_name?.[0] || "").toUpperCase()}
                  {(last_name?.[0] || "").toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex-grow-1 mt-4">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <h1 className="h2 mb-1">
                    {first_name} {last_name}
                  </h1>
                  <p className="text-secondary mb-2">{position}</p>
                  <span className={`badge rounded-pill ${roleBadgeClass} text-capitalize`}>
                    {role}
                  </span>
                </div>

                <div className="d-flex gap-2">
                  {/* Solo mostrar botones de amistad y mensaje si NO es el perfil propio */}
                  {!isOwnProfile() && (
                    <>
                      <BotonAmistad
                        usuarioId={id}
                        className="btn-custom-friendship"
                      />

                      <button
                        className="btn btn-outline-primary d-flex align-items-center gap-2"
                        onClick={handleSendMessage}
                      >
                        <MessageCircle size={16} />
                        <span>Mensaje</span>
                      </button>
                    </>
                  )}

                  {/* Si es el perfil propio, mostrar botón de editar */}
                  {isOwnProfile() && (
                    <button
                      className="btn btn-primary d-flex align-items-center gap-2"
                      onClick={() => navigate('/perfil/editar')}
                    >
                      <span>Editar Perfil</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8 d-flex flex-column gap-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="h5 mb-3">Acerca de</h3>
              {bio ? (
                <p className="mb-0">{bio}</p>
              ) : (
                <p className="fst-italic text-secondary mb-0">
                  No hay biografía disponible
                </p>
              )}
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="h5 mb-3">Información de Contacto</h3>
              <div className="d-flex flex-column gap-2">
                {email && (
                  <div className="d-flex align-items-center gap-2">
                    <Mail size={18} className="text-secondary" />
                    <span>{email}</span>
                  </div>
                )}
                {(city || country) && (
                  <div className="d-flex align-items-center gap-2">
                    <MapPin size={18} className="text-secondary" />
                    <span>
                      {city}
                      {city && country ? ", " : ""}
                      {country}
                    </span>
                  </div>
                )}
                {address && (
                  <div className="d-flex align-items-center gap-2">
                    <Briefcase size={18} className="text-secondary" />
                    <span>{address}</span>
                  </div>
                )}
                {created_at && (
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={18} className="text-secondary" />
                    <span>
                      Miembro desde{" "}
                      {new Date(created_at).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="h5 mb-3">Estadísticas</h3>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <Users size={16} className="text-primary" />
                    <span className="text-secondary">Amigos</span>
                  </div>
                  <span className="fw-semibold">{usuario.amigos?.length || 0}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <FileText size={16} className="text-success" />
                    <span className="text-secondary">Publicaciones</span>
                  </div>
                  <span className="fw-semibold">{usuario.publicaciones?.length || 0}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <MapPin size={16} className="text-warning" />
                    <span className="text-secondary">Grupos</span>
                  </div>
                  <span className="fw-semibold">{usuario.grupos?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilVisitante;