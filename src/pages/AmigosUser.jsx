import React, { useState, useEffect } from 'react';
import { Users, MapPin, UserCheck, UserX, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AmigosUser.css';

const AmigosUser = () => {
  const [amigos, setAmigos] = useState([]);
  const [totalAmigos, setTotalAmigos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Función para navegar al perfil del amigo
  const irAlPerfil = (amigoId) => {
    console.log('🔄 Navegando al perfil del usuario:', amigoId);
    console.log('📍 Ruta de destino:', `/perfil/${amigoId}`);
    navigate(`/perfil/${amigoId}`);
  };

  const cargarAmigos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/amigos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('📊 Datos recibidos del backend:', data);
      if (response.ok) {
        setAmigos(data.amigos || []);
        setTotalAmigos(data.totalAmigos || 0);
        console.log('✅ Total amigos del usuario:', data.totalAmigos);
        console.log('👥 Amigos con sus contadores:', data.amigos?.map(a => ({
          nombre: `${a.primernombreUsuario} ${a.primerapellidoUsuario}`,
          cantidadAmigos: a.cantidadAmigos,
          amigosEnComun: a.amigosEnComun
        })));
      } else {
        setError(data.error || 'Error al cargar amigos');
      }
    } catch (error) {
      console.error('Error cargando amigos:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAmigos();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="loading-container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted h5">Cargando tus amigos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (amigos.length === 0) {
    return (
      <div className="container-fluid py-4">
        <div className="empty-state">
          <Users size={64} className="text-muted mb-3 opacity-50" />
          <h4 className="text-muted mb-2">No tienes amigos agregados</h4>
          <p className="text-muted">Comienza a conectar con otros miembros de la comunidad</p>
          <button className="btn btn-primary mt-3">
            Buscar amigos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h1 className="fw-bold mb-2 d-flex align-items-center" style={{ color: '#2c3e50', fontSize: '2rem' }}>
                Mis Amigos
                <span className="badge bg-success ms-3" style={{ fontSize: '0.75rem' }}>
                  {totalAmigos}
                </span>
              </h1>
              <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
                Tu red de contactos en la comunidad
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-2 g-md-3">
        {amigos.map((amigo) => (
          <div key={amigo._id} className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div
              className="card amigos-card clickable-card"
              onClick={() => irAlPerfil(amigo._id)}
              role="button"
              tabIndex={0}
            >
              <div className="row g-0 h-100 align-items-center">
                {/* Columna de la imagen - Más pequeña en mobile */}
                <div className="col-3 col-md-3 d-flex align-items-center justify-content-center p-2 p-md-3">
                  <div className="position-relative">
                    <img
                      src={amigo.fotoPerfil ? `http://localhost:3001${amigo.fotoPerfil}` : '/default-avatar.png'}
                      alt={`${amigo.primernombreUsuario} ${amigo.primerapellidoUsuario}`}
                      className="amigos-avatar rounded-3 object-fit-cover"
                    />
                    {/* Indicador de estado */}
                    <span
                      className={`position-absolute bottom-0 end-0 badge rounded-pill status-indicator ${amigo.estadoUsuario === 'activo' ? 'bg-success' : 'bg-secondary'
                        }`}
                    >
                      {amigo.estadoUsuario === 'activo' ? (
                        <UserCheck size={8} />
                      ) : (
                        <UserX size={8} />
                      )}
                    </span>
                  </div>
                </div>

                {/* Columna del contenido - Más espacio */}
                <div className="col-9 col-md-9 d-flex align-items-center">
                  <div className="card-body p-2 p-md-3 w-100">
                    <div>
                      {/* Nombre completo - Más compacto */}
                      <div className="mb-1 mb-md-2">
                        <h6 className="card-title mb-0 fw-bold text-truncate">
                          {amigo.primernombreUsuario} {amigo.primerapellidoUsuario}
                        </h6>
                        {amigo.segundonombreUsuario && (
                          <small className="text-muted d-none d-md-block text-truncate">
                            {amigo.segundonombreUsuario} {amigo.segundoapellidoUsuario}
                          </small>
                        )}
                      </div>

                      {/* Ubicación - Información de país y ciudad */}
                      <div className="mb-1 mb-md-2">
                        <div className="d-flex align-items-center gap-1 text-muted">
                          <MapPin size={12} />
                          <small className="text-truncate" style={{ fontSize: '0.75rem' }}>
                            {amigo.ciudadUsuario && amigo.paisUsuario
                              ? `${amigo.ciudadUsuario}, ${amigo.paisUsuario}`
                              : amigo.ciudadUsuario || amigo.paisUsuario || 'Sin ubicación'
                            }
                          </small>
                        </div>
                      </div>

                      {/* Cantidad de amigos y amigos en común */}
                      <div className="mb-1 mb-md-2">
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {amigo.cantidadAmigos || 0} amigos
                          {amigo.amigosEnComun > 0 && (
                            <span className="text-success ms-2">
                              • {amigo.amigosEnComun} en común
                            </span>
                          )}
                        </small>
                      </div>

                      {/* Estado de usuario */}
                      <div className="mb-1">
                        <small className={`fw-semibold ${amigo.estadoUsuario === 'activo' ? 'text-success' : 'text-secondary'
                          }`} style={{ fontSize: '0.7rem' }}>
                          {amigo.estadoUsuario === 'activo' ? '● En línea' : '● Desconectado'}
                        </small>
                      </div>
                    </div>

                    {/* Botones de contacto - Solo en hover o desktop */}
                    {(amigo.correoUsuario || amigo.celularUsuario) && (
                      <div className="contact-actions d-none d-md-block mt-2">
                        <div className="d-flex gap-1">
                          {amigo.correoUsuario && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`mailto:${amigo.correoUsuario}`, '_blank');
                              }}
                              className="btn btn-outline-primary contact-btn-sm"
                              title="Enviar email"
                            >
                              <Mail size={10} />
                            </button>
                          )}
                          {amigo.celularUsuario && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${amigo.celularUsuario}`, '_blank');
                              }}
                              className="btn btn-outline-success contact-btn-sm"
                              title="Llamar"
                            >
                              <Phone size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Margen inferior para separar del footer */}
      <div className="amigos-bottom-margin"></div>
    </div>
  );
};

export default AmigosUser;