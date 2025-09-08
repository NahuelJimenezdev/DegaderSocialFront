import React, { useState } from 'react';
import { Save, X, Plus, Trash2, MapPin, Shield, Users, Settings } from 'lucide-react';

const ModalEdicionRoles = ({
  usuario,
  onCerrar,
  onGuardar,
  roles,
  nivelesJerarquicos,
  ministerios,
  cargosMinisteriales
}) => {
  const [datosUsuario, setDatosUsuario] = useState({
    rolUsuario: usuario.rolUsuario || 'Miembro',
    estructuraOrganizacional: {
      nivelJerarquico: usuario.estructuraOrganizacional?.nivelJerarquico || 'local',
      areaResponsabilidad: usuario.estructuraOrganizacional?.areaResponsabilidad || {},
      rolesMinisteriales: usuario.estructuraOrganizacional?.rolesMinisteriales || [],
      permisos: usuario.estructuraOrganizacional?.permisos || {}
    }
  });

  const [tabActiva, setTabActiva] = useState('roles');
  const [guardando, setGuardando] = useState(false);

  const actualizarCampo = (campo, valor) => {
    if (campo === 'rolUsuario') {
      setDatosUsuario(prev => ({
        ...prev,
        rolUsuario: valor
      }));
    } else {
      setDatosUsuario(prev => ({
        ...prev,
        estructuraOrganizacional: {
          ...prev.estructuraOrganizacional,
          [campo]: valor
        }
      }));
    }
  };

  const agregarRolMinisterial = () => {
    const nuevosRoles = [...datosUsuario.estructuraOrganizacional.rolesMinisteriales];
    nuevosRoles.push({
      ministerio: ministerios[0].value,
      cargo: cargosMinisteriales[0],
      activo: true,
      fechaAsignacion: new Date()
    });
    actualizarCampo('rolesMinisteriales', nuevosRoles);
  };

  const actualizarRolMinisterial = (index, campo, valor) => {
    const nuevosRoles = [...datosUsuario.estructuraOrganizacional.rolesMinisteriales];
    nuevosRoles[index] = { ...nuevosRoles[index], [campo]: valor };
    actualizarCampo('rolesMinisteriales', nuevosRoles);
  };

  const eliminarRolMinisterial = (index) => {
    const nuevosRoles = datosUsuario.estructuraOrganizacional.rolesMinisteriales.filter((_, i) => i !== index);
    actualizarCampo('rolesMinisteriales', nuevosRoles);
  };

  const actualizarPermiso = (permiso, valor) => {
    const nuevosPermisos = {
      ...datosUsuario.estructuraOrganizacional.permisos,
      [permiso]: valor
    };
    actualizarCampo('permisos', nuevosPermisos);
  };

  const manejarGuardar = async () => {
    try {
      setGuardando(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:3001/api/roles/asignar/${usuario._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosUsuario)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Roles actualizados:', data);
        onGuardar(data.usuario);
      } else {
        const error = await response.json();
        console.error('❌ Error al actualizar roles:', error);
        alert('Error al actualizar roles: ' + error.message);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error de conexión');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <Shield className="me-2" size={20} />
              Editar Roles - {usuario.primernombreUsuario} {usuario.primerapellidoUsuario}
            </h5>
            <button className="btn-close" onClick={onCerrar}></button>
          </div>

          <div className="modal-body">
            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${tabActiva === 'roles' ? 'active' : ''}`}
                  onClick={() => setTabActiva('roles')}
                >
                  <Shield size={16} className="me-1" />
                  Roles y Jerarquía
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${tabActiva === 'ministerios' ? 'active' : ''}`}
                  onClick={() => setTabActiva('ministerios')}
                >
                  <Users size={16} className="me-1" />
                  Ministerios
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${tabActiva === 'ubicacion' ? 'active' : ''}`}
                  onClick={() => setTabActiva('ubicacion')}
                >
                  <MapPin size={16} className="me-1" />
                  Área Geográfica
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${tabActiva === 'permisos' ? 'active' : ''}`}
                  onClick={() => setTabActiva('permisos')}
                >
                  <Settings size={16} className="me-1" />
                  Permisos
                </button>
              </li>
            </ul>

            {/* Tab Roles y Jerarquía */}
            {tabActiva === 'roles' && (
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Rol Principal</label>
                    <select
                      className="form-select"
                      value={datosUsuario.rolUsuario}
                      onChange={(e) => actualizarCampo('rolUsuario', e.target.value)}
                    >
                      {roles.map(rol => (
                        <option key={rol} value={rol}>{rol}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Nivel Jerárquico</label>
                    <select
                      className="form-select"
                      value={datosUsuario.estructuraOrganizacional.nivelJerarquico}
                      onChange={(e) => actualizarCampo('nivelJerarquico', e.target.value)}
                    >
                      {nivelesJerarquicos.map(nivel => (
                        <option key={nivel.value} value={nivel.value}>
                          {nivel.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Ministerios */}
            {tabActiva === 'ministerios' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6>Roles Ministeriales</h6>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={agregarRolMinisterial}
                  >
                    <Plus size={16} className="me-1" />
                    Agregar Ministerio
                  </button>
                </div>

                {datosUsuario.estructuraOrganizacional.rolesMinisteriales.map((rol, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-4">
                          <label className="form-label">Ministerio</label>
                          <select
                            className="form-select"
                            value={rol.ministerio}
                            onChange={(e) => actualizarRolMinisterial(index, 'ministerio', e.target.value)}
                          >
                            {ministerios.map(ministerio => (
                              <option key={ministerio.value} value={ministerio.value}>
                                {ministerio.icon} {ministerio.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Cargo</label>
                          <select
                            className="form-select"
                            value={rol.cargo}
                            onChange={(e) => actualizarRolMinisterial(index, 'cargo', e.target.value)}
                          >
                            {cargosMinisteriales.map(cargo => (
                              <option key={cargo} value={cargo}>
                                {cargo.charAt(0).toUpperCase() + cargo.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Estado</label>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={rol.activo}
                              onChange={(e) => actualizarRolMinisterial(index, 'activo', e.target.checked)}
                            />
                            <label className="form-check-label">
                              {rol.activo ? 'Activo' : 'Inactivo'}
                            </label>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarRolMinisterial(index)}
                            title="Eliminar ministerio"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {datosUsuario.estructuraOrganizacional.rolesMinisteriales.length === 0 && (
                  <div className="text-center py-4 text-muted">
                    <Users size={48} className="mb-2 opacity-50" />
                    <p>No hay ministerios asignados</p>
                    <small>Haz clic en "Agregar Ministerio" para comenzar</small>
                  </div>
                )}
              </div>
            )}

            {/* Tab Área Geográfica */}
            {tabActiva === 'ubicacion' && (
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">País</label>
                    <input
                      type="text"
                      className="form-control"
                      value={datosUsuario.estructuraOrganizacional.areaResponsabilidad.pais || ''}
                      onChange={(e) => actualizarCampo('areaResponsabilidad', {
                        ...datosUsuario.estructuraOrganizacional.areaResponsabilidad,
                        pais: e.target.value
                      })}
                      placeholder="Ej: Argentina"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Región</label>
                    <input
                      type="text"
                      className="form-control"
                      value={datosUsuario.estructuraOrganizacional.areaResponsabilidad.region || ''}
                      onChange={(e) => actualizarCampo('areaResponsabilidad', {
                        ...datosUsuario.estructuraOrganizacional.areaResponsabilidad,
                        region: e.target.value
                      })}
                      placeholder="Ej: Buenos Aires"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Municipio</label>
                    <input
                      type="text"
                      className="form-control"
                      value={datosUsuario.estructuraOrganizacional.areaResponsabilidad.municipio || ''}
                      onChange={(e) => actualizarCampo('areaResponsabilidad', {
                        ...datosUsuario.estructuraOrganizacional.areaResponsabilidad,
                        municipio: e.target.value
                      })}
                      placeholder="Ej: La Plata"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Barrio</label>
                    <input
                      type="text"
                      className="form-control"
                      value={datosUsuario.estructuraOrganizacional.areaResponsabilidad.barrio || ''}
                      onChange={(e) => actualizarCampo('areaResponsabilidad', {
                        ...datosUsuario.estructuraOrganizacional.areaResponsabilidad,
                        barrio: e.target.value
                      })}
                      placeholder="Ej: Centro"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab Permisos */}
            {tabActiva === 'permisos' && (
              <div className="row">
                <div className="col-md-6">
                  <h6 className="mb-3">Permisos de Eventos</h6>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={datosUsuario.estructuraOrganizacional.permisos.crearEventos || false}
                      onChange={(e) => actualizarPermiso('crearEventos', e.target.checked)}
                    />
                    <label className="form-check-label">Crear eventos</label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={datosUsuario.estructuraOrganizacional.permisos.aprobarEventos || false}
                      onChange={(e) => actualizarPermiso('aprobarEventos', e.target.checked)}
                    />
                    <label className="form-check-label">Aprobar eventos</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 className="mb-3">Permisos Administrativos</h6>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={datosUsuario.estructuraOrganizacional.permisos.gestionarUsuarios || false}
                      onChange={(e) => actualizarPermiso('gestionarUsuarios', e.target.checked)}
                    />
                    <label className="form-check-label">Gestionar usuarios</label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={datosUsuario.estructuraOrganizacional.permisos.gestionarMinisterios || false}
                      onChange={(e) => actualizarPermiso('gestionarMinisterios', e.target.checked)}
                    />
                    <label className="form-check-label">Gestionar ministerios</label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={datosUsuario.estructuraOrganizacional.permisos.accederReportes || false}
                      onChange={(e) => actualizarPermiso('accederReportes', e.target.checked)}
                    />
                    <label className="form-check-label">Acceder a reportes</label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={datosUsuario.estructuraOrganizacional.permisos.moderarContenido || false}
                      onChange={(e) => actualizarPermiso('moderarContenido', e.target.checked)}
                    />
                    <label className="form-check-label">Moderar contenido</label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCerrar}>
              <X size={16} className="me-1" />
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={manejarGuardar}
              disabled={guardando}
            >
              {guardando ? (
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Guardando...</span>
                </div>
              ) : (
                <Save size={16} className="me-1" />
              )}
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEdicionRoles;
