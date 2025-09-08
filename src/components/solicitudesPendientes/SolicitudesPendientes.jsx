// components/solicitudesPendientes/SolicitudesPendientes.jsx
import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Clock, Search, Filter, X } from 'lucide-react';
import { amistadesAPI, notificacionesAPI } from '../../lib/apiNotificaciones';
import { useAmistadEvents } from '../../hooks/useGlobalEvents';

const SolicitudesPendientes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtro, setFiltro] = useState('todas'); // todas, pendientes, aceptadas, rechazadas
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  // Hook para eventos globales
  const { onSolicitudRespondida, onAmistadActualizada } = useAmistadEvents();

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  useEffect(() => {
    // Escuchar eventos de solicitudes respondidas
    const unsubscribeSolicitud = onSolicitudRespondida((eventData) => {
      console.log('📨 Evento recibido en SolicitudesPendientes - Solicitud respondida:', eventData);

      // Actualizar el estado de la solicitud en la lista
      setSolicitudes(prev => prev.map(solicitud => {
        if (solicitud.remitenteId === eventData.usuarioId) {
          console.log(`🔄 Actualizando solicitud de ${eventData.usuarioId} a estado: ${eventData.accion === 'aceptar' ? 'aceptada' : 'rechazada'}`);
          return {
            ...solicitud,
            estado: eventData.accion === 'aceptar' ? 'aceptada' : 'rechazada',
            fechaRespuesta: new Date().toISOString()
          };
        }
        return solicitud;
      }));
    });

    // Escuchar eventos de amistad actualizada
    const unsubscribeAmistad = onAmistadActualizada((eventData) => {
      console.log('👥 Evento recibido en SolicitudesPendientes - Amistad actualizada:', eventData);

      // Actualizar el estado según el nuevo estado de amistad
      setSolicitudes(prev => prev.map(solicitud => {
        if (solicitud.remitenteId === eventData.usuarioId) {
          console.log(`🔄 Actualizando estado de amistad de ${eventData.usuarioId} a: ${eventData.estado}`);
          return {
            ...solicitud,
            estado: eventData.estado === 'amigos' ? 'aceptada' : solicitud.estado
          };
        }
        return solicitud;
      }));
    });

    // Cleanup al desmontar el componente
    return () => {
      unsubscribeSolicitud();
      unsubscribeAmistad();
    };
  }, [onSolicitudRespondida, onAmistadActualizada]);

  const cargarSolicitudes = async () => {
    try {
      setCargando(true);
      console.log('🔄 Cargando solicitudes desde API...');

      // Cargar tanto solicitudes recibidas como historial de notificaciones
      const [solicitudesRecibidas, notificaciones] = await Promise.all([
        amistadesAPI.obtenerSolicitudesRecibidas(),
        // También cargar notificaciones para obtener el historial completo
        notificacionesAPI.obtenerNotificaciones({ limit: 100, soloNoLeidas: false }).catch(() => ({ success: false, data: [] }))
      ]);

      const todasLasSolicitudes = [];

      // 1. Agregar solicitudes pendientes actuales
      if (solicitudesRecibidas.success && solicitudesRecibidas.solicitudes) {
        const solicitudesPendientes = solicitudesRecibidas.solicitudes.map(solicitud => ({
          _id: solicitud._id,
          remitenteId: solicitud._id, // El ID del solicitante
          remitente: {
            primernombreUsuario: solicitud.primernombreUsuario || 'Sin nombre',
            primerapellidoUsuario: solicitud.primerapellidoUsuario || '',
            fotoPerfil: solicitud.fotoPerfil || '',
            cargoFundacion: solicitud.cargoFundacion || 'Miembro',
            ciudadUsuario: solicitud.ciudadUsuario,
            paisUsuario: solicitud.paisUsuario
          },
          estado: 'pendiente',
          fechaCreacion: solicitud.createdAt || new Date().toISOString(),
          fechaRespuesta: null
        }));
        todasLasSolicitudes.push(...solicitudesPendientes);
      }

      // 2. Agregar solicitudes históricas desde notificaciones
      if (notificaciones.success && notificaciones.data) {
        const solicitudesHistoricas = notificaciones.data
          .filter(notif => notif.tipo === 'solicitud_amistad' && notif.leida)
          .map(notif => {
            // Determinar el estado basado en información disponible
            let estado = 'pendiente'; // Estado por defecto

            // Si hay información específica de respuesta en los datos
            if (notif.datos && notif.datos.respuesta) {
              estado = notif.datos.respuesta;
            } else if (notif.datos && notif.datos.estado) {
              estado = notif.datos.estado;
            } else if (notif.leida) {
              // Si está leída pero no tiene respuesta específica, 
              // probablemente fue aceptada (pero no asumimos)
              estado = 'aceptada';
            }

            return {
              _id: notif._id,
              remitenteId: typeof notif.remitenteId === 'string' ? notif.remitenteId : notif.remitenteId._id,
              remitente: {
                primernombreUsuario: notif.remitenteId?.primernombreUsuario || notif.datos?.remitente?.primernombreUsuario || 'Usuario',
                primerapellidoUsuario: notif.remitenteId?.primerapellidoUsuario || notif.datos?.remitente?.primerapellidoUsuario || '',
                fotoPerfil: notif.remitenteId?.fotoPerfil || notif.datos?.remitente?.fotoPerfil || '',
                cargoFundacion: notif.remitenteId?.cargoFundacion || notif.datos?.remitente?.cargoFundacion || 'Miembro',
                ciudadUsuario: notif.remitenteId?.ciudadUsuario || notif.datos?.remitente?.ciudadUsuario,
                paisUsuario: notif.remitenteId?.paisUsuario || notif.datos?.remitente?.paisUsuario
              },
              estado: estado,
              fechaCreacion: notif.createdAt || new Date().toISOString(),
              fechaRespuesta: notif.updatedAt || new Date().toISOString()
            };
          });

        // Filtrar duplicados (si una solicitud ya está en pendientes, no agregarla al historial)
        const solicitudesUnicas = solicitudesHistoricas.filter(historica =>
          !todasLasSolicitudes.some(pendiente => pendiente.remitenteId === historica.remitenteId)
        );

        todasLasSolicitudes.push(...solicitudesUnicas);
      }

      setSolicitudes(todasLasSolicitudes);
      console.log('✅ Solicitudes cargadas:', todasLasSolicitudes.length);
      console.log('📊 Contadores:', {
        todas: todasLasSolicitudes.length,
        pendientes: todasLasSolicitudes.filter(s => s.estado === 'pendiente').length,
        aceptadas: todasLasSolicitudes.filter(s => s.estado === 'aceptada').length,
        rechazadas: todasLasSolicitudes.filter(s => s.estado === 'rechazada').length
      });

      // Debug de imágenes de perfil
      console.log('🖼️ URLs de imágenes de perfil:',
        todasLasSolicitudes.map(s => ({
          usuario: `${s.remitente.primernombreUsuario} ${s.remitente.primerapellidoUsuario}`,
          fotoPerfil: s.remitente.fotoPerfil,
          urlCompleta: construirUrlImagen(s.remitente.fotoPerfil)
        }))
      );

    } catch (error) {
      console.error('❌ Error cargando solicitudes:', error);
      setSolicitudes([]);
    } finally {
      setCargando(false);
    }
  };

  const responderSolicitud = async (solicitudId, remitenteId, accion) => {
    try {
      // Usar la API real para responder solicitudes
      if (accion === 'aceptar') {
        await amistadesAPI.aceptarSolicitud(remitenteId);
      } else {
        await amistadesAPI.rechazarSolicitud(remitenteId);
      }

      // Actualizar estado local
      setSolicitudes(prev => prev.map(s =>
        s._id === solicitudId
          ? { ...s, estado: accion === 'aceptar' ? 'aceptada' : 'rechazada', fechaRespuesta: new Date().toISOString() }
          : s
      ));

      console.log(`✅ Solicitud ${accion}da exitosamente`);

    } catch (error) {
      console.error(`❌ Error ${accion} solicitud:`, error);
      // Mostrar mensaje de error al usuario
      alert(`Error al ${accion} la solicitud. Por favor, intenta de nuevo.`);
    }
  };

  // Función helper para construir URLs completas de imágenes
  const construirUrlImagen = (rutaRelativa) => {
    if (!rutaRelativa) return '';
    // Si ya tiene el protocolo, devolverla tal como está
    if (rutaRelativa.startsWith('http')) return rutaRelativa;
    // Si no, construir la URL completa
    return `http://localhost:3001${rutaRelativa}?t=${Date.now()}`;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: 'bg-warning text-dark',
      aceptada: 'bg-success text-white',
      rechazada: 'bg-danger text-white'
    };
    return badges[estado] || 'bg-secondary';
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'pendiente':
        return <Clock size={14} />;
      case 'aceptada':
        return <UserCheck size={14} />;
      case 'rechazada':
        return <X size={14} />;
      default:
        return <UserPlus size={14} />;
    }
  };

  // Filtrar solicitudes
  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    const coincideBusqueda = !busqueda ||
      `${solicitud.remitente.primernombreUsuario} ${solicitud.remitente.primerapellidoUsuario}`
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    const coincideFiltro = filtro === 'todas' || solicitud.estado === filtro;

    return coincideBusqueda && coincideFiltro;
  });

  const contadores = {
    todas: solicitudes.length,
    pendiente: solicitudes.filter(s => s.estado === 'pendiente').length,
    aceptada: solicitudes.filter(s => s.estado === 'aceptada').length,
    rechazada: solicitudes.filter(s => s.estado === 'rechazada').length
  };

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="m-0">
                  <UserPlus className="me-2" size={24} />
                  Solicitudes de Amistad
                </h4>
              </div>

              {/* Barra de búsqueda y filtros */}
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nombre..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Filter size={16} />
                    </span>
                    <select
                      className="form-select"
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                    >
                      <option value="todas">Todas ({contadores.todas})</option>
                      <option value="pendiente">Pendientes ({contadores.pendiente})</option>
                      <option value="aceptada">Aceptadas ({contadores.aceptada})</option>
                      <option value="rechazada">Rechazadas ({contadores.rechazada})</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              {cargando ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : solicitudesFiltradas.length === 0 ? (
                <div className="text-center py-5">
                  <UserPlus size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No hay solicitudes</h5>
                  <p className="text-muted">
                    {busqueda || filtro !== 'todas'
                      ? 'No se encontraron solicitudes con los filtros aplicados'
                      : 'No tienes solicitudes de amistad'}
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover m-0">
                    <thead className="table-light">
                      <tr>
                        <th>Usuario</th>
                        <th>Cargo</th>
                        <th>Estado</th>
                        <th>Fecha Solicitud</th>
                        <th>Fecha Respuesta</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solicitudesFiltradas.map(solicitud => (
                        <tr key={solicitud._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="me-3 d-flex align-items-center justify-content-center bg-light rounded-circle"
                                style={{ width: '40px', height: '40px' }}
                              >
                                {solicitud.remitente.fotoPerfil ? (
                                  <img
                                    src={construirUrlImagen(solicitud.remitente.fotoPerfil)}
                                    alt={`${solicitud.remitente.primernombreUsuario} ${solicitud.remitente.primerapellidoUsuario}`}
                                    className="rounded-circle"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                    onError={(e) => {
                                      console.warn('Error cargando imagen de usuario:', solicitud.remitente.fotoPerfil);
                                      e.target.style.display = 'none';
                                      const container = e.target.parentElement;
                                      const fallback = container.querySelector('.avatar-fallback');
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                  />
                                ) : (
                                  <UserPlus size={20} className="text-muted" />
                                )}
                                {/* Fallback oculto para mostrar cuando falle la imagen */}
                                <div className="avatar-fallback d-none align-items-center justify-content-center text-secondary" style={{ width: '40px', height: '40px' }}>
                                  <UserPlus size={20} />
                                </div>
                              </div>
                              <div>
                                <div className="fw-semibold">
                                  {solicitud.remitente.primernombreUsuario} {solicitud.remitente.primerapellidoUsuario}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">{solicitud.remitente.cargoFundacion}</small>
                          </td>
                          <td>
                            <span className={`badge ${getEstadoBadge(solicitud.estado)} d-flex align-items-center gap-1`} style={{ width: 'fit-content' }}>
                              {getEstadoIcon(solicitud.estado)}
                              {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                            </span>
                          </td>
                          <td>
                            <small>{formatearFecha(solicitud.fechaCreacion)}</small>
                          </td>
                          <td>
                            <small>
                              {solicitud.fechaRespuesta ? formatearFecha(solicitud.fechaRespuesta) : '-'}
                            </small>
                          </td>
                          <td>
                            {solicitud.estado === 'pendiente' && (
                              <div className="d-flex gap-1">
                                <button
                                  onClick={() => responderSolicitud(solicitud._id, solicitud.remitenteId, 'aceptar')}
                                  className="btn btn-success btn-sm"
                                  title="Aceptar solicitud"
                                >
                                  <UserCheck size={14} />
                                </button>
                                <button
                                  onClick={() => responderSolicitud(solicitud._id, solicitud.remitenteId, 'rechazar')}
                                  className="btn btn-danger btn-sm"
                                  title="Rechazar solicitud"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudesPendientes;