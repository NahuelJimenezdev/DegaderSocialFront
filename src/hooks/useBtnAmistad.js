// src/hooks/useFriendship.js
import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG } from '../lib/config';

// API base URL - ajusta según tu configuración
const API_BASE = `${API_CONFIG.BASE_URL}/api/amigos`;

const useBtnAmistad = (userId) => {
  const [estado, setEstado] = useState('ninguna');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener token de localStorage
  const getToken = () => localStorage.getItem('token');

  // Función genérica para hacer peticiones
  const makeRequest = useCallback(async (endpoint, method = 'GET', body = null) => {
    const token = getToken();
    if (!token) throw new Error('Token no encontrado');

    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error HTTP ${response.status}`);
    }

    return data;
  }, []);

  // Obtener estado de amistad
  const fetchEstado = useCallback(async () => {
    if (!userId) return;

    try {
      setError(null);
      const data = await makeRequest(`/estado/${userId}`);
      setEstado(data.estado);
    } catch (err) {
      setError(err.message);
      console.error('Error obteniendo estado:', err);
    } finally {
      setInitialLoading(false);
    }
  }, [userId, makeRequest]);

  // Enviar solicitud de amistad
  const enviarSolicitud = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await makeRequest('/solicitar', 'POST', { receptorId: userId });
      setEstado('solicitud_enviada');
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [userId, loading, makeRequest]);

  // Cancelar solicitud enviada
  const cancelarSolicitud = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await makeRequest('/cancelar', 'POST', { receptorId: userId });
      setEstado('ninguna');
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [userId, loading, makeRequest]);

  // Aceptar solicitud recibida
  const aceptarSolicitud = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await makeRequest('/aceptar', 'POST', { solicitanteId: userId });
      setEstado('amigos');
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [userId, loading, makeRequest]);

  // Rechazar solicitud recibida
  const rechazarSolicitud = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await makeRequest('/rechazar', 'POST', { solicitanteId: userId });
      setEstado('ninguna');
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [userId, loading, makeRequest]);

  // Eliminar amistad existente
  const eliminarAmistad = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/eliminar`, {
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
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [userId, loading]);

  // Obtener lista de amigos
  const obtenerAmigos = useCallback(async (page = 1, limit = 20) => {
    try {
      const data = await makeRequest(`/?page=${page}&limit=${limit}`);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [makeRequest]);

  // Obtener solicitudes recibidas
  const obtenerSolicitudesRecibidas = useCallback(async () => {
    try {
      const data = await makeRequest('/solicitudes/recibidas');
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [makeRequest]);

  // Obtener solicitudes enviadas
  const obtenerSolicitudesEnviadas = useCallback(async () => {
    try {
      const data = await makeRequest('/solicitudes/enviadas');
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [makeRequest]);

  // Obtener estado inicial
  useEffect(() => {
    fetchEstado();
  }, [fetchEstado]);

  // Limpiar error después de un tiempo
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    // Estado
    estado,
    loading,
    initialLoading,
    error,

    // Acciones de solicitudes
    enviarSolicitud,
    cancelarSolicitud,
    aceptarSolicitud,
    rechazarSolicitud,
    eliminarAmistad,

    // Consultas
    obtenerAmigos,
    obtenerSolicitudesRecibidas,
    obtenerSolicitudesEnviadas,

    // Utilidades
    refetch: fetchEstado,
    clearError: () => setError(null)
  };
};

export default useBtnAmistad;