import React, { useState, useEffect } from 'react';
import { Lock, Users, Eye, EyeOff, Shield, Clock, UserCheck, AlertCircle } from 'lucide-react';
import SelectorContactos from '../ui/SelectorContactos';

const ConfiguracionPrivacidad = ({ evento, onChange, usuarios = [], loading = false }) => {
  const [configuracion, setConfiguracion] = useState({
    tipoPrivacidad: 'publico',
    visibilidad: 'publico',
    aprobacion: {
      requerida: false,
      autorPersonaAprueba: '',
      mensajeAprobacion: '',
      tiempoLimiteAprobacion: 24,
      aprobarAutomaticamente: false
    },
    registros: {
      permitirAutoRegistro: true,
      limiteAsistentes: null,
      requiereConfirmacion: false,
      corteFechaRegistro: '',
      camposAdicionales: []
    },
    listaEspera: {
      activa: false,
      limite: null,
      notificarCuandoHayEspacio: true
    }
  });

  useEffect(() => {
    if (evento?.configuracionPrivacidad) {
      setConfiguracion(evento.configuracionPrivacidad);
    }
  }, [evento]);

  const handleChange = (campo, valor) => {
    const nuevaConfiguracion = {
      ...configuracion,
      [campo]: valor
    };
    setConfiguracion(nuevaConfiguracion);
    onChange?.(nuevaConfiguracion);
  };

  const handleNestedChange = (seccion, campo, valor) => {
    const nuevaConfiguracion = {
      ...configuracion,
      [seccion]: {
        ...configuracion[seccion],
        [campo]: valor
      }
    };
    setConfiguracion(nuevaConfiguracion);
    onChange?.(nuevaConfiguracion);
  };

  const agregarCampoAdicional = () => {
    const nuevosCampos = [...configuracion.registros.camposAdicionales, {
      nombre: '',
      tipo: 'texto',
      requerido: false,
      opciones: []
    }];
    handleNestedChange('registros', 'camposAdicionales', nuevosCampos);
  };

  const eliminarCampoAdicional = (index) => {
    const nuevosCampos = configuracion.registros.camposAdicionales.filter((_, i) => i !== index);
    handleNestedChange('registros', 'camposAdicionales', nuevosCampos);
  };

  const actualizarCampoAdicional = (index, campo, valor) => {
    const nuevosCampos = [...configuracion.registros.camposAdicionales];
    nuevosCampos[index] = {
      ...nuevosCampos[index],
      [campo]: valor
    };
    handleNestedChange('registros', 'camposAdicionales', nuevosCampos);
  };

  return (
    <div className="configuracion-privacidad">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <Lock className="me-2" size={20} />
            Configuración de Privacidad
          </h5>
        </div>
        <div className="card-body">

          {/* Tipo de Privacidad */}
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">
                <Shield className="me-2" size={16} />
                Tipo de Privacidad
              </label>
              <select
                className="form-select"
                value={configuracion.tipoPrivacidad}
                onChange={(e) => handleChange('tipoPrivacidad', e.target.value)}
              >
                <option value="publico">🌐 Público</option>
                <option value="privado">🔒 Privado</option>
                <option value="solo_invitados">👥 Solo Invitados</option>
                <option value="ministerial">⛪ Ministerial</option>
                <option value="organizacional">🏢 Organizacional</option>
              </select>
              <small className="text-muted">
                {configuracion.tipoPrivacidad === 'publico' && 'Cualquiera puede ver y registrarse'}
                {configuracion.tipoPrivacidad === 'privado' && 'Solo miembros pueden ver el evento'}
                {configuracion.tipoPrivacidad === 'solo_invitados' && 'Solo personas invitadas pueden participar'}
                {configuracion.tipoPrivacidad === 'ministerial' && 'Solo miembros de ministerios específicos'}
                {configuracion.tipoPrivacidad === 'organizacional' && 'Solo roles organizacionales específicos'}
              </small>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                <Eye className="me-2" size={16} />
                Visibilidad
              </label>
              <select
                className="form-select"
                value={configuracion.visibilidad}
                onChange={(e) => handleChange('visibilidad', e.target.value)}
              >
                <option value="publico">👁️ Público</option>
                <option value="miembros">👥 Solo Miembros</option>
                <option value="invitados">📬 Solo Invitados</option>
                <option value="oculto">🙈 Oculto</option>
              </select>
              <small className="text-muted">
                Controla quién puede ver que existe este evento
              </small>
            </div>
          </div>

          {/* Configuración de Aprobación */}
          <div className="border rounded p-3 mb-4">
            <h6 className="fw-bold mb-3">
              <UserCheck className="me-2" size={16} />
              Configuración de Aprobación
            </h6>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="requiereAprobacion"
                checked={configuracion.aprobacion.requerida}
                onChange={(e) => handleNestedChange('aprobacion', 'requerida', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="requiereAprobacion">
                <strong>Requiere aprobación manual</strong>
                <small className="d-block text-muted">
                  Los registros deben ser aprobados antes de confirmar asistencia
                </small>
              </label>
            </div>

            {configuracion.aprobacion.requerida && (
              <>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Persona que aprueba</label>
                    <SelectorContactos
                      contactos={usuarios}
                      loading={loading}
                      valorSeleccionado={configuracion.aprobacion.autorPersonaAprueba}
                      onChange={(valor) => handleNestedChange('aprobacion', 'autorPersonaAprueba', valor)}
                      placeholder="Seleccionar persona que aprueba..."
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Tiempo límite (horas)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={configuracion.aprobacion.tiempoLimiteAprobacion}
                      onChange={(e) => handleNestedChange('aprobacion', 'tiempoLimiteAprobacion', parseInt(e.target.value))}
                      min="1"
                      max="168"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Mensaje de aprobación</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={configuracion.aprobacion.mensajeAprobacion}
                    onChange={(e) => handleNestedChange('aprobacion', 'mensajeAprobacion', e.target.value)}
                    placeholder="Mensaje que verán los usuarios mientras esperan aprobación..."
                    maxLength="500"
                  />
                  <small className="text-muted">
                    {configuracion.aprobacion.mensajeAprobacion.length}/500 caracteres
                  </small>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="aprobarAutomaticamente"
                    checked={configuracion.aprobacion.aprobarAutomaticamente}
                    onChange={(e) => handleNestedChange('aprobacion', 'aprobarAutomaticamente', e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="aprobarAutomaticamente">
                    Aprobar automáticamente después del tiempo límite
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Configuración de Registros */}
          <div className="border rounded p-3 mb-4">
            <h6 className="fw-bold mb-3">
              <Users className="me-2" size={16} />
              Configuración de Registros
            </h6>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="permitirAutoRegistro"
                    checked={configuracion.registros.permitirAutoRegistro}
                    onChange={(e) => handleNestedChange('registros', 'permitirAutoRegistro', e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="permitirAutoRegistro">
                    Permitir auto-registro
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="requiereConfirmacion"
                    checked={configuracion.registros.requiereConfirmacion}
                    onChange={(e) => handleNestedChange('registros', 'requiereConfirmacion', e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="requiereConfirmacion">
                    Requiere confirmación por email
                  </label>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Límite de asistentes</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  value={configuracion.registros.limiteAsistentes || ''}
                  onChange={(e) => handleNestedChange('registros', 'limiteAsistentes', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Sin límite"
                  min="1"
                />

                <label className="form-label">Corte de fecha de registro</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={configuracion.registros.corteFechaRegistro}
                  onChange={(e) => handleNestedChange('registros', 'corteFechaRegistro', e.target.value)}
                />
              </div>
            </div>

            {/* Campos Adicionales */}
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label fw-bold mb-0">Campos adicionales de registro</label>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={agregarCampoAdicional}
                >
                  + Agregar Campo
                </button>
              </div>

              {configuracion.registros.camposAdicionales.map((campo, index) => (
                <div key={index} className="border rounded p-2 mb-2">
                  <div className="row align-items-center">
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Nombre del campo"
                        value={campo.nombre}
                        onChange={(e) => actualizarCampoAdicional(index, 'nombre', e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select form-select-sm"
                        value={campo.tipo}
                        onChange={(e) => actualizarCampoAdicional(index, 'tipo', e.target.value)}
                      >
                        <option value="texto">Texto</option>
                        <option value="numero">Número</option>
                        <option value="email">Email</option>
                        <option value="telefono">Teléfono</option>
                        <option value="seleccion">Selección</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      {campo.tipo === 'seleccion' && (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Opciones separadas por coma"
                          value={campo.opciones?.join(', ') || ''}
                          onChange={(e) => actualizarCampoAdicional(index, 'opciones', e.target.value.split(', ').filter(o => o.trim()))}
                        />
                      )}
                    </div>
                    <div className="col-md-1">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={campo.requerido}
                          onChange={(e) => actualizarCampoAdicional(index, 'requerido', e.target.checked)}
                          title="Requerido"
                        />
                      </div>
                    </div>
                    <div className="col-md-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarCampoAdicional(index)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de Espera */}
          <div className="border rounded p-3">
            <h6 className="fw-bold mb-3">
              <Clock className="me-2" size={16} />
              Lista de Espera
            </h6>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="listaEsperaActiva"
                checked={configuracion.listaEspera.activa}
                onChange={(e) => handleNestedChange('listaEspera', 'activa', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="listaEsperaActiva">
                <strong>Activar lista de espera</strong>
                <small className="d-block text-muted">
                  Cuando el evento esté lleno, nuevos registros van a lista de espera
                </small>
              </label>
            </div>

            {configuracion.listaEspera.activa && (
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Límite de lista de espera</label>
                  <input
                    type="number"
                    className="form-control"
                    value={configuracion.listaEspera.limite || ''}
                    onChange={(e) => handleNestedChange('listaEspera', 'limite', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Sin límite"
                    min="1"
                  />
                </div>
                <div className="col-md-6 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="notificarEspacio"
                      checked={configuracion.listaEspera.notificarCuandoHayEspacio}
                      onChange={(e) => handleNestedChange('listaEspera', 'notificarCuandoHayEspacio', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="notificarEspacio">
                      Notificar cuando hay espacio
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alerta de configuración */}
          {(configuracion.tipoPrivacidad === 'solo_invitados' || configuracion.aprobacion.requerida) && (
            <div className="alert alert-info mt-3" role="alert">
              <AlertCircle className="me-2" size={16} />
              <strong>Atención:</strong> Con esta configuración, será necesario que gestiones manualmente los accesos al evento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionPrivacidad;
