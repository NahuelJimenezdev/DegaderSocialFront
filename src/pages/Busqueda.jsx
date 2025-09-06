// pages/Busqueda.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Avatar from '../components/avatar/Avatar';
import { User as UserIcon } from 'lucide-react';

const Busqueda = () => {
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');

    if (query) {
      buscar(query);
    } else {
      setCargando(false);
    }
  }, [location.search]);

  const buscar = async (query) => {
    setCargando(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // antes: /api/search
      const response = await fetch(
        `http://localhost:3001/api/buscar?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );


      const data = await response.json();
      if (response.ok) {
        setResultados(data);
      } else {
        setError(data.error || 'Error en la búsqueda');
        setResultados(null);
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setError('Error de conexión');
      setResultados(null);
    } finally {
      setCargando(false);
    }
  };

  const params = new URLSearchParams(location.search);
  const query = params.get('q');

  return (
    <div className="container mt-4">
      <h2>Resultados de búsqueda</h2>

      {query && (
        <p className="text-muted">Buscando: "{query}"</p>
      )}

      {cargando && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Buscando resultados...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && resultados?.exito && resultados.resultados?.usuarios?.length > 0 && (
        <div className="row g-3 mt-3">
          {resultados.resultados.usuarios.map(u => (
            <div className="col-12 col-md-6 col-lg-4" key={u._id}>
              <div className="card h-100">
                <div className="card-body d-flex" style={{ gap: 12 }}>
                  {u.fotoPerfil ? (

                    <img
                      src={u.fotoPerfil ? `http://localhost:3001${u.fotoPerfil}` : "/default-avatar.png"}
                      alt={`${u.primernombreUsuario} ${u.primerapellidoUsuario}`}
                      className="rounded-circle"
                      style={{ width: 40, height: 40, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center rounded bg-secondary"
                      style={{ width: 56, height: 56 }}
                    >
                      <UserIcon size={24} className="text-white" />
                    </div>
                  )}
                  <div>
                    <h6 className="mb-1">{u.primernombreUsuario} {u.primerapellidoUsuario}</h6>
                    <div className="text-muted small">
                      {u.rolUsuario} · {u.ciudadUsuario || '—'}{u.paisUsuario ? `, ${u.paisUsuario}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}



      {!cargando && !error && resultados && resultados.total === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No se encontraron resultados para "{query}"</p>
        </div>
      )}

    </div>
  );
};

export default Busqueda;