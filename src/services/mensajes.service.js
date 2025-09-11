// services/mensajes.service.js
// ✅ CONECTADO AL BACKEND REAL (NodeInicios - localhost:3001)
// Este servicio está conectado al backend de NodeInicios con todas las funcionalidades implementadas

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_BASE = `${API_URL}/api/mensajes`;

class MensajesService {
  // Obtener conversaciones del usuario
  static async obtenerConversaciones() {
    try {
      const response = await fetch(`${API_BASE}/conversaciones`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener conversaciones');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en obtenerConversaciones:', error);
      throw error;
    }
  }

  // Obtener mensajes con un usuario específico
  static async obtenerMensajes(usuarioId) {
    try {
      const response = await fetch(`${API_BASE}/${usuarioId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener mensajes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en obtenerMensajes:', error);
      throw error;
    }
  }

  // Enviar mensaje
  static async enviarMensaje(destinatarioId, contenido, tipo = 'texto', archivoAdjunto = null) {
    try {
      const body = {
        contenido,
        tipo,
        ...(archivoAdjunto && { archivoAdjunto })
      };

      const response = await fetch(`${API_BASE}/${destinatarioId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Error al enviar mensaje');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en enviarMensaje:', error);
      throw error;
    }
  }

  // Marcar mensajes como leídos
  static async marcarComoLeidos(usuarioId) {
    try {
      const response = await fetch(`${API_BASE}/${usuarioId}/leido`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al marcar mensajes como leídos');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en marcarComoLeidos:', error);
      throw error;
    }
  }

  // Eliminar mensaje
  static async eliminarMensaje(mensajeId) {
    try {
      const response = await fetch(`${API_BASE}/${mensajeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar mensaje');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en eliminarMensaje:', error);
      throw error;
    }
  }

  // Buscar usuarios para iniciar conversación
  static async buscarUsuarios(query) {
    try {
      const response = await fetch(`/api/usuarios/buscar?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al buscar usuarios');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en buscarUsuarios:', error);
      throw error;
    }
  }
}

export default MensajesService;

// Función utilitaria para navegar al chat con un usuario específico
export const navegarAlChat = (navigate, usuario) => {
  navigate('/mensajes', {
    state: {
      usuarioSeleccionado: {
        _id: usuario._id || usuario.id,
        primernombreUsuario: usuario.primernombreUsuario || usuario.nombre,
        primerapellidoUsuario: usuario.primerapellidoUsuario || usuario.apellido,
        fotoPerfil: usuario.fotoPerfil,
        estadoUsuario: usuario.estadoUsuario || 'activo'
      }
    }
  });
};
