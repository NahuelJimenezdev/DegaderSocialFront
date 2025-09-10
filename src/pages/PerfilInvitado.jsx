import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, ArrowLeft, MapPin, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PerfilInvitado = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 PerfilInvitado montado con userId:', userId);

    // Simular carga de datos del usuario
    const timer = setTimeout(() => {
      setUsuario({
        id: userId,
        nombre: `Usuario ${userId}`,
        primernombreUsuario: `Nombre${userId}`,
        primerapellidoUsuario: `Apellido${userId}`,
        ciudadUsuario: 'Ciudad Ejemplo',
        paisUsuario: 'País Ejemplo'
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [userId]);

  const volver = () => {
    console.log('⬅️ Regresando a la página anterior');
    navigate(-1); // Volver a la página anterior
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando perfil...</span>
          </div>
          <p className="mt-3">Cargando perfil del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header con botón de regreso */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              onClick={volver}
              className="btn btn-outline-secondary btn-sm"
              type="button"
            >
              <ArrowLeft size={16} className="me-1" />
              Volver
            </button>
            <h2 className="h4 mb-0">Perfil de Usuario</h2>
          </div>

          {/* Contenido del perfil */}
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '60px', height: '60px' }}>
                  <User size={30} className="text-white" />
                </div>
                <div>
                  <h5 className="mb-1">✅ Estoy en el perfil de: {usuario.primernombreUsuario}</h5>
                  <p className="text-muted mb-0 d-flex align-items-center gap-2">
                    <MapPin size={16} />
                    {usuario.ciudadUsuario}, {usuario.paisUsuario}
                  </p>
                </div>
              </div>

              <div className="alert alert-success">
                <h6 className="alert-heading">🎉 ¡Navegación Exitosa!</h6>
                <p className="mb-0">
                  La navegación desde AmigosUser funcionó correctamente.
                  Mostrando el perfil del usuario: <strong>{usuario.primernombreUsuario} {usuario.primerapellidoUsuario}</strong>
                </p>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-title">📋 Información de Debug:</h6>
                      <ul className="list-unstyled mb-0">
                        <li><strong>Ruta actual:</strong> /perfilInvitado/{userId}</li>
                        <li><strong>User ID recibido:</strong> {userId}</li>
                        <li><strong>Timestamp:</strong> {new Date().toLocaleString()}</li>
                        <li><strong>Navegación desde:</strong> AmigosUser</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">🔧 Acciones de prueba</h6>
                    </div>
                    <div className="card-body">
                      <button className="btn btn-outline-primary btn-sm me-2 mb-2">
                        <Mail size={14} className="me-1" />
                        Enviar mensaje
                      </button>
                      <button className="btn btn-outline-success btn-sm me-2 mb-2">
                        <Phone size={14} className="me-1" />
                        Llamar
                      </button>
                      <button className="btn btn-outline-info btn-sm mb-2">
                        <User size={14} className="me-1" />
                        Ver perfil completo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilInvitado;
