// components/notificacionesBell/ModalNotificaciones.jsx
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Filter, Search, UserPlus, UserCheck, MessageCircle, Calendar } from 'lucide-react';
import NotificacionSolicitudAmistad from './NotificacionSolicitudAmistad';

const ModalNotificaciones = ({ isOpen, onClose }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [filtro, setFiltro] = useState('todas'); // todas, noLeidas, solicitudes, mensajes
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (isOpen) {
      cargarNotificaciones();
    }
  }, [isOpen]);

  const cargarNotificaciones = async () => {
    try {
      setCargando(true);

      // DATOS DE PRUEBA AMPLIADOS
      const notificacionesPrueba = [
        {
          _id: '1',
          mensaje: 'Juan Pérez te envió una solicitud de amistad',
          leida: false,
          createdAt: new Date().toISOString(),
          tipo: 'solicitud_amistad',
          remitenteId: 'user123',
          remitente: {
            primernombreUsuario: 'Juan',
            primerapellidoUsuario: 'Pérez',
            fotoPerfil: '',
            cargoFundacion: 'Voluntario',
            pais: 'Argentina',
            ciudad: 'Buenos Aires'
          }
        },
        {
          _id: '2',
          mensaje: 'María García aceptó tu solicitud de amistad',
          leida: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          tipo: 'amistad_aceptada',
          remitenteId: 'user456',
          remitente: {
            primernombreUsuario: 'María',
            primerapellidoUsuario: 'García',
            fotoPerfil: '',
            cargoFundacion: 'Pastor'
          }
        },
        {
          _id: '3',
          mensaje: 'Carlos López comentó tu publicación: "Excelente reflexión"',
          leida: true,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          tipo: 'comentario',
          remitenteId: 'user789',
          remitente: {
            primernombreUsuario: 'Carlos',
            primerapellidoUsuario: 'López',
            fotoPerfil: ''
          }
        },
        {
          _id: '4',
          mensaje: 'Ana Martínez te envió una solicitud de amistad',
          leida: false,
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          tipo: 'solicitud_amistad',
          remitenteId: 'user101',
          remitente: {
            primernombreUsuario: 'Ana',
            primerapellidoUsuario: 'Martínez',
            fotoPerfil: '',
            cargoFundacion: 'Coordinadora',
            pais: 'Colombia',
            ciudad: 'Bogotá'
          }
        },
        {
          _id: '5',
          mensaje: 'Reunión de líderes programada para mañana a las 15:00',
          leida: true,
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          tipo: 'reunion',
          sistema: true
        },
        {
          _id: '6',
          mensaje: 'Luis Rodriguez te envió un mensaje',
          leida: false,
          createdAt: new Date(Date.now() - 5400000).toISOString(),
          tipo: 'mensaje',
          remitenteId: 'user202',
          remitente: {
            primernombreUsuario: 'Luis',
            primerapellidoUsuario: 'Rodriguez',
            fotoPerfil: ''
          }
        }
      ];

      setNotificaciones(notificacionesPrueba);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      setCargando(false);
    }
  };

  const marcarComoLeida = async (notificacionId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/notificaciones/${notificacionId}/leer`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setNotificaciones(prev => prev.map(n =>
        n._id === notificacionId ? { ...n, leida: true } : n
      ));
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  const responderSolicitud = async (notificacionId, remitenteId, accion) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = accion === 'aceptar'
        ? `http://localhost:3001/api/amigos/aceptar/${remitenteId}`
        : `http://localhost:3001/api/amigos/rechazar/${remitenteId}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setNotificaciones(prev => prev.map(n =>
          n._id === notificacionId
            ? { ...n, leida: true, respondida: true, respuesta: accion }
            : n
        ));
      }
    } catch (error) {
      console.error(`Error ${accion} solicitud:`, error);
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/notificaciones/leer-todas', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  const getIconoNotificacion = (tipo) => {
    switch (tipo) {
      case 'solicitud_amistad':
        return { icon: UserPlus, color: 'text-primary' };
      case 'amistad_aceptada':
        return { icon: UserCheck, color: 'text-success' };
      case 'comentario':
        return { icon: MessageCircle, color: 'text-info' };
      case 'mensaje':
        return { icon: MessageCircle, color: 'text-success' };
      case 'reunion':
        return { icon: Calendar, color: 'text-warning' };
      default:
        return { icon: Bell, color: 'text-secondary' };
    }
  };

  const formatearTiempo = (fecha) => {
    const ahora = new Date();
    const tiempo = new Date(fecha);
    const diferencia = ahora - tiempo;

    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 1) return 'Ahora';
    if (minutos < 60) return `${minutos}m`;
    if (horas < 24) return `${horas}h`;
    return `${dias}d`;
  };

  // Filtrar notificaciones
  const notificacionesFiltradas = notificaciones.filter(notificacion => {
    const coincideBusqueda = !busqueda ||
      notificacion.mensaje.toLowerCase().includes(busqueda.toLowerCase()) ||
      (notificacion.remitente &&
        `${notificacion.remitente.primernombreUsuario} ${notificacion.remitente.primerapellidoUsuario}`
          .toLowerCase().includes(busqueda.toLowerCase()));

    let coincideFiltro = true;
    switch (filtro) {
      case 'noLeidas':
        coincideFiltro = !notificacion.leida;
        break;
      case 'solicitudes':
        coincideFiltro = notificacion.tipo === 'solicitud_amistad';
        break;
      case 'mensajes':
        coincideFiltro = notificacion.tipo === 'mensaje';
        break;
      default:
        coincideFiltro = true;
    }

    return coincideBusqueda && coincideFiltro;
  });

  const contadores = {
    todas: notificaciones.length,
    noLeidas: notificaciones.filter(n => !n.leida).length,
    solicitudes: notificaciones.filter(n => n.tipo === 'solicitud_amistad').length,
    mensajes: notificaciones.filter(n => n.tipo === 'mensaje').length
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center">
              <Bell size={20} className="me-2" />
              Todas las Notificaciones
              {contadores.noLeidas > 0 && (
                <span className="badge bg-danger ms-2">{contadores.noLeidas}</span>
              )}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-0">
            {/* Controles */}
            <div className="p-3 border-bottom bg-light">
              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar notificaciones..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text">
                      <Filter size={14} />
                    </span>
                    <select
                      className="form-select"
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                    >
                      <option value="todas">Todas ({contadores.todas})</option>
                      <option value="noLeidas">No leídas ({contadores.noLeidas})</option>
                      <option value="solicitudes">Solicitudes ({contadores.solicitudes})</option>
                      <option value="mensajes">Mensajes ({contadores.mensajes})</option>
                    </select>
                  </div>
                </div>
              </div>

              {contadores.noLeidas > 0 && (
                <button
                  onClick={marcarTodasComoLeidas}
                  className="btn btn-sm btn-outline-primary"
                >
                  <Check size={14} className="me-1" />
                  Marcar todas como leídas
                </button>
              )}
            </div>

            {/* Lista de notificaciones */}
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {cargando ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : notificacionesFiltradas.length === 0 ? (
                <div className="text-center py-5">
                  <Bell size={48} className="text-muted mb-3" />
                  <h6 className="text-muted">No hay notificaciones</h6>
                  <small className="text-muted">
                    {busqueda || filtro !== 'todas'
                      ? 'No se encontraron notificaciones con los filtros aplicados'
                      : 'No tienes notificaciones'}
                  </small>
                </div>
              ) : (
                <div>
                  {notificacionesFiltradas.map(notificacion => {
                    const { icon: IconComponent, color } = getIconoNotificacion(notificacion.tipo);

                    return (
                      <div
                        key={notificacion._id}
                        className={`p-3 border-bottom ${!notificacion.leida ? 'bg-light' : ''}`}
                      >
                        {notificacion.tipo === 'solicitud_amistad' && !notificacion.respondida ? (
                          <NotificacionSolicitudAmistad
                            notificacionId={notificacion._id}
                            remitenteId={notificacion.remitenteId}
                            remitente={notificacion.remitente}
                            onResponder={responderSolicitud}
                          />
                        ) : (
                          <div
                            className="d-flex cursor-pointer"
                            onClick={() => !notificacion.leida && marcarComoLeida(notificacion._id)}
                          >
                            <div className="me-3">
                              <IconComponent size={20} className={color} />
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <p className="m-0" style={{ fontSize: '14px' }}>
                                    {notificacion.mensaje}
                                  </p>
                                  <small className="text-muted">
                                    {formatearTiempo(notificacion.createdAt)}
                                  </small>
                                </div>
                                {!notificacion.leida && (
                                  <div className="ms-2">
                                    <div
                                      className="bg-primary rounded-circle"
                                      style={{ width: '8px', height: '8px' }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer justify-content-center">
            <small className="text-muted">
              Última actualización: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNotificaciones;
