import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, ExternalLink, Plus, ChevronLeft, ChevronRight, Monitor, MapPin, Lock } from 'lucide-react';
import CrearEventoModal from '../components/CrearEventoModal';

// Modal simple reutilizable con Bootstrap
function SimpleModal({ open, onClose, title = "Evento", children }) {
  if (!open) return null;

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: 9999 }}
        onClick={onClose}
      />
      <div
        className="position-fixed top-50 start-50 translate-middle"
        style={{
          zIndex: 10000,
          width: 'min(720px, 95vw)',
          maxHeight: '90vh',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="bg-white rounded shadow-lg overflow-auto" style={{ maxHeight: '90vh' }}>
          <div className="d-flex justify-content-between align-items-center p-2 p-md-3 border-bottom">
            <h5 className="modal-title fw-bold mb-0 text-truncate me-2">{title}</h5>
            <button
              type="button"
              className="btn-close flex-shrink-0"
              onClick={onClose}
              aria-label="Cerrar"
            />
          </div>
          <div className="p-2 p-md-3">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

// Componente para crear eventos - Ahora integrado con CrearEventoModal
// El placeholder fue reemplazado por el componente funcional completo

// Componente para mostrar detalles del evento
function DetallesEventoModal({ evento }) {
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'Fecha no disponible';
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha no válida';
    }
  };

  const formatearHora = (fechaISO) => {
    if (!fechaISO) return 'Hora no disponible';
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Hora no válida';
    }
  };

  const determinarEstadoEvento = (evento) => {
    if (!evento.fechaInicio) return 'unknown';

    const ahora = new Date();
    const fechaInicio = new Date(evento.fechaInicio);
    const fechaFin = new Date(evento.fechaFin || evento.fechaInicio);

    if (ahora < fechaInicio) return 'upcoming';
    if (ahora >= fechaInicio && ahora <= fechaFin) return 'in-progress';
    if (ahora > fechaFin) return 'completed';
    return 'unknown';
  };

  const status = determinarEstadoEvento(evento);
  const totalParticipantes = (evento.asistentes?.length || 0) + (evento.coOrganizadores?.length || 0) + 1;

  return (
    <div className="container-fluid">
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-8">
          <h4 className="fw-bold mb-3">{evento.nombre}</h4>
          <p className="text-muted mb-3">{evento.descripcion || 'Sin descripción'}</p>

          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-2 gap-md-3">
              <Calendar size={18} className="text-primary flex-shrink-0" />
              <div className="small">
                <strong>Fecha:</strong>
                <div className="d-block d-md-inline ms-md-1">{formatearFecha(evento.fechaInicio)}</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 gap-md-3">
              <Clock size={18} className="text-primary flex-shrink-0" />
              <div className="small">
                <strong>Hora:</strong>
                <div className="d-block d-md-inline ms-md-1">
                  {formatearHora(evento.fechaInicio)}
                  {evento.fechaFin && evento.fechaFin !== evento.fechaInicio && (
                    <span> - {formatearHora(evento.fechaFin)}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-start gap-2 gap-md-3">
              <span className="text-primary fs-6 flex-shrink-0">
                {evento.tipoModalidad === 'presencial' ? '📍' :
                  evento.tipoModalidad === 'virtual' ? '💻' : '🌐'}
              </span>
              <div className="flex-grow-1 small">
                <div><strong>Modalidad:</strong> <span className="text-capitalize">{evento.tipoModalidad || 'Virtual'}</span></div>

                {evento.ubicacion && evento.ubicacion.direccion && (
                  <div className="mt-1">
                    <strong>Ubicación:</strong>
                    <div className="text-break">{evento.ubicacion.direccion}
                      {evento.ubicacion.ciudad && `, ${evento.ubicacion.ciudad}`}</div>
                  </div>
                )}

                {evento.linkVirtual && (
                  <div className="mt-2">
                    <div className="text-muted mb-1">
                      <strong>Enlace de acceso:</strong>
                    </div>
                    <a
                      href={evento.linkVirtual}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 w-100 w-md-auto"
                    >
                      <Video size={14} />
                      <span className="text-truncate">Unirse al evento</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 gap-md-3">
              <Users size={18} className="text-primary flex-shrink-0" />
              <div className="small">
                <strong>Participantes:</strong> {totalParticipantes} confirmados
              </div>
            </div>

            {evento.organizador && (
              <div className="d-flex align-items-center gap-2 gap-md-3">
                <span className="text-primary fs-6 flex-shrink-0">👤</span>
                <div className="small">
                  <strong>Organizador:</strong>
                  <div className="d-block d-md-inline ms-md-1">{evento.organizador.primernombreUsuario} {evento.organizador.primerapellidoUsuario}</div>
                </div>
              </div>
            )}

            {evento.categoria && (
              <div className="d-flex align-items-center gap-2 gap-md-3">
                <span className="text-primary fs-6 flex-shrink-0">🏷️</span>
                <div className="small">
                  <strong>Categoría:</strong> <span className="text-capitalize">{evento.categoria}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <h6 className="card-title">Estado del Evento</h6>
              <span className={`badge fs-6 px-3 py-2 ${status === 'upcoming' ? 'bg-success' :
                status === 'in-progress' ? 'bg-warning text-dark' :
                  status === 'completed' ? 'bg-secondary' : 'bg-danger'
                }`}>
                {status === 'upcoming' ? 'Próximo' :
                  status === 'in-progress' ? 'En curso' :
                    status === 'completed' ? 'Completado' : 'Cancelado'}
              </span>

              {evento.esPrivado !== undefined && (
                <div className="mt-3">
                  <h6 className="card-title small">Privacidad</h6>
                  <span className={`badge ${!evento.esPrivado ? 'bg-info' : 'bg-secondary'}`}>
                    {!evento.esPrivado ? 'Público' : 'Privado'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar calendario mensual con eventos - Diseño de agenda profesional
function CalendarioEventos({ eventos, onVerDetalles }) {
  const [mesActual, setMesActual] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  // Hook para detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Obtener datos del mes actual
  const primerDiaMes = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
  const ultimoDiaMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0);
  const primerDiaSemana = primerDiaMes.getDay(); // 0 = domingo
  const diasEnMes = ultimoDiaMes.getDate();

  // Navegación entre meses
  const mesAnterior = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1));
  };

  const mesSiguiente = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1));
  };

  const volverHoy = () => {
    setMesActual(new Date());
  };

  // Formatear el título del mes
  const tituloMes = mesActual.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric'
  });

  // Filtrar eventos del mes actual
  const eventosDelMes = eventos.filter(evento => {
    if (!evento.fechaInicio) return false;
    const fechaEvento = new Date(evento.fechaInicio);
    return fechaEvento.getMonth() === mesActual.getMonth() &&
      fechaEvento.getFullYear() === mesActual.getFullYear();
  });

  // Obtener eventos de un día específico
  const obtenerEventosDelDia = (dia) => {
    return eventosDelMes.filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio);
      return fechaEvento.getDate() === dia;
    });
  };

  // Generar los días del calendario
  const generarDiasCalendario = () => {
    const dias = [];

    // Días del mes anterior (para completar la primera semana)
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const diaAnterior = new Date(mesActual.getFullYear(), mesActual.getMonth(), -i);
      dias.push({
        dia: diaAnterior.getDate(),
        esDelMesActual: false,
        fecha: diaAnterior
      });
    }

    // Días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
      dias.push({
        dia,
        esDelMesActual: true,
        fecha: new Date(mesActual.getFullYear(), mesActual.getMonth(), dia)
      });
    }

    // Días del mes siguiente (para completar la última semana)
    const diasTotales = dias.length;
    const diasFaltantes = 42 - diasTotales; // 6 semanas * 7 días
    for (let i = 1; i <= diasFaltantes; i++) {
      const diaSiguiente = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, i);
      dias.push({
        dia: diaSiguiente.getDate(),
        esDelMesActual: false,
        fecha: diaSiguiente
      });
    }

    return dias;
  };

  const dias = generarDiasCalendario();

  return (
    <div className="calendario-agenda-profesional px-2 px-md-0" style={{ overflowX: 'hidden' }}>
      {/* Header estilo agenda empresarial */}
      <div className="agenda-header d-flex justify-content-between align-items-center mb-4 p-3 p-md-4 bg-gradient"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
        <button
          className="btn btn-light btn-sm px-2 px-md-3 py-2 rounded-pill shadow-sm"
          onClick={mesAnterior}
          style={{ transition: 'all 0.3s ease' }}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <h2 className="mb-0 text-uppercase fw-bold letter-spacing-1" style={{
            fontSize: isMobile ? '1.3rem' : '1.75rem',
            color: '#1976d2',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {tituloMes}
          </h2>
          <p className="mb-0 small" style={{ color: '#1976d2', opacity: 0.8 }}>
            {eventosDelMes.length} eventos programados
          </p>
        </div>
        <button
          className="btn btn-light btn-sm px-2 px-md-3 py-2 rounded-pill shadow-sm"
          onClick={mesSiguiente}
          style={{ transition: 'all 0.3s ease' }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Tabla calendario estilo agenda profesional */}
      <div className="agenda-table-container w-100" style={{
        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #e9ecef',
        maxWidth: '100%'
      }}>
        {/* Header de días de la semana */}
        <div className="agenda-week-header d-flex w-100" style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
          {[
            { corto: 'DOM', largo: 'DOMINGO' },
            { corto: 'LUN', largo: 'LUNES' },
            { corto: 'MAR', largo: 'MARTES' },
            { corto: 'MIÉ', largo: 'MIÉRCOLES' },
            { corto: 'JUE', largo: 'JUEVES' },
            { corto: 'VIE', largo: 'VIERNES' },
            { corto: 'SÁB', largo: 'SÁBADO' }
          ].map((dia, index) => (
            <div
              key={dia.corto}
              className="agenda-day-header flex-fill text-center py-2 py-md-3 px-1 border-end border-light"
              style={{
                backgroundColor: index === 0 || index === 6 ? '#f1f3f4' : '#f8f9fa',
                borderRight: index === 6 ? 'none' : '1px solid #dee2e6',
                maxWidth: `${100 / 7}%`,
                width: `${100 / 7}%`,
                overflow: 'hidden'
              }}
            >
              <div className="fw-bold text-secondary small d-block d-md-none text-truncate">{dia.corto}</div>
              <div className="fw-bold text-secondary small d-none d-md-block text-truncate">{dia.largo}</div>
            </div>
          ))}
        </div>

        {/* Filas de semanas con cuadrículas */}
        {Array.from({ length: 6 }, (_, semana) => (
          <div key={semana} className="agenda-week d-flex w-100">
            {Array.from({ length: 7 }, (_, dia) => {
              const indiceDia = semana * 7 + dia;
              const diaInfo = dias[indiceDia];
              const eventosDelDia = diaInfo && diaInfo.esDelMesActual ? obtenerEventosDelDia(diaInfo.dia) : [];
              const esHoy = diaInfo && new Date().toDateString() === diaInfo.fecha.toDateString();
              const esDomingo = dia === 0;
              const esSabado = dia === 6;
              const esFinDeSemana = esDomingo || esSabado;

              return (
                <div
                  key={dia}
                  className="agenda-day-cell flex-fill border-end border-bottom position-relative"
                  style={{
                    minHeight: isMobile ? '100px' : '140px',
                    maxWidth: `${100 / 7}%`,
                    width: `${100 / 7}%`,
                    backgroundColor: !diaInfo ? '#fff' :
                      !diaInfo.esDelMesActual ? '#f8f9fa' :
                        esHoy ? '#fff8e1' :
                          esFinDeSemana ? '#fafbfc' : 'white',
                    borderRight: dia === 6 ? 'none' : '1px solid #e9ecef',
                    borderBottom: semana === 5 ? 'none' : '1px solid #e9ecef',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (diaInfo && diaInfo.esDelMesActual) {
                      e.target.style.backgroundColor = esHoy ? '#fff3cd' : '#f8f9fa';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (diaInfo && diaInfo.esDelMesActual) {
                      e.target.style.backgroundColor = esHoy ? '#fff8e1' : esFinDeSemana ? '#fafbfc' : 'white';
                    }
                  }}
                >
                  {diaInfo && (
                    <>
                      {/* Número del día con estilo profesional */}
                      <div className="agenda-day-number position-absolute top-0 start-0 m-2">
                        <div className={`d-flex align-items-center justify-content-center ${esHoy ? 'bg-warning text-dark rounded-circle shadow-sm' :
                          !diaInfo.esDelMesActual ? 'text-muted' : 'text-dark'
                          }`} style={{
                            width: esHoy ? '32px' : 'auto',
                            height: esHoy ? '32px' : 'auto',
                            fontWeight: esHoy ? 'bold' : diaInfo.esDelMesActual ? '600' : 'normal',
                            fontSize: esHoy ? '14px' : '15px',
                            transition: 'all 0.2s ease'
                          }}>
                          {diaInfo.dia}
                        </div>
                      </div>

                      {/* Container de eventos con scroll */}
                      <div
                        className="agenda-events-container px-1 px-md-2 pb-2"
                        style={{
                          marginTop: '38px',
                          height: isMobile ? 'calc(100px - 45px)' : 'calc(140px - 45px)',
                          overflowY: 'auto'
                        }}
                      >
                        {eventosDelDia.map((evento, index) => {
                          const horaEvento = new Date(evento.fechaInicio).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          });

                          return (
                            <div
                              key={index}
                              className="agenda-event mb-1 p-1 p-md-2 rounded shadow-sm"
                              style={{
                                backgroundColor: evento.tipoModalidad === 'Virtual' ? '#e3f2fd' :
                                  evento.tipoModalidad === 'Presencial' ? '#e8f5e8' : '#fff3e0',
                                borderLeft: `4px solid ${evento.tipoModalidad === 'Virtual' ? '#1976d2' :
                                  evento.tipoModalidad === 'Presencial' ? '#388e3c' : '#f57c00'}`,
                                fontSize: isMobile ? '0.65rem' : '0.72rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(0,0,0,0.05)'
                              }}
                              onClick={() => onVerDetalles(evento)}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                              }}
                            >
                              <div className="agenda-event-time text-muted fw-bold mb-1" style={{ fontSize: '0.65rem' }}>
                                {horaEvento}
                              </div>
                              <div className="agenda-event-title text-truncate fw-semibold mb-1" title={evento.nombre}>
                                {evento.nombre}
                              </div>
                              <div className="agenda-event-meta d-flex align-items-center text-muted" style={{ fontSize: '0.62rem' }}>
                                {evento.tipoModalidad === 'Virtual' ? (
                                  <><Monitor size={10} className="me-1" />Virtual</>
                                ) : evento.tipoModalidad === 'Presencial' ? (
                                  <><MapPin size={10} className="me-1" />{evento.ubicacion || 'Presencial'}</>
                                ) : (
                                  <><Users size={10} className="me-1" />Híbrida</>
                                )}
                                {evento.esPrivado && (
                                  <Lock size={8} className="ms-1 text-warning" title="Evento privado" />
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Indicador de más eventos */}
                        {eventosDelDia.length > 4 && (
                          <div className="text-center mt-1">
                            <small className="text-muted fw-bold" style={{ fontSize: '0.6rem' }}>
                              ••• +{eventosDelDia.length - 4} más
                            </small>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Panel de estadísticas y leyenda estilo profesional */}
      <div className="agenda-stats mt-4 p-4 rounded-3 border" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="row">
          <div className="col-lg-8">
            <h5 className="mb-3 text-primary d-flex align-items-center">
              <Calendar size={20} className="me-2" />
              Resumen de {tituloMes}
            </h5>
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <div className="stat-card p-3 bg-white rounded-3 border-0 shadow-sm text-center h-100">
                  <div className="stat-number h3 mb-1 text-primary fw-bold">{eventosDelMes.length}</div>
                  <div className="stat-label small text-muted">Total eventos</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="stat-card p-3 bg-white rounded-3 border-0 shadow-sm text-center h-100">
                  <div className="stat-number h3 mb-1 text-success fw-bold">
                    {eventosDelMes.filter(e => e.tipoModalidad === 'Presencial').length}
                  </div>
                  <div className="stat-label small text-muted">Presenciales</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="stat-card p-3 bg-white rounded-3 border-0 shadow-sm text-center h-100">
                  <div className="stat-number h3 mb-1 text-info fw-bold">
                    {eventosDelMes.filter(e => e.tipoModalidad === 'Virtual').length}
                  </div>
                  <div className="stat-label small text-muted">Virtuales</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="stat-card p-3 bg-white rounded-3 border-0 shadow-sm text-center h-100">
                  <div className="stat-number h3 mb-1 text-warning fw-bold">
                    {eventosDelMes.filter(e => e.tipoModalidad === 'Híbrida').length}
                  </div>
                  <div className="stat-label small text-muted">Híbridas</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mt-3 mt-lg-0">
            <h6 className="text-secondary mb-3">Leyenda de tipos:</h6>
            <div className="legend-container">
              <div className="legend-item d-flex align-items-center mb-2 p-2 bg-white rounded border">
                <div className="legend-color bg-info me-2 rounded" style={{ width: '16px', height: '16px' }}></div>
                <Monitor size={14} className="me-2 text-info" />
                <small className="fw-medium">Virtual</small>
              </div>
              <div className="legend-item d-flex align-items-center mb-2 p-2 bg-white rounded border">
                <div className="legend-color bg-success me-2 rounded" style={{ width: '16px', height: '16px' }}></div>
                <MapPin size={14} className="me-2 text-success" />
                <small className="fw-medium">Presencial</small>
              </div>
              <div className="legend-item d-flex align-items-center p-2 bg-white rounded border">
                <div className="legend-color bg-warning me-2 rounded" style={{ width: '16px', height: '16px' }}></div>
                <Users size={14} className="me-2 text-warning" />
                <small className="fw-medium">Híbrida</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Reuniones() {
  const [vistaActual, setVistaActual] = useState('calendario');
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mesActual, setMesActual] = useState(new Date());
  const [usuario, setUsuario] = useState(null);

  // Cargar eventos del usuario al montar el componente
  useEffect(() => {
    cargarEventos();
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:3001/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsuario(data.usuario || data);
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  };

  const cargarEventos = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch('http://localhost:3001/api/eventos/usuario/mis-eventos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setEventos(data.eventos || []);
      } else {
        throw new Error(data.message || 'Error al cargar eventos');
      }
    } catch (error) {
      console.error('Error cargando eventos:', error);
      setError(error.message);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear fecha
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'Fecha no disponible';
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha no válida';
    }
  };

  // Función para formatear hora
  const formatearHora = (fechaISO) => {
    if (!fechaISO) return 'Hora no disponible';
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Hora no válida';
    }
  };

  // Función para determinar el estado del evento
  const determinarEstadoEvento = (evento) => {
    if (!evento.fechaInicio) return 'unknown';

    const ahora = new Date();
    const fechaInicio = new Date(evento.fechaInicio);
    const fechaFin = new Date(evento.fechaFin || evento.fechaInicio);

    if (ahora < fechaInicio) return 'upcoming';
    if (ahora >= fechaInicio && ahora <= fechaFin) return 'in-progress';
    if (ahora > fechaFin) return 'completed';
    return 'unknown';
  };

  // Funciones para manejar eventos
  const manejarCrearEvento = () => {
    setMostrarModalCrear(true);
  };

  const manejarVerDetalles = (evento) => {
    setEventoSeleccionado(evento);
    setMostrarModalDetalles(true);
  };

  const cerrarModales = () => {
    setMostrarModalCrear(false);
    setMostrarModalDetalles(false);
    setEventoSeleccionado(null);
  };

  const manejarEventoCreado = (eventoCreado) => {
    console.log('Evento creado exitosamente:', eventoCreado);
    cargarEventos(); // Recargar eventos del backend
    cerrarModales();
  };

  const getTipoColor = (tipo) => {
    if (!tipo) return 'text-bg-light';
    switch (tipo.toLowerCase()) {
      case 'profesional':
      case 'trabajo': return 'text-bg-secondary';
      case 'personal': return 'text-bg-primary';
      case 'social': return 'text-bg-success';
      case 'familiar':
      case 'familia': return 'text-bg-warning';
      default: return 'text-bg-light';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-bg-success';
      case 'in-progress': return 'text-bg-warning';
      case 'completed': return 'text-bg-secondary';
      default: return 'text-bg-danger';
    }
  };

  return (
    <div className="py-4" style={{ marginBottom: '80px' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">

          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
            <div className="mb-3 mb-md-0">
              <h1 className="h2 fw-bold text-dark mb-1">Mis Eventos</h1>
              <p className="text-muted mb-0">Gestiona y organiza todos tus eventos y reuniones</p>
            </div>
            <button
              className="btn btn-primary btn-lg d-flex align-items-center gap-2 shadow-sm"
              onClick={manejarCrearEvento}
            >
              <Plus size={20} />
              <span>Crear Evento</span>
            </button>
          </div>

          {/* Vista Toggle */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body py-3">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div className="d-flex gap-2 mb-3 mb-md-0">
                  <button
                    className={`btn ${vistaActual === 'lista' ? 'btn-primary' : 'btn-outline-secondary'} btn-sm`}
                    onClick={() => setVistaActual('lista')}
                  >
                    Lista
                  </button>
                  <button
                    className={`btn ${vistaActual === 'calendario' ? 'btn-primary' : 'btn-outline-secondary'} btn-sm`}
                    onClick={() => setVistaActual('calendario')}
                  >
                    Calendario
                  </button>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <Calendar size={16} />
                  <span className="small">
                    {vistaActual === 'calendario'
                      ? mesActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                      : 'Septiembre 2025'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando eventos...</span>
              </div>
              <p className="text-muted mt-3">Cargando eventos...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <h6 className="alert-heading">Error al cargar eventos</h6>
              <p className="mb-0">{error}</p>
              <hr />
              <button className="btn btn-outline-danger btn-sm" onClick={cargarEventos}>
                Reintentar
              </button>
            </div>
          )}

          {/* Lista de Eventos - Vista Lista */}
          {!loading && !error && vistaActual === 'lista' && (
            <div className="row g-4">
              {eventos.map((evento) => {
                const status = determinarEstadoEvento(evento);
                const fechaFormateada = formatearFecha(evento.fechaInicio);
                const horaFormateada = formatearHora(evento.fechaInicio);
                const totalParticipantes = (evento.asistentes?.length || 0) + (evento.coOrganizadores?.length || 0) + 1; // +1 por organizador

                return (
                  <div key={evento._id} className="col-12">
                    <div className="card border-0 shadow h-100">
                      <div className="card-body p-4">
                        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start mb-3">
                          <div className="flex-grow-1 me-lg-4">
                            <div className="d-flex flex-column flex-md-row align-items-start gap-3">
                              <div className="flex-grow-1">
                                <h3 className="h5 fw-bold text-dark mb-2">{evento.nombre}</h3>
                                <p className="text-muted mb-3">{evento.descripcion || 'Sin descripción'}</p>

                                <div className="d-flex flex-wrap gap-3 small text-muted">
                                  <div className="d-flex align-items-center gap-1">
                                    <Calendar size={16} />
                                    <span>{fechaFormateada}</span>
                                  </div>
                                  <div className="d-flex align-items-center gap-1">
                                    <Clock size={16} />
                                    <span>{horaFormateada}</span>
                                  </div>
                                  <div className="d-flex align-items-center gap-1">
                                    <Users size={16} />
                                    <span>{totalParticipantes} participantes</span>
                                  </div>
                                  <div className="d-flex align-items-center gap-1">
                                    {evento.tipoModalidad === 'virtual' ? <Video size={16} /> : '📍'}
                                    <span className="text-capitalize">{evento.tipoModalidad || 'Virtual'}</span>
                                  </div>
                                  {evento.ubicacion && evento.ubicacion.direccion && (
                                    <div className="d-flex align-items-center gap-1">
                                      <span>📍 {evento.ubicacion.direccion}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="d-flex flex-column gap-2">
                                <span className={`badge ${getStatusColor(status)}`}>
                                  {status === 'upcoming' ? 'Próximo' :
                                    status === 'in-progress' ? 'En curso' :
                                      status === 'completed' ? 'Completado' : 'Cancelado'}
                                </span>
                                <span className={`badge ${getTipoColor(evento.categoria)}`}>
                                  {evento.categoria ? evento.categoria.charAt(0).toUpperCase() + evento.categoria.slice(1) : 'Sin categoría'}
                                </span>
                                {evento.esPrivado !== undefined && (
                                  <span className={`badge ${!evento.esPrivado ? 'text-bg-info' : 'text-bg-secondary'}`}>
                                    {!evento.esPrivado ? 'Público' : 'Privado'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center pt-3 border-top">
                          <div className="d-flex align-items-center gap-2 text-muted small mb-2 mb-md-0">
                            {evento.tipoModalidad === 'virtual' && <Video size={16} />}
                            <span>
                              {evento.tipoModalidad === 'virtual' ?
                                (evento.linkVirtual ? 'Reunión Virtual' : 'Virtual sin enlace') :
                                'Evento Presencial'
                              }
                            </span>
                          </div>

                          <div className="d-flex gap-2">
                            {status === 'upcoming' && (
                              <>
                                <button className="btn btn-outline-primary btn-sm">
                                  Recordar
                                </button>
                                {evento.linkVirtual && (
                                  <a
                                    href={evento.linkVirtual}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-sm"
                                  >
                                    <Video className="me-1" size={14} />
                                    Unirse
                                    <ExternalLink className="ms-1" size={12} />
                                  </a>
                                )}
                              </>
                            )}

                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => manejarVerDetalles(evento)}
                            >
                              Ver Detalles
                            </button>

                            {status === 'completed' && (
                              <button className="btn btn-outline-secondary btn-sm">
                                Ver resumen
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && eventos.length === 0 && (
            <div className="text-center py-5">
              <div className="mb-4">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: '80px', height: '80px' }}>
                  <Calendar size={40} className="text-muted" />
                </div>
              </div>
              <h3 className="h5 fw-semibold text-muted mb-2">
                No tienes eventos programados
              </h3>
              <p className="text-muted mb-4">
                Crea tu primer evento para empezar a organizar tu agenda
              </p>
              <button
                className="btn btn-primary"
                onClick={manejarCrearEvento}
              >
                <Plus className="me-1" size={16} />
                Crear Primer Evento
              </button>
            </div>
          )}

          {/* Vista de Calendario */}
          {!loading && !error && vistaActual === 'calendario' && (
            <CalendarioEventos
              eventos={eventos}
              onVerDetalles={manejarVerDetalles}
            />
          )}

        </div>
      </div>

      {/* Modal para Crear Evento - Componente funcional completo */}
      <CrearEventoModal
        show={mostrarModalCrear}
        onHide={cerrarModales}
        usuario={usuario}
        onEventoCreado={manejarEventoCreado}
      />

      {/* Modal para Ver Detalles */}
      {mostrarModalDetalles && eventoSeleccionado && (
        <SimpleModal
          open={mostrarModalDetalles}
          onClose={cerrarModales}
          title={`Detalles: ${eventoSeleccionado.title}`}
        >
          <DetallesEventoModal evento={eventoSeleccionado} />
        </SimpleModal>
      )}
    </div>
  );
}

export default Reuniones;