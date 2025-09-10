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
  MessageCircle,
  Edit
} from "lucide-react";
import BotonAmistadAvanzado from "../components/common/BotonAmistadAvanzado"; // Componente avanzado con diseño personalizado
import { Navbar } from "../components/layout/Navbar"; // IMPORT NAVBAR

function PerfilVisitante() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        console.log('🔍 PerfilVisitante: Cargando usuario con ID:', id);
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:3001/api/usuarios/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('📡 PerfilVisitante: Response status:', response.status);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ PerfilVisitante: Datos recibidos:', data);

        if (data.usuario) {
          setUsuario(data.usuario);
          console.log('👤 PerfilVisitante: Usuario cargado:', data.usuario.primernombreUsuario, data.usuario.primerapellidoUsuario);
        } else if (data) {
          setUsuario(data);
          console.log('👤 PerfilVisitante: Usuario cargado (formato alternativo):', data.primernombreUsuario, data.primerapellidoUsuario);
        } else {
          setError("Usuario no encontrado");
        }
      } catch (err) {
        console.error('❌ PerfilVisitante: Error al cargar usuario:', err);
        setError(err.message || "Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log('🚀 PerfilVisitante: Iniciando carga para ID:', id);
      fetchUsuario();
    } else {
      console.warn('⚠️ PerfilVisitante: No se recibió ID de usuario');
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
    <>
      {/* NAVBAR STANDALONE */}
      <Navbar />

      {/* CONTENIDO SIN MAINLAYOUT */}
      <div className="container-fluid p-3">
        {/* Botón volver */}
        <div className="mb-3">
          <button
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="me-2" />
            Volver
          </button>
        </div>

        {/* Header del perfil completo */}
        <div className="card shadow-sm border-0 overflow-hidden mb-4">
          {/* Banner */}
          <div
            style={{
              height: 180,
              background: "linear-gradient(90deg, #60a5fa, #3b82f6, #f59e0b)",
              borderRadius: '12px 12px 0 0'
            }}
          />

          <div className="px-4 px-md-5 pb-4">
            {/* Foto de perfil y botones de acción */}
            <div className="d-flex align-items-end justify-content-between" style={{ marginTop: -80 }}>
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

              {/* Botones de acción - solo si NO es perfil propio */}
              {!isOwnProfile() && (
                <div className="d-flex gap-2">
                  {/* Botón Amistad Avanzado - Responsivo */}
                  <div className="position-relative">
                    {/* Versión móvil - Solo icono circular/rectangular según estado */}
                    <div className="d-md-none">
                      <BotonAmistadAvanzado
                        usuarioId={id}
                        mostrarTexto={false}
                        style={{
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </div>

                    {/* Versión desktop - Con texto */}
                    <div className="d-none d-md-block">
                      <BotonAmistadAvanzado
                        usuarioId={id}
                        mostrarTexto={true}
                      />
                    </div>
                  </div>

                  {/* Botón Mensaje - Solo visible en desktop */}
                  <button
                    className="btn btn-outline-primary d-none d-md-flex align-items-center gap-2"
                    onClick={handleSendMessage}
                    style={{
                      borderRadius: 8,
                      padding: '8px 16px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <MessageCircle size={16} />
                    <span>Mensaje</span>
                  </button>
                </div>
              )}

              {/* Ícono editar perfil - solo si es perfil propio */}
              {isOwnProfile() && (
                <button
                  className="btn btn-light border-0 rounded-circle d-flex align-items-center justify-content-center"
                  onClick={() => navigate('/perfil/editar')}
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
              )}
            </div>

            {/* Información del usuario */}
            <div className="mt-3">
              <div>
                <h1 className="mb-1 fw-bold">
                  {first_name} {last_name}
                </h1>
                {position && (
                  <p className="text-muted mb-0 d-flex align-items-center gap-1">
                    <Briefcase size={16} />
                    {position}
                  </p>
                )}
                <div className="mt-2">
                  <span className={`badge ${roleBadgeClass} text-uppercase`}>
                    {role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mx-2">
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
    </>
  );
}

export default PerfilVisitante;