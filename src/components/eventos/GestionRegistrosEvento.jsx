import React, { useState, useEffect } from 'react';
import { UserCheck, Clock, CheckCircle, XCircle, Eye, MessageSquare, Calendar } from 'lucide-react';

const GestionRegistrosEvento = ({ eventoId, configuracionPrivacidad, onRegistroActualizado }) => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [mensajeRespuesta, setMensajeRespuesta] = useState('');

  useEffect(() => {
    cargarRegistros();
  }, [eventoId]);

  const cargarRegistros = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/eventos/${eventoId}/registros`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRegistros(data.registros || []);
      }
    } catch (error) {
      console.error('Error al cargar registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const aprobarRegistro = async (registroId, mensaje = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/eventos/${eventoId}/registros/${registroId}/aprobar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mensaje })
      });

      if (response.ok) {
        await cargarRegistros();
        onRegistroActualizado?.();
        setMostrarModal(false);
        setMensajeRespuesta('');
      }
    } catch (error) {
      console.error('Error al aprobar registro:', error);
    }
  };

  const rechazarRegistro = async (registroId, mensaje) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/eventos/${eventoId}/registros/${registroId}/rechazar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mensaje })
      });

      if (response.ok) {
        await cargarRegistros();
        onRegistroActualizado?.();
        setMostrarModal(false);
        setMensajeRespuesta('');
      }
    } catch (error) {
      console.error('Error al rechazar registro:', error);
    }
  };

  const registrosFiltrados = registros.filter(registro => {
    if (filtro === 'todos') return true;
    return registro.estadoAsistencia === filtro;
  });

  const conteoRegistros = {
    pendiente: registros.filter(r => r.estadoAsistencia === 'pendiente').length,
    confirmado: registros.filter(r => r.estadoAsistencia === 'confirmado').length,
    rechazado: registros.filter(r => r.estadoAsistencia === 'rechazado').length,
    lista_espera: registros.filter(r => r.estadoAsistencia === 'lista_espera').length
  };

  const obtenerBadgeEstado = (estado) => {
    switch (estado) {
      case 'pendiente':
        return <span className="badge bg-warning">⏳ Pendiente</span>;
      case 'confirmado':
        return <span className="badge bg-success">✅ Confirmado</span>;
      case 'rechazado':
        return <span className="badge bg-danger">❌ Rechazado</span>;
      case 'lista_espera':
        return <span className="badge bg-info">📋 Lista de Espera</span>;
      default:
        return <span className="badge bg-secondary">{estado}</span>;
    }
  };

  const tiempoRestante = (registro) => {
    if (!configuracionPrivacidad?.aprobacion?.tiempoLimiteAprobacion) return null;

    const fechaRegistro = new Date(registro.fechaRegistro);
    const tiempoLimite = configuracionPrivacidad.aprobacion.tiempoLimiteAprobacion * 60 * 60 * 1000; // horas a ms
    const tiempoTranscurrido = Date.now() - fechaRegistro.getTime();
    const tiempoRestante = tiempoLimite - tiempoTranscurrido;

    if (tiempoRestante <= 0) return '⏰ Tiempo vencido';

    const horasRestantes = Math.floor(tiempoRestante / (1000 * 60 * 60));
    const minutosRestantes = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));

    return `⏱️ ${horasRestantes}h ${minutosRestantes}m restantes`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="gestion-registros-evento">
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <UserCheck className="me-2" size={20} />
              Gestión de Registros
            </h5>
            <div className="d-flex gap-2">
              <span className="badge bg-warning">{conteoRegistros.pendiente} Pendientes</span>
              <span className="badge bg-success">{conteoRegistros.confirmado} Confirmados</span>
              {conteoRegistros.lista_espera > 0 && (
                <span className="badge bg-info">{conteoRegistros.lista_espera} En Espera</span>
              )}
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* Filtros */}
          <div className="mb-3">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn ${filtro === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFiltro('todos')}
              >
                Todos ({registros.length})
              </button>
              <button
                type="button"
                className={`btn ${filtro === 'pendiente' ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={() => setFiltro('pendiente')}
              >
                Pendientes ({conteoRegistros.pendiente})
              </button>
              <button
                type="button"
                className={`btn ${filtro === 'confirmado' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFiltro('confirmado')}
              >
                Confirmados ({conteoRegistros.confirmado})
              </button>
              {conteoRegistros.lista_espera > 0 && (
                <button
                  type="button"
                  className={`btn ${filtro === 'lista_espera' ? 'btn-info' : 'btn-outline-info'}`}
                  onClick={() => setFiltro('lista_espera')}
                >
                  Lista de Espera ({conteoRegistros.lista_espera})
                </button>
              )}
            </div>
          </div>

          {/* Lista de Registros */}
          {registrosFiltrados.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <UserCheck size={48} className="mb-3 opacity-50" />
              <p>No hay registros {filtro !== 'todos' ? `con estado "${filtro}"` : ''}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Fecha de Registro</th>
                    <th>Estado</th>
                    <th>Información Adicional</th>
                    {configuracionPrivacidad?.aprobacion?.requerida && <th>Tiempo</th>}
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {registrosFiltrados.map((registro) => (
                    <tr key={registro._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={registro.usuario?.fotoPerfil || '/default-avatar.png'}
                            alt={registro.usuario?.primernombreUsuario}
                            className="rounded-circle me-2"
                            width="32"
                            height="32"
                          />
                          <div>
                            <div className="fw-bold">
                              {registro.usuario?.primernombreUsuario} {registro.usuario?.primerapellidoUsuario}
                            </div>
                            <small className="text-muted">{registro.usuario?.correoUsuario}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={16} className="me-1 text-muted" />
                          {new Date(registro.fechaRegistro).toLocaleDateString()} <br />
                          <small className="text-muted">
                            {new Date(registro.fechaRegistro).toLocaleTimeString()}
                          </small>
                        </div>
                      </td>
                      <td>{obtenerBadgeEstado(registro.estadoAsistencia)}</td>
                      <td>
                        {registro.informacionAdicional && Object.keys(registro.informacionAdicional).length > 0 ? (
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => {
                              setRegistroSeleccionado(registro);
                              setMostrarModal(true);
                            }}
                          >
                            <Eye size={14} className="me-1" />
                            Ver Info
                          </button>
                        ) : (
                          <span className="text-muted">Sin información adicional</span>
                        )}
                      </td>
                      {configuracionPrivacidad?.aprobacion?.requerida && (
                        <td>
                          {registro.estadoAsistencia === 'pendiente' && (
                            <small className="text-warning">
                              {tiempoRestante(registro)}
                            </small>
                          )}
                        </td>
                      )}
                      <td>
                        {registro.estadoAsistencia === 'pendiente' && (
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => aprobarRegistro(registro._id)}
                              title="Aprobar"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                setRegistroSeleccionado(registro);
                                setMostrarModal(true);
                              }}
                              title="Rechazar"
                            >
                              <XCircle size={14} />
                            </button>
                          </div>
                        )}
                        {registro.estadoAsistencia === 'lista_espera' && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => aprobarRegistro(registro._id)}
                            title="Mover a confirmados"
                          >
                            <CheckCircle size={14} /> Confirmar
                          </button>
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

      {/* Modal para ver información adicional y acciones */}
      {mostrarModal && registroSeleccionado && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Registro de {registroSeleccionado.usuario?.primernombreUsuario}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setMostrarModal(false);
                    setRegistroSeleccionado(null);
                    setMensajeRespuesta('');
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {/* Información Adicional */}
                {registroSeleccionado.informacionAdicional && Object.keys(registroSeleccionado.informacionAdicional).length > 0 && (
                  <div className="mb-3">
                    <h6>Información Adicional:</h6>
                    {Object.entries(registroSeleccionado.informacionAdicional).map(([campo, valor]) => (
                      <div key={campo} className="mb-2">
                        <strong>{campo}:</strong> {valor}
                      </div>
                    ))}
                  </div>
                )}

                {/* Mensaje de respuesta */}
                {registroSeleccionado.estadoAsistencia === 'pendiente' && (
                  <div className="mb-3">
                    <label className="form-label">Mensaje de respuesta (opcional):</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={mensajeRespuesta}
                      onChange={(e) => setMensajeRespuesta(e.target.value)}
                      placeholder="Escribe un mensaje para el usuario..."
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {registroSeleccionado.estadoAsistencia === 'pendiente' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => aprobarRegistro(registroSeleccionado._id, mensajeRespuesta)}
                    >
                      <CheckCircle className="me-1" size={16} />
                      Aprobar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => rechazarRegistro(registroSeleccionado._id, mensajeRespuesta)}
                    >
                      <XCircle className="me-1" size={16} />
                      Rechazar
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setMostrarModal(false);
                    setRegistroSeleccionado(null);
                    setMensajeRespuesta('');
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionRegistrosEvento;
