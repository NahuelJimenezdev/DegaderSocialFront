// components/NotificacionesBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, UserPlus, UserCheck, X, Clock, MoreHorizontal } from 'lucide-react';
import SolicitudAmistad from './SolicitudAmistad';
import ModalNotificaciones from './ModalNotificaciones';
import { notificacionesAPI, amistadesAPI } from '../../lib/apiNotificaciones';
import { useAmistadEvents } from '../../hooks/useGlobalEvents';

const NotificacionesBell = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(true);
  const menuRef = useRef(null);

  // Hooks para eventos globales
  const { emitSolicitudRespondida, emitAmistadActualizada, emitNotificacionLeida } = useAmistadEvents();

  const cargarContador = async () => {
    try {
      const data = await notificacionesAPI.obtenerContador();
      setNoLeidas(data.count || 0);
    } catch (error) {
      console.error('Error cargando contador:', error);
      // En caso de error, usar datos de prueba
      setNoLeidas(3);
    }
  };

  const cargarNotificaciones = async () => {
    try {
      console.log('🔄 Cargando notificaciones desde API...');
      setCargando(true);

      // Cargar notificaciones reales
      const data = await notificacionesAPI.obtenerNotificaciones({
        limit: 10,
        soloNoLeidas: false
      });

      if (data.success && data.data) {
        // Transformar datos de la API al formato esperado por el frontend
        const notificacionesTransformadas = data.data.map(notif => {
          // Extraer el ID del remitente correctamente
          let remitenteIdString;
          if (typeof notif.remitenteId === 'string') {
            remitenteIdString = notif.remitenteId;
          } else if (notif.remitenteId?._id) {
            remitenteIdString = notif.remitenteId._id;
          } else if (notif.datos?.remitenteInfo?._id) {
            remitenteIdString = notif.datos.remitenteInfo._id;
          } else {
            console.warn('No se pudo extraer remitenteId de:', notif);
            remitenteIdString = null;
          }

          return {
            ...notif,
            remitenteId: remitenteIdString, // Asegurar que sea un string
            remitente: notif.remitenteId || notif.datos?.remitenteInfo
          };
        });

        setNotificaciones(notificacionesTransformadas);
        console.log('✅ Notificaciones cargadas desde API:', notificacionesTransformadas.length);
        console.log('🔍 DEBUGEANDO NOTIFICACIONES:', notificacionesTransformadas.map(n => ({
          _id: n._id,
          tipo: n.tipo,
          remitenteId: n.remitenteId,
          datos: n.datos,
          remitente: n.remitente
        })));
      } else {
        console.log('ℹ️ No hay notificaciones disponibles');
        setNotificaciones([]);
      }

      // Cargar también solicitudes pendientes como notificaciones si no hay notificaciones
      if (data.data.length === 0) {
        try {
          const solicitudesData = await amistadesAPI.obtenerSolicitudesRecibidas();
          if (solicitudesData.success && solicitudesData.solicitudes.length > 0) {
            // Convertir solicitudes pendientes en notificaciones
            const notificacionesSolicitudes = solicitudesData.solicitudes.map(solicitud => ({
              _id: `solicitud_${solicitud._id}`,
              mensaje: `${solicitud.primernombreUsuario || 'Usuario'} ${solicitud.primerapellidoUsuario || ''} te envió una solicitud de amistad`,
              leida: false,
              createdAt: solicitud.createdAt || new Date().toISOString(),
              tipo: 'solicitud_amistad',
              remitenteId: solicitud._id,
              remitente: {
                primernombreUsuario: solicitud.primernombreUsuario,
                primerapellidoUsuario: solicitud.primerapellidoUsuario,
                fotoPerfil: solicitud.fotoPerfil,
                cargoFundacion: solicitud.cargoFundacion || 'Miembro',
                pais: solicitud.paisUsuario
              }
            }));

            setNotificaciones(notificacionesSolicitudes);
            setNoLeidas(notificacionesSolicitudes.length);
            console.log('✅ Solicitudes convertidas a notificaciones:', notificacionesSolicitudes.length);
          }
        } catch (solicitudesError) {
          console.error('Error cargando solicitudes:', solicitudesError);
        }
      }

    } catch (error) {
      console.error('❌ Error cargando notificaciones:', error);
      setNotificaciones([]);
    } finally {
      setCargando(false);
    }
  };

  const marcarComoLeida = async (notificacionId) => {
    try {
      await notificacionesAPI.marcarComoLeida(notificacionId);

      // Actualizar estado local
      setNotificaciones(prev => prev.map(n =>
        n._id === notificacionId ? { ...n, leida: true } : n
      ));
      setNoLeidas(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  const responderSolicitud = async (notificacionId, remitenteId, accion) => {
    try {
      // Extraer el ID correcto si es un objeto
      const remitenteIdFinal = typeof remitenteId === 'string'
        ? remitenteId
        : remitenteId?._id || remitenteId?.id;

      console.log('🔍 DEBUGEANDO SOLICITUD:', {
        notificacionId,
        remitenteId,
        remitenteIdFinal,
        accion,
        tipo: 'Datos enviados al backend'
      });

      if (!remitenteIdFinal) {
        throw new Error('No se pudo obtener el ID del remitente');
      }

      // Usar la API real para responder solicitudes
      if (accion === 'aceptar') {
        await amistadesAPI.aceptarSolicitud(remitenteIdFinal);
      } else {
        await amistadesAPI.rechazarSolicitud(remitenteIdFinal);
      }      // Marcar notificación como leída y actualizar lista
      setNotificaciones(prev => prev.map(n =>
        n._id === notificacionId
          ? { ...n, leida: true, respondida: true, respuesta: accion }
          : n
      ));
      setNoLeidas(prev => Math.max(0, prev - 1));

      // Marcar notificación como leída en el backend
      try {
        await notificacionesAPI.marcarComoLeida(notificacionId);
      } catch (markError) {
        console.error('Error marcando notificación como leída:', markError);
      }

      // 🔥 EMITIR EVENTOS GLOBALES PARA SINCRONIZAR OTROS COMPONENTES

      // 1. Evento de solicitud respondida
      emitSolicitudRespondida({
        usuarioId: remitenteId,
        notificacionId: notificacionId,
        accion: accion
      });

      // 2. Evento de amistad actualizada
      emitAmistadActualizada({
        usuarioId: remitenteId,
        estado: accion === 'aceptar' ? 'amigos' : 'rechazada'
      });

      // 3. Evento de notificación leída
      emitNotificacionLeida({
        notificacionId: notificacionId
      });

      console.log(`✅ Solicitud ${accion}ada y eventos emitidos para usuario ${remitenteId}`);

    } catch (error) {
      console.error(`Error ${accion} solicitud:`, error);
      // Mostrar mensaje de error al usuario
      alert(`Error al ${accion} la solicitud. Por favor, intenta de nuevo.`);
    }
  };

  const getIconoNotificacion = (tipo) => {
    switch (tipo) {
      case 'solicitud_amistad':
        return <UserPlus size={16} className="text-blue-500" />;
      case 'amistad_aceptada':
        return <UserCheck size={16} className="text-green-500" />;
      case 'comentario':
        return <Clock size={16} className="text-orange-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const formatearTiempo = (fecha) => {
    const ahora = new Date();
    const tiempo = new Date(fecha);
    const diferencia = ahora - tiempo;

    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 60) {
      return `${minutos}m`;
    } else if (horas < 24) {
      return `${horas}h`;
    } else {
      return `${dias}d`;
    }
  };

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMostrarLista(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    cargarContador();

    // Polling cada 30 segundos para nuevas notificaciones
    const interval = setInterval(cargarContador, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleLista = async () => {
    console.log('Toggle lista clicked, estado actual:', mostrarLista);
    if (!mostrarLista) {
      console.log('Cargando notificaciones...');
      await cargarNotificaciones();
    }
    setMostrarLista(!mostrarLista);
    console.log('Nuevo estado:', !mostrarLista);
  };

  return (
    <div className="position-relative" ref={menuRef}>
      <button
        onClick={toggleLista}
        className="btn btn-light p-2 rounded-circle position-relative"
        style={{ border: 'none' }}
      >
        <Bell size={20} className="text-secondary" />
        {noLeidas > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill" style={{ fontSize: '10px', padding: '2px 6px' }}>
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </button>

      {mostrarLista && (
        <div
          className="position-absolute bg-white border rounded shadow-lg notification-dropdown"
          style={{
            right: 0,
            top: '100%',
            width: '380px',
            maxHeight: '500px',
            overflowY: 'auto',
            zIndex: 1060,
            marginTop: '8px'
          }}
        >
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="m-0 fw-bold">Notificaciones</h6>
            {noLeidas > 0 && (
              <button
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  await fetch('http://localhost:3001/api/notificaciones/leer-todas', {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                  setNoLeidas(0);
                  setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
                }}
                className="btn btn-sm btn-link text-primary p-0"
                style={{ textDecoration: 'none' }}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {cargando ? (
            <div className="p-4 text-center">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : notificaciones.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <Bell size={48} className="text-muted mb-2" />
              <p className="m-0">No hay notificaciones</p>
            </div>
          ) : (
            <div className="notification-scroll">
              {notificaciones.slice(0, 5).map(notificacion => (
                <div
                  key={notificacion._id}
                  className={`p-3 border-bottom notification-item ${!notificacion.leida ? 'notification-unread' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => !notificacion.leida && marcarComoLeida(notificacion._id)}
                >
                  <div className="d-flex">
                    <div className="me-3">
                      {getIconoNotificacion(notificacion.tipo)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <p className="m-0 small" style={{ fontSize: '14px' }}>
                            {notificacion.mensaje}
                          </p>
                          <small className="text-muted">
                            {formatearTiempo(notificacion.createdAt)}
                          </small>
                        </div>
                        {!notificacion.leida && (
                          <div className="ms-2">
                            <div
                              className="bg-primary rounded-circle notification-badge"
                              style={{ width: '8px', height: '8px' }}
                            ></div>
                          </div>
                        )}
                      </div>

                      {/* Botones para solicitudes de amistad */}
                      {notificacion.tipo === 'solicitud_amistad' && !notificacion.respondida && (
                        <div className="mt-2 friend-request-buttons">
                          <SolicitudAmistad
                            notificacionId={notificacion._id}
                            remitenteId={notificacion.remitenteId}
                            remitente={notificacion.remitente}
                            onResponder={responderSolicitud}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Botón para ver todas las notificaciones */}
              {notificaciones.length > 5 && (
                <div className="p-3 text-center border-top">
                  <button
                    onClick={() => {
                      setMostrarLista(false);
                      setMostrarModal(true);
                    }}
                    className="btn btn-link btn-sm text-primary p-0 hover-bg-light"
                    style={{ textDecoration: 'none' }}
                  >
                    <MoreHorizontal size={16} className="me-1" />
                    Ver todas las notificaciones ({notificaciones.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal de notificaciones */}
      <ModalNotificaciones
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
      />
    </div>
  );
};

export default NotificacionesBell;