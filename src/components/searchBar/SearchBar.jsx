import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, Users, MapPin, Loader } from 'lucide-react';


const SearchBar = () => {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null); // <-- ✅ ref para debounce
  const navigate = useNavigate();
  
  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    // Limpia cualquier timeout pendiente al desmontar
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // <-- ✅
  }, []);

  // Función de búsqueda
  const buscar = async (query) => {
    if (!query || query.length < 2) {
      setResultados(null);
      setMostrarResultados(false);
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No autenticado. Inicia sesión primero.');
        return;
      }

      // antes: /api/buscar?  (ya lo tenías bien)
      const response = await fetch(
        `http://localhost:3001/api/buscar?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );


      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.exito) {
        setResultados(data);
        setMostrarResultados(true);
      } else {
        setError(data.mensaje || 'Error en la búsqueda');
        setMostrarResultados(false);
      }

    } catch (error) {
      console.error('Error en búsqueda:', error);
      setError(error.message || 'Error de conexión');
      setResultados(null);
    } finally {
      setCargando(false);
    }
  };

  // Debounce para evitar muchas requests
  const handleChange = (e) => {
    const value = e.target.value;
    setTermino(value);
    setError(null);

    // limpia timeout previo
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // <-- ✅

    if (value.length >= 2) {
      setMostrarResultados(true);
      // Debounce de 300ms
      timeoutRef.current = setTimeout(() => buscar(value), 300);
    } else {
      setResultados(null);
      setMostrarResultados(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (termino.trim()) {
      navigate(`/busqueda?q=${encodeURIComponent(termino)}`);
      setMostrarResultados(false);
    }
  };

  const limpiarBusqueda = () => {
    setTermino('');
    setResultados(null);
    setError(null);
    setMostrarResultados(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // <-- ✅
  };

  const handleFocus = () => {
    if (termino.length >= 2 && resultados) {
      setMostrarResultados(true);
    }
  };

  // Navegación a diferentes páginas
  const navegarAPerfil = (usuarioId) => {
    navigate(`/perfil/${usuarioId}`);
    setMostrarResultados(false);
  };

  const navegarAGrupo = (grupoId) => {
    navigate(`/grupo/${grupoId}`);
    setMostrarResultados(false);
  };

  const navegarAIglesia = (iglesiaId) => {
    navigate(`/iglesia/${iglesiaId}`);
    setMostrarResultados(false);
  };

  return (
    <div className="flex-grow-1 mx-3 mx-lg-5 position-relative" style={{ maxWidth: '560px' }} ref={searchRef}>
      <div className="position-relative">
        <form onSubmit={handleSubmit} className="d-flex align-items-center">
          <div className="position-relative w-100">
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" size={18} />
            <input
              type="text"
              className="form-control rounded-pill ps-5 pe-4 py-2 bg-light border-0 shadow-sm"
              placeholder="Buscar personas, grupos, iglesias..."
              value={termino}
              onChange={handleChange}
              onFocus={handleFocus}
              style={{ fontSize: '0.9rem' }}
            />
            {termino && (
              <button
                type="button"
                onClick={limpiarBusqueda}
                className="position-absolute top-50 end-0 translate-middle-y me-3 btn btn-sm p-0 bg-transparent border-0"
              >
                <X size={16} className="text-secondary" />
              </button>
            )}
          </div>
        </form>

        {/* Dropdown de resultados */}
        {mostrarResultados && (
          <div className="position-absolute top-100 start-0 end-0 mt-2 bg-white border rounded shadow-lg"
            style={{ zIndex: 1050, maxHeight: '400px', overflowY: 'auto' }}>

            {cargando && (
              <div className="p-3 text-center">
                <Loader size={20} className="animate-spin mx-auto text-primary" />
                <p className="text-muted small mt-2 mb-0">Buscando...</p>
              </div>
            )}

            {error && (
              <div className="p-3 text-center text-danger">
                <p className="small mb-0">{error}</p>
              </div>
            )}

            {!cargando && !error && resultados && (
              <div className="p-2">
                {/* Usuarios */}
                  {resultados.resultados.usuarios && resultados.resultados.usuarios.length > 0 && (
                  <div className="mb-3">
                    <h6 className="px-2 py-1 text-muted fw-semibold small text-uppercase">Personas</h6>
                    {resultados.resultados.usuarios.map(usuario => (
                      <div
                        key={usuario._id}
                        className="d-flex align-items-center p-2 rounded hover-bg cursor-pointer"
                        onClick={() => navegarAPerfil(usuario._id)}
                      >
                        <img
                          src={usuario.fotoPerfil ? `http://localhost:3001${usuario.fotoPerfil}` : "/default-avatar.png"}
                          alt={`${usuario.primernombreUsuario} ${usuario.primerapellidoUsuario}`}
                          className="rounded-circle"
                          style={{ width: 40, height: 40, objectFit: "cover" }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-medium text-dark">
                            {usuario.primernombreUsuario} {usuario.primerapellidoUsuario}
                          </div>
                          <small className="text-muted">
                            {usuario.rolUsuario} · {usuario.ciudadUsuario || 'Sin ubicación'}
                          </small>
                        </div>
                        <User size={16} className="text-muted" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Grupos */}
                {resultados.resultados.grupos && resultados.resultados.grupos.length > 0 && (
                  <div className="mb-3">
                    <h6 className="px-2 py-1 text-muted fw-semibold small text-uppercase">Grupos</h6>
                    {resultados.resultados.grupos.map(grupo => (
                      <div
                        key={grupo._id}
                        className="d-flex align-items-center p-2 rounded hover-bg cursor-pointer"
                        onClick={() => navegarAGrupo(grupo._id)}
                      >
                        <Users size={20} className="text-primary me-2" />
                        <div className="flex-grow-1">
                          <div className="fw-medium text-dark">{grupo.nombre}</div>
                          <small className="text-muted">
                            {grupo.descripcion?.substring(0, 50)}...
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Iglesias */}
                {resultados.resultados.iglesias && resultados.resultados.iglesias.length > 0 && (
                  <div className="mb-2">
                    <h6 className="px-2 py-1 text-muted fw-semibold small text-uppercase">Iglesias</h6>
                    {resultados.resultados.iglesias.map(iglesia => (
                      <div
                        key={iglesia._id}
                        className="d-flex align-items-center p-2 rounded hover-bg cursor-pointer"
                        onClick={() => navegarAIglesia(iglesia._id)}
                      >
                        <MapPin size={20} className="text-danger me-2" />
                        <div className="flex-grow-1">
                          <div className="fw-medium text-dark">{iglesia.nombre}</div>
                          <small className="text-muted">
                            {iglesia.ciudad}, {iglesia.direccion?.substring(0, 30)}...
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ver todos los resultados */}
                {resultados.total > 0 && (
                  <div className="border-top pt-2">
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => {
                        navigate(`/busqueda?q=${encodeURIComponent(termino)}`);
                        setMostrarResultados(false);
                      }}
                    >
                      Ver todos los resultados ({resultados.total})
                    </button>
                  </div>
                )}
              </div>
            )}

            {!cargando && !error && resultados && resultados.total === 0 && (
              <div className="p-3 text-center text-muted">
                <p className="mb-0">No se encontraron resultados para "{termino}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .hover-bg:hover {
          background-color: #f8f9fa !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;