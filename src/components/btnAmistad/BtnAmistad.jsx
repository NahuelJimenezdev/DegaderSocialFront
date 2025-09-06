import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Clock, UserX, Trash2 } from 'lucide-react';

const BtnAmistad = ({ userId, className = "" }) => {
  const [estado, setEstado] = useState('ninguna');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Obtener estado inicial al montar el componente
  useEffect(() => {
    const obtenerEstado = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) return;

        const response = await fetch(`http://localhost:3001/api/amigos/estado/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setEstado(data.estado);
        }
      } catch (error) {
        console.error('Error obteniendo estado de amistad:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    obtenerEstado();
  }, [userId]);

  // Función para hacer peticiones a la API
  const hacerPeticion = async (endpoint, body = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/amigos/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error(`Error en ${endpoint}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Manejadores de eventos
  const enviarSolicitud = async () => {
    try {
      await hacerPeticion('solicitar', { receptorId: userId });
      setEstado('solicitud_enviada');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const cancelarSolicitud = async () => {
    try {
      await hacerPeticion('cancelar', { receptorId: userId });
      setEstado('ninguna');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const aceptarSolicitud = async () => {
    try {
      await hacerPeticion('aceptar', { solicitanteId: userId });
      setEstado('amigos');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const rechazarSolicitud = async () => {
    try {
      await hacerPeticion('rechazar', { solicitanteId: userId });
      setEstado('ninguna');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const eliminarAmistad = async () => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar esta amistad?');
    if (!confirmar) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/amigos/eliminar', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amigoId: userId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error eliminando amistad');
      }

      setEstado('ninguna');
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Spinner de carga
  const LoadingSpinner = () => (
    <div
      className="spinner-border spinner-border-sm me-2"
      style={{ width: '16px', height: '16px' }}
      role="status"
      aria-hidden="true"
    ></div>
  );

  // Mostrar loading inicial
  if (initialLoading) {
    return (
      <div className={`btn btn-secondary disabled d-flex align-items-center gap-2 ${className}`}>
        <LoadingSpinner />
        <span>Cargando...</span>
      </div>
    );
  }

  // No mostrar botón para uno mismo
  if (estado === 'self') {
    return null;
  }

  // Renderizar según el estado
  switch (estado) {
    case 'ninguna':
      return (
        <button
          onClick={enviarSolicitud}
          disabled={loading}
          className={`btn btn-primary d-flex align-items-center gap-2 ${className}`}
        >
          {loading ? <LoadingSpinner /> : <UserPlus size={16} />}
          <span>Agregar amigo</span>
        </button>
      );

    case 'solicitud_enviada':
      return (
        <div className="d-flex gap-2">
          <button
            disabled
            className={`btn btn-warning d-flex align-items-center gap-2 ${className}`}
          >
            <Clock size={16} />
            <span>Solicitud enviada</span>
          </button>
          <button
            onClick={cancelarSolicitud}
            disabled={loading}
            className="btn btn-secondary d-flex align-items-center"
            title="Cancelar solicitud"
          >
            {loading ? <LoadingSpinner /> : <UserX size={16} />}
          </button>
        </div>
      );

    case 'solicitud_recibida':
      return (
        <div className="d-flex gap-2">
          <button
            onClick={aceptarSolicitud}
            disabled={loading}
            className={`btn btn-success d-flex align-items-center gap-2 ${className}`}
          >
            {loading ? <LoadingSpinner /> : <UserCheck size={16} />}
            <span>Aceptar</span>
          </button>
          <button
            onClick={rechazarSolicitud}
            disabled={loading}
            className="btn btn-danger d-flex align-items-center"
            title="Rechazar solicitud"
          >
            {loading ? <LoadingSpinner /> : <UserX size={16} />}
          </button>
        </div>
      );

    case 'amigos':
      return (
        <div className="d-flex gap-2">
          <button
            disabled
            className={`btn btn-success d-flex align-items-center gap-2 ${className}`}
          >
            <UserCheck size={16} />
            <span>Amigos</span>
          </button>
          <button
            onClick={eliminarAmistad}
            disabled={loading}
            className="btn btn-outline-danger d-flex align-items-center"
            title="Eliminar amistad"
          >
            {loading ? <LoadingSpinner /> : <Trash2 size={16} />}
          </button>
        </div>
      );

    default:
      return null;
  }
};
export default BtnAmistad;