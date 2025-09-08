import React from 'react';
import { Lock, Users, Eye, EyeOff, Shield, Clock, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';

const VistaPrivacidadEvento = ({ evento, esOrganizador = false }) => {
  const { configuracionPrivacidad } = evento || {};

  if (!configuracionPrivacidad) {
    return (
      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        Este evento utiliza configuración de privacidad básica.
      </div>
    );
  }

  const obtenerIconoTipoPrivacidad = (tipo) => {
    switch (tipo) {
      case 'publico': return '🌐';
      case 'privado': return '🔒';
      case 'solo_invitados': return '👥';
      case 'ministerial': return '⛪';
      case 'organizacional': return '🏢';
      default: return '🌐';
    }
  };

  const obtenerTextoTipoPrivacidad = (tipo) => {
    switch (tipo) {
      case 'publico': return 'Público';
      case 'privado': return 'Privado';
      case 'solo_invitados': return 'Solo Invitados';
      case 'ministerial': return 'Ministerial';
      case 'organizacional': return 'Organizacional';
      default: return 'Público';
    }
  };

  const obtenerIconoVisibilidad = (visibilidad) => {
    switch (visibilidad) {
      case 'publico': return <Eye size={16} />;
      case 'miembros': return <Users size={16} />;
      case 'invitados': return <UserCheck size={16} />;
      case 'oculto': return <EyeOff size={16} />;
      default: return <Eye size={16} />;
    }
  };

  const obtenerTextoVisibilidad = (visibilidad) => {
    switch (visibilidad) {
      case 'publico': return 'Visible públicamente';
      case 'miembros': return 'Solo visible para miembros';
      case 'invitados': return 'Solo visible para invitados';
      case 'oculto': return 'Evento oculto';
      default: return 'Visible públicamente';
    }
  };

  return (
    <div className="configuracion-privacidad-vista">
      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">
            <Shield className="me-2" size={18} />
            Configuración de Privacidad
          </h6>
        </div>
        <div className="card-body">

          {/* Tipo de Privacidad y Visibilidad */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-2">
                <span className="me-2" style={{ fontSize: '1.2em' }}>
                  {obtenerIconoTipoPrivacidad(configuracionPrivacidad.tipoPrivacidad)}
                </span>
                <div>
                  <strong>{obtenerTextoTipoPrivacidad(configuracionPrivacidad.tipoPrivacidad)}</strong>
                  <div className="small text-muted">Tipo de evento</div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-2">
                {obtenerIconoVisibilidad(configuracionPrivacidad.visibilidad)}
                <div className="ms-2">
                  <strong>{obtenerTextoVisibilidad(configuracionPrivacidad.visibilidad)}</strong>
                  <div className="small text-muted">Quién puede verlo</div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración de Aprobación */}
          {configuracionPrivacidad.aprobacion?.requerida && (
            <div className="alert alert-warning mb-3">
              <div className="d-flex align-items-center">
                <UserCheck className="me-2" size={18} />
                <div className="flex-grow-1">
                  <strong>Requiere Aprobación Manual</strong>
                  <div className="small">
                    Los registros deben ser aprobados antes de confirmar la asistencia.
                  </div>
                  {configuracionPrivacidad.aprobacion.tiempoLimiteAprobacion && (
                    <div className="small text-muted mt-1">
                      <Clock size={14} className="me-1" />
                      Tiempo límite: {configuracionPrivacidad.aprobacion.tiempoLimiteAprobacion} horas
                    </div>
                  )}
                </div>
              </div>

              {configuracionPrivacidad.aprobacion.mensajeAprobacion && (
                <div className="mt-2 p-2 bg-light rounded">
                  <small className="text-muted">Mensaje de aprobación:</small>
                  <div>{configuracionPrivacidad.aprobacion.mensajeAprobacion}</div>
                </div>
              )}
            </div>
          )}

          {/* Configuración de Registros */}
          <div className="row mb-3">
            <div className="col-12">
              <h6 className="fw-bold mb-2">
                <Users className="me-2" size={16} />
                Configuración de Registros
              </h6>

              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-2">
                    {configuracionPrivacidad.registros?.permitirAutoRegistro ? (
                      <CheckCircle className="text-success me-2" size={16} />
                    ) : (
                      <AlertCircle className="text-warning me-2" size={16} />
                    )}
                    <span>
                      {configuracionPrivacidad.registros?.permitirAutoRegistro
                        ? 'Auto-registro habilitado'
                        : 'Auto-registro deshabilitado'
                      }
                    </span>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    {configuracionPrivacidad.registros?.requiereConfirmacion ? (
                      <CheckCircle className="text-info me-2" size={16} />
                    ) : (
                      <AlertCircle className="text-muted me-2" size={16} />
                    )}
                    <span>
                      {configuracionPrivacidad.registros?.requiereConfirmacion
                        ? 'Requiere confirmación por email'
                        : 'No requiere confirmación'
                      }
                    </span>
                  </div>
                </div>

                <div className="col-md-6">
                  {configuracionPrivacidad.registros?.limiteAsistentes && (
                    <div className="d-flex align-items-center mb-2">
                      <Users className="text-primary me-2" size={16} />
                      <span>Límite: {configuracionPrivacidad.registros.limiteAsistentes} asistentes</span>
                    </div>
                  )}

                  {configuracionPrivacidad.registros?.corteFechaRegistro && (
                    <div className="d-flex align-items-center mb-2">
                      <Clock className="text-danger me-2" size={16} />
                      <span>
                        Corte: {new Date(configuracionPrivacidad.registros.corteFechaRegistro).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Campos Adicionales */}
          {configuracionPrivacidad.registros?.camposAdicionales?.length > 0 && (
            <div className="mb-3">
              <h6 className="fw-bold mb-2">Información Adicional Requerida:</h6>
              <div className="row">
                {configuracionPrivacidad.registros.camposAdicionales.map((campo, index) => (
                  <div key={index} className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-secondary me-2">{campo.tipo}</span>
                      <span>
                        {campo.nombre}
                        {campo.requerido && <span className="text-danger">*</span>}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Espera */}
          {configuracionPrivacidad.listaEspera?.activa && (
            <div className="alert alert-info mb-0">
              <div className="d-flex align-items-center">
                <Clock className="me-2" size={18} />
                <div>
                  <strong>Lista de Espera Activa</strong>
                  <div className="small">
                    Si el evento se llena, nuevos registros irán a lista de espera.
                    {configuracionPrivacidad.listaEspera.limite && (
                      <span> Límite de espera: {configuracionPrivacidad.listaEspera.limite}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Solo para organizadores */}
          {esOrganizador && (
            <div className="mt-3 pt-3 border-top">
              <small className="text-muted">
                <Lock size={14} className="me-1" />
                Solo tú puedes ver esta configuración de privacidad completa.
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VistaPrivacidadEvento;
