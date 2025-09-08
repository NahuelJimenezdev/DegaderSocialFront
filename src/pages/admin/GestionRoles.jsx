import React, { useState, useEffect } from 'react';
import { Users, Shield, MapPin, Briefcase, Search, Plus, Edit, Save, X } from 'lucide-react';
import ModalEdicionRoles from '../../components/admin/ModalEdicionRoles';

const GestionRoles = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('todos');
  const [filtroMinisterio, setFiltroMinisterio] = useState('todos');

  // Configuración de roles y niveles
  const nivelesJerarquicos = [
    { value: 'nacional', label: 'Nacional', color: 'danger' },
    { value: 'regional', label: 'Regional', color: 'warning' },
    { value: 'municipal', label: 'Municipal', color: 'info' },
    { value: 'barrio', label: 'Barrio', color: 'success' },
    { value: 'local', label: 'Local', color: 'secondary' }
  ];

  const roles = [
    'Founder', 'admin', 'Desarrollador',
    'Director Nacional', 'Director Regional', 'Director Municipal', 'Organizador Barrio',
    'Director', 'Subdirector', 'Encargado', 'Profesional', 'Miembro', 'visitante'
  ];

  const ministerios = [
    { value: 'musica', label: 'Música y Alabanza', icon: '🎵' },
    { value: 'caballeros', label: 'Caballeros', icon: '🤵' },
    { value: 'damas', label: 'Damas', icon: '👩' },
    { value: 'escuela_dominical', label: 'Escuela Dominical', icon: '📚' },
    { value: 'evangelismo', label: 'Evangelismo', icon: '✝️' },
    { value: 'limpieza', label: 'Limpieza', icon: '🧹' },
    { value: 'cocina', label: 'Cocina', icon: '🍳' },
    { value: 'medios', label: 'Medios y Comunicación', icon: '🎥' },
    { value: 'juventud', label: 'Juventud', icon: '🎯' },
    { value: 'intercesion', label: 'Intercesión', icon: '🙏' },
    { value: 'consejeria', label: 'Consejería', icon: '💬' },
    { value: 'visitacion', label: 'Visitación', icon: '🏠' },
    { value: 'seguridad', label: 'Seguridad', icon: '🛡️' }
  ];

  const cargosMinisteriales = [
    'coordinador', 'asistente', 'miembro', 'lider', 'director',
    'maestro', 'predicador', 'tecnico', 'operador'
  ];

  // Cargar usuarios
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/usuariosInicios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUsuarios(data.usuarios || []);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalEdicion = (usuario) => {
    setUsuarioSeleccionado({
      ...usuario,
      estructuraOrganizacional: usuario.estructuraOrganizacional || {
        nivelJerarquico: 'local',
        areaResponsabilidad: {},
        rolesMinisteriales: [],
        permisos: {}
      }
    });
    setMostrarModal(true);
  };

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const nombreCompleto = `${usuario.primernombreUsuario || ''} ${usuario.primerapellidoUsuario || ''}`.toLowerCase();
    const pasaBusqueda = nombreCompleto.includes(busqueda.toLowerCase());

    const pasaNivel = filtroNivel === 'todos' ||
      usuario.estructuraOrganizacional?.nivelJerarquico === filtroNivel;

    const pasaMinisterio = filtroMinisterio === 'todos' ||
      usuario.estructuraOrganizacional?.rolesMinisteriales?.some(rol =>
        rol.ministerio === filtroMinisterio && rol.activo
      );

    return pasaBusqueda && pasaNivel && pasaMinisterio;
  });

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h3 mb-1">
                <Shield className="me-2" size={28} />
                Gestión de Roles y Ministerios
              </h2>
              <p className="text-muted">Administra la estructura organizacional de la iglesia</p>
            </div>
            <div className="d-flex gap-2">
              <span className="badge bg-info">{usuarios.length} usuarios</span>
              <span className="badge bg-success">{usuariosFiltrados.length} visibles</span>
            </div>
          </div>

          {/* Filtros */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Buscar usuario</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre o apellido..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Nivel jerárquico</label>
                  <select
                    className="form-select"
                    value={filtroNivel}
                    onChange={(e) => setFiltroNivel(e.target.value)}
                  >
                    <option value="todos">Todos los niveles</option>
                    {nivelesJerarquicos.map(nivel => (
                      <option key={nivel.value} value={nivel.value}>
                        {nivel.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Ministerio</label>
                  <select
                    className="form-select"
                    value={filtroMinisterio}
                    onChange={(e) => setFiltroMinisterio(e.target.value)}
                  >
                    <option value="todos">Todos los ministerios</option>
                    {ministerios.map(ministerio => (
                      <option key={ministerio.value} value={ministerio.value}>
                        {ministerio.icon} {ministerio.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de usuarios */}
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <Users className="me-2" size={20} />
                Lista de Usuarios
              </h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Usuario</th>
                        <th>Rol Principal</th>
                        <th>Nivel</th>
                        <th>Ministerios</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map(usuario => (
                        <UsuarioRow
                          key={usuario._id}
                          usuario={usuario}
                          onEditar={abrirModalEdicion}
                          nivelesJerarquicos={nivelesJerarquicos}
                          ministerios={ministerios}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {mostrarModal && usuarioSeleccionado && (
        <ModalEdicionRoles
          usuario={usuarioSeleccionado}
          onCerrar={() => {
            setMostrarModal(false);
            setUsuarioSeleccionado(null);
          }}
          onGuardar={async (usuarioActualizado) => {
            await cargarUsuarios();
            setMostrarModal(false);
            setUsuarioSeleccionado(null);
          }}
          roles={roles}
          nivelesJerarquicos={nivelesJerarquicos}
          ministerios={ministerios}
          cargosMinisteriales={cargosMinisteriales}
        />
      )}
    </div>
  );
};

// Componente para cada fila de usuario
const UsuarioRow = ({ usuario, onEditar, nivelesJerarquicos, ministerios }) => {
  const nivel = nivelesJerarquicos.find(n => n.value === usuario.estructuraOrganizacional?.nivelJerarquico);
  const rolesMinisteriales = usuario.estructuraOrganizacional?.rolesMinisteriales?.filter(rol => rol.activo) || [];

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <img
            src={usuario.fotoPerfil ? `http://localhost:3001${usuario.fotoPerfil}` : `https://ui-avatars.com/api/?name=${usuario.primernombreUsuario}+${usuario.primerapellidoUsuario}&size=40&background=007bff&color=fff`}
            alt={`${usuario.primernombreUsuario} ${usuario.primerapellidoUsuario}`}
            className="rounded-circle me-3"
            width="40"
            height="40"
          />
          <div>
            <div className="fw-medium">{usuario.primernombreUsuario} {usuario.primerapellidoUsuario}</div>
            <small className="text-muted">{usuario.correoUsuario}</small>
          </div>
        </div>
      </td>
      <td>
        <span className={`badge bg-${usuario.rolUsuario === 'admin' ? 'danger' : usuario.rolUsuario === 'Director' ? 'warning' : 'primary'}`}>
          {usuario.rolUsuario}
        </span>
      </td>
      <td>
        {nivel && (
          <span className={`badge bg-${nivel.color}`}>
            {nivel.label}
          </span>
        )}
      </td>
      <td>
        <div className="d-flex flex-wrap gap-1">
          {rolesMinisteriales.slice(0, 2).map((rol, index) => {
            const ministerio = ministerios.find(m => m.value === rol.ministerio);
            return (
              <span key={index} className="badge bg-light text-dark border" title={`${ministerio?.label} - ${rol.cargo}`}>
                {ministerio?.icon} {rol.cargo}
              </span>
            );
          })}
          {rolesMinisteriales.length > 2 && (
            <span className="badge bg-secondary">+{rolesMinisteriales.length - 2}</span>
          )}
        </div>
      </td>
      <td>
        <span className={`badge bg-${usuario.estadoUsuario === 'activo' ? 'success' : usuario.estadoUsuario === 'pendiente' ? 'warning' : 'danger'}`}>
          {usuario.estadoUsuario}
        </span>
      </td>
      <td>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => onEditar(usuario)}
          title="Editar roles"
        >
          <Edit size={14} />
        </button>
      </td>
    </tr>
  );
};

export default GestionRoles;
