import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock } from 'lucide-react';

const SolicitudesChat = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      // Aquí iría la llamada real a la API de solicitudes
      // const response = await fetch('/api/amigos/solicitudes/recibidas');
      // const data = await response.json();

      // Datos simulados
      const solicitudesSimuladas = [
        {
          _id: '1',
          solicitante: {
            _id: '3',
            primernombreUsuario: 'María',
            primerapellidoUsuario: 'González',
            fotoPerfil: '',
            ciudadUsuario: 'Buenos Aires'
          },
          fechaSolicitud: new Date(Date.now() - 1000 * 60 * 30),
          estado: 'pendiente'
        },
        {
          _id: '2',
          solicitante: {
            _id: '4',
            primernombreUsuario: 'Carlos',
            primerapellidoUsuario: 'Rodríguez',
            fotoPerfil: '',
            ciudadUsuario: 'Córdoba'
          },
          fechaSolicitud: new Date(Date.now() - 1000 * 60 * 60 * 2),
          estado: 'pendiente'
        }
      ];

      setSolicitudes(solicitudesSimuladas);
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const aceptarSolicitud = async (solicitudId) => {
    try {
      // Aquí iría la llamada real a la API
      // const response = await fetch(`/api/amigos/solicitudes/${solicitudId}/aceptar`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });

      // Simular aceptación
      setSolicitudes(prev =>
        prev.filter(solicitud => solicitud._id !== solicitudId)
      );

      console.log('Solicitud aceptada:', solicitudId);
    } catch (error) {
      console.error('Error aceptando solicitud:', error);
    }
  };

  const rechazarSolicitud = async (solicitudId) => {
    try {
      // Aquí iría la llamada real a la API
      // const response = await fetch(`/api/amigos/solicitudes/${solicitudId}/rechazar`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // });

      // Simular rechazo
      setSolicitudes(prev =>
        prev.filter(solicitud => solicitud._id !== solicitudId)
      );

      console.log('Solicitud rechazada:', solicitudId);
    } catch (error) {
      console.error('Error rechazando solicitud:', error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const solicitudDate = new Date(date);
    const diffInHours = Math.floor((now - solicitudDate) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Hace menos de 1h';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="solicitudes-loading">
        <Clock size={24} />
        <span>Cargando solicitudes...</span>
      </div>
    );
  }

  return (
    <div className="solicitudes-container">
      {solicitudes.length === 0 ? (
        <div className="solicitudes-empty">
          <UserCheck size={48} />
          <h3>No hay solicitudes pendientes</h3>
          <p>Cuando alguien te envíe una solicitud de amistad, aparecerá aquí</p>
        </div>
      ) : (
        <div className="solicitudes-list">
          <div className="solicitudes-header">
            <h3>Solicitudes de amistad</h3>
            <span className="solicitudes-count">{solicitudes.length}</span>
          </div>

          {solicitudes.map((solicitud) => (
            <div key={solicitud._id} className="solicitud-item">
              <div className="solicitud-avatar">
                {solicitud.solicitante.fotoPerfil ? (
                  <img src={solicitud.solicitante.fotoPerfil} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {solicitud.solicitante.primernombreUsuario[0]}
                  </div>
                )}
              </div>

              <div className="solicitud-info">
                <div className="solicitud-header">
                  <span className="solicitud-nombre">
                    {solicitud.solicitante.primernombreUsuario} {solicitud.solicitante.primerapellidoUsuario}
                  </span>
                  <span className="solicitud-tiempo">
                    {formatTime(solicitud.fechaSolicitud)}
                  </span>
                </div>

                <div className="solicitud-location">
                  <span>{solicitud.solicitante.ciudadUsuario}</span>
                </div>

                <div className="solicitud-actions">
                  <button
                    className="solicitud-btn accept"
                    onClick={() => aceptarSolicitud(solicitud._id)}
                  >
                    <UserCheck size={16} />
                    Aceptar
                  </button>
                  <button
                    className="solicitud-btn reject"
                    onClick={() => rechazarSolicitud(solicitud._id)}
                  >
                    <UserX size={16} />
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SolicitudesChat;
