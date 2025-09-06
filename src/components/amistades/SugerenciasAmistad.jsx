// components/amistades/SugerenciasAmistad.jsx
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Check } from 'lucide-react';

const SugerenciasAmistad = () => {
  const [sugerencias, setSugerencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviandoSolicitud, setEnviandoSolicitud] = useState(null);

  const cargarSugerencias = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/amistades/sugerencias', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setSugerencias(data.sugerencias || []);
      }
    } catch (error) {
      console.error('Error cargando sugerencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const enviarSolicitudAmistad = async (usuarioId) => {
    setEnviandoSolicitud(usuarioId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/amistades/solicitud/${usuarioId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        // Actualizar lista removiendo el usuario al que se le envió solicitud
        setSugerencias(prev => prev.filter(user => user._id !== usuarioId));
      } else {
        alert(data.error || 'Error al enviar solicitud');
      }
    } catch (error) {
      console.error('Error enviando solicitud:', error);
      alert('Error de conexión');
    } finally {
      setEnviandoSolicitud(null);
    }
  };

  useEffect(() => {
    cargarSugerencias();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Cargando sugerencias...</div>;
  }

  if (sugerencias.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Users size={48} className="mx-auto mb-4 opacity-50" />
        <p>No hay sugerencias de amistad en este momento</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Users size={20} />
        Sugerencias de amistad
      </h3>

      <div className="space-y-3">
        {sugerencias.map(usuario => (
          <div key={usuario._id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={usuario.fotoPerfil ? `http://localhost:3001${usuario.fotoPerfil}` : '/default-avatar.png'}
                alt={`${usuario.primernombreUsuario} ${usuario.primerapellidoUsuario}`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium">{usuario.primernombreUsuario} {usuario.primerapellidoUsuario}</h4>
                <p className="text-sm text-gray-500">
                  {usuario.ciudadUsuario}, {usuario.paisUsuario}
                </p>
              </div>
            </div>

            <button
              onClick={() => enviarSolicitudAmistad(usuario._id)}
              disabled={enviandoSolicitud === usuario._id}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 disabled:opacity-50"
            >
              {enviandoSolicitud === usuario._id ? (
                <Check size={16} />
              ) : (
                <UserPlus size={16} />
              )}
              {enviandoSolicitud === usuario._id ? 'Enviando...' : 'Agregar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SugerenciasAmistad;