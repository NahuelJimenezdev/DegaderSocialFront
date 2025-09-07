// src/lib/apiNotificaciones.js

const API_BASE_URL = 'http://localhost:3001/api';

// Función helper para obtener el token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error de red' }));
    throw new Error(errorData.error || 'Error en la solicitud');
  }
  return response.json();
};

// === API DE NOTIFICACIONES ===

export const notificacionesAPI = {
  // Obtener contador de notificaciones no leídas
  obtenerContador: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notificaciones/contador`, {
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo contador:', error);
      throw error;
    }
  },

  // Obtener todas las notificaciones
  obtenerNotificaciones: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.tipo) queryParams.append('tipo', params.tipo);
      if (params.leidas !== undefined) queryParams.append('leidas', params.leidas);
      if (params.soloNoLeidas) queryParams.append('soloNoLeidas', params.soloNoLeidas);

      const url = `${API_BASE_URL}/notificaciones${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
        headers: getAuthHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      throw error;
    }
  },

  // Marcar notificación como leída
  marcarComoLeida: async (notificacionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notificaciones/${notificacionId}/leer`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error marcando como leída:', error);
      throw error;
    }
  },

  // Marcar todas las notificaciones como leídas
  marcarTodasComoLeidas: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notificaciones/leer-todas`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
      throw error;
    }
  },

  // Eliminar notificación
  eliminar: async (notificacionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notificaciones/${notificacionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error eliminando notificación:', error);
      throw error;
    }
  }
};

// === API DE AMISTADES ===

export const amistadesAPI = {
  // Aceptar solicitud de amistad
  aceptarSolicitud: async (solicitanteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/amigos/aceptar`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ solicitanteId })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error aceptando solicitud:', error);
      throw error;
    }
  },

  // Rechazar solicitud de amistad
  rechazarSolicitud: async (solicitanteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/amigos/rechazar`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ solicitanteId })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error rechazando solicitud:', error);
      throw error;
    }
  },

  // Enviar solicitud de amistad
  enviarSolicitud: async (receptorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/amigos/solicitar`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ receptorId })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error enviando solicitud:', error);
      throw error;
    }
  },

  // Obtener solicitudes recibidas
  obtenerSolicitudesRecibidas: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/amigos/solicitudes/recibidas`, {
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo solicitudes recibidas:', error);
      throw error;
    }
  },

  // Obtener solicitudes enviadas
  obtenerSolicitudesEnviadas: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/amigos/solicitudes/enviadas`, {
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo solicitudes enviadas:', error);
      throw error;
    }
  },

  // Obtener estado de amistad
  obtenerEstado: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/amigos/estado/${userId}`, {
        headers: getAuthHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo estado:', error);
      throw error;
    }
  },

  // Obtener lista de amigos
  obtenerAmigos: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const url = `${API_BASE_URL}/amigos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
        headers: getAuthHeaders()
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo amigos:', error);
      throw error;
    }
  }
};

export default {
  notificacionesAPI,
  amistadesAPI
};
