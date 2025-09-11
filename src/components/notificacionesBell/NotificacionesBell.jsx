// components/NotificacionesBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, UserPlus, UserCheck, X, Clock, MoreHorizontal } from 'lucide-react';
import SolicitudAmistad from './SolicitudAmistad';
import ModalNotificaciones from './ModalNotificaciones';
import { notificacionesAPI, amistadesAPI } from '../../lib/apiNotificaciones';
import { useAmistadEvents } from '../../hooks/useGlobalEvents';
import { useNavigate } from 'react-router-dom';

const NotificacionesBell = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Para detectar cambios de tamaño
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Hooks para eventos globales
  const {
    emitSolicitudRespondida,
    emitAmistadActualizada,
    emitNotificacionLeida,
    onSolicitudRespondida,
    onAmistadActualizada,
    onNotificacionLeida
  } = useAmistadEvents();

  // Efecto para escuchar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const handleScroll = () => {
      if (mostrarLista && isMobile()) {
        setMostrarLista(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [mostrarLista, windowWidth]);

  // Efecto para escuchar eventos globales de amistad y recargar notificaciones
  useEffect(() => {
    const handleSolicitudRespondida = (data) => {
      console.log('🔔 Evento recibido: solicitud respondida', data);
      // Recargar contador y notificaciones
      cargarContador();
      if (mostrarLista) {
        cargarNotificaciones();
      }
    };

    const handleAmistadActualizada = (data) => {
      console.log('🔔 Evento recibido: amistad actualizada', data);
      // Recargar contador
      cargarContador();
    };

    const handleNotificacionLeida = (data) => {
      console.log('🔔 Evento recibido: notificación leída', data);
      // Recargar contador
      cargarContador();
    };

    // Suscribirse a los eventos
    const unsubscribeSolicitud = onSolicitudRespondida(handleSolicitudRespondida);
    const unsubscribeAmistad = onAmistadActualizada(handleAmistadActualizada);
    const unsubscribeNotificacion = onNotificacionLeida(handleNotificacionLeida);

    return () => {
      // Desuscribirse al desmontar
      if (unsubscribeSolicitud) unsubscribeSolicitud();
      if (unsubscribeAmistad) unsubscribeAmistad();
      if (unsubscribeNotificacion) unsubscribeNotificacion();
    };
  }, [mostrarLista, onSolicitudRespondida, onAmistadActualizada, onNotificacionLeida]);

  const cargarContador = async () => {
    try {
      // Traer solo no leídas y sumar cantidades reales
      const data = await notificacionesAPI.obtenerNotificaciones({ soloNoLeidas: true, limit: 50 });
      if (data?.success && Array.isArray(data.data)) {
        // Excluir mensajes del contador de la campanita (lo llevará ChatBell)
        const total = data.data.reduce((acc, n) => n.tipo === 'mensaje' ? acc : acc + 1, 0);
        setNoLeidas(total);
      } else {
        setNoLeidas(0);
      }
    } catch (error) {
      console.error('Error cargando contador:', error);
      setNoLeidas(0);
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

        // 🔥 FILTRAR NOTIFICACIONES OBSOLETAS
        const notificacionesValidas = [];

        for (const notif of notificacionesTransformadas) {
          if (notif.tipo === 'solicitud_amistad' && notif.remitenteId) {
            try {
              // Verificar estado actual de amistad
              const estadoActual = await amistadesAPI.obtenerEstado(notif.remitenteId);

              if (estadoActual.success && estadoActual.estado === 'amigos') {
                console.log(`🗑️ Filtrando notificación obsoleta - Ya son amigos con ${notif.remitenteId}`);
                // No agregar esta notificación porque ya son amigos
                continue;
              }

              if (estadoActual.success && estadoActual.estado === 'ninguna') {
                console.log(`🗑️ Filtrando notificación obsoleta - No hay relación con ${notif.remitenteId}`);
                // No agregar esta notificación porque no hay relación
                continue;
              }
            } catch (error) {
              console.warn(`⚠️ Error verificando estado de ${notif.remitenteId}:`, error);
              // En caso de error, mantener la notificación
            }
          }

          // Agregar notificación válida
          notificacionesValidas.push(notif);
        }

        setNotificaciones(notificacionesValidas);
        console.log('✅ Notificaciones válidas cargadas:', notificacionesValidas.length);
        console.log('🔍 DEBUGEANDO NOTIFICACIONES:', notificacionesValidas.map(n => ({
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
      // Restar por cantidad real (para mensajes agrupados)
      const notif = notificaciones.find(n => n._id === notificacionId);
      const resta = notif?.tipo === 'mensaje' ? ((notif?.datos?.count || 1)) : 1;
      setNoLeidas(prev => Math.max(0, prev - resta));
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

      // 🔍 VERIFICAR ESTADO ACTUAL ANTES DE PROCEDER
      const estadoActual = await amistadesAPI.obtenerEstado(remitenteIdFinal);

      if (estadoActual.success && estadoActual.estado === 'amigos') {
        console.log('⚠️ Los usuarios ya son amigos, removiendo notificación obsoleta');

        // Remover la notificación obsoleta de la lista
        setNotificaciones(prev => prev.filter(n => n._id !== notificacionId));
        setNoLeidas(prev => Math.max(0, prev - 1));

        // Marcar como leída en el backend
        try {
          await notificacionesAPI.marcarComoLeida(notificacionId);
        } catch (markError) {
          console.error('Error marcando notificación como leída:', markError);
        }

        // Emitir evento de que ya son amigos
        emitAmistadActualizada({
          usuarioId: remitenteIdFinal,
          estado: 'amigos'
        });

        return; // No proceder con la acción
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

      // Para obtener el ID del usuario actual (quien acepta/rechaza)
      const usuarioActualId = localStorage.getItem('userId') || localStorage.getItem('user_id');

      // 1. Evento de solicitud respondida - para el remitente (quien envió)
      emitSolicitudRespondida({
        usuarioId: remitenteIdFinal,
        notificacionId: notificacionId,
        accion: accion
      });

      // 2. Eventos de amistad actualizada - CRUZADOS para ambos usuarios
      const nuevoEstado = accion === 'aceptar' ? 'amigos' : 'rechazada';

      // CLAVE: Emitir eventos cruzados para sincronización bidireccional

      // Para Persona A (remitente) - le decimos que su relación con Persona B cambió
      emitAmistadActualizada({
        usuarioId: usuarioActualId, // PersonaB - quien está siendo observado por PersonaA
        estado: nuevoEstado,
        relacionConUsuario: remitenteIdFinal // PersonaA - quien observa
      });

      // Para Persona B (receptor) - le decimos que su relación con Persona A cambió  
      emitAmistadActualizada({
        usuarioId: remitenteIdFinal, // PersonaA - quien está siendo observado por PersonaB
        estado: nuevoEstado,
        relacionConUsuario: usuarioActualId // PersonaB - quien observa
      });

      // 3. Evento de notificación leída
      emitNotificacionLeida({
        notificacionId: notificacionId
      });

      console.log(`✅ Solicitud ${accion}ada y eventos cruzados emitidos entre usuarios ${remitenteIdFinal} ↔ ${usuarioActualId}`);

      // Recargar contador de notificaciones después de responder
      await cargarContador();

      // Si el dropdown está abierto, recargar también las notificaciones
      if (mostrarLista) {
        await cargarNotificaciones();
      }

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

    // Polling cada 5 segundos para nuevas notificaciones
    const interval = setInterval(cargarContador, 5000);
    return () => clearInterval(interval);
  }, []);

  // Efecto para limpiar notificaciones obsoletas periódicamente
  useEffect(() => {
    const limpiarNotificacionesObsoletas = async () => {
      if (notificaciones.length === 0) return;

      console.log('🧹 Limpiando notificaciones obsoletas...');

      const notificacionesValidas = [];

      for (const notif of notificaciones) {
        if (notif.tipo === 'solicitud_amistad' && notif.remitenteId) {
          try {
            const estadoActual = await amistadesAPI.obtenerEstado(notif.remitenteId);

            if (estadoActual.success && (estadoActual.estado === 'amigos' || estadoActual.estado === 'ninguna')) {
              console.log(`🗑️ Removiendo notificación obsoleta de ${notif.remitenteId}`);
              continue; // No agregar esta notificación
            }
          } catch (error) {
            console.warn(`⚠️ Error verificando estado de ${notif.remitenteId}:`, error);
          }
        }

        notificacionesValidas.push(notif);
      }

      if (notificacionesValidas.length !== notificaciones.length) {
        setNotificaciones(notificacionesValidas);
        setNoLeidas(prev => Math.max(0, prev - (notificaciones.length - notificacionesValidas.length)));
        console.log(`✅ Removidas ${notificaciones.length - notificacionesValidas.length} notificaciones obsoletas`);
      }
    };

    // Ejecutar limpieza inicial después de 2 segundos y luego cada 30 segundos
    const timeoutInicial = setTimeout(limpiarNotificacionesObsoletas, 2000);
    const interval = setInterval(limpiarNotificacionesObsoletas, 30000);

    return () => {
      clearTimeout(timeoutInicial);
      clearInterval(interval);
    };
  }, [notificaciones]);

  const toggleLista = async () => {
    console.log('Toggle lista clicked, estado actual:', mostrarLista);
    if (!mostrarLista) {
      console.log('Cargando notificaciones...');
      await cargarNotificaciones();
    }
    setMostrarLista(!mostrarLista);
    console.log('Nuevo estado:', !mostrarLista);
  };

  // Función para determinar si estamos en móvil
  const isMobile = () => {
    return windowWidth <= 768;
  };

  // Estilo dinámico para el dropdown
  const getDropdownStyle = () => {
    if (isMobile()) {
      // En móvil: usar position fixed para centrarlo en la pantalla
      return {
        position: 'fixed',
        top: '70px', // Justo debajo del navbar
        left: '50%',
        transform: 'translateX(-50%)', // Centrar horizontalmente
        width: '95vw',
        maxWidth: '400px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        zIndex: 10000
      };
    } else {
      // En desktop: posición absoluta relativa al botón
      return {
        position: 'absolute',
        top: '100%',
        marginTop: '8px',
        width: '380px',
        right: 0,
        left: 'auto',
        maxHeight: '500px',
        overflowY: 'auto',
        zIndex: 10000
      };
    }
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
          className={`bg-white border rounded shadow-lg notification-dropdown ${isMobile() ? '' : 'position-absolute'}`}
          style={getDropdownStyle()}
          ref={menuRef}
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
                  onClick={async () => {
                    // Navegar a chat si es notificación de mensaje
                    if (notificacion.tipo === 'mensaje' && notificacion.remitenteId) {
                      navigate('/mensajes', { state: { usuarioSeleccionado: { _id: notificacion.remitenteId, primernombreUsuario: notificacion?.remitente?.primernombreUsuario, primerapellidoUsuario: notificacion?.remitente?.primerapellidoUsuario, fotoPerfil: notificacion?.remitente?.fotoPerfil } } });
                    }
                    if (!notificacion.leida) {
                      await marcarComoLeida(notificacion._id);
                    }
                    setMostrarLista(false);
                  }}
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
                        <div className="ms-2 d-flex align-items-center">
                          {notificacion?.datos?.count > 1 && (
                            <span className="badge bg-primary rounded-pill" style={{ fontSize: '11px' }}>
                              {notificacion.datos.count}
                            </span>
                          )}
                          {!notificacion.leida && (
                            <div
                              className="bg-primary rounded-circle notification-badge ms-2"
                              style={{ width: '8px', height: '8px' }}
                            ></div>
                          )}
                        </div>
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