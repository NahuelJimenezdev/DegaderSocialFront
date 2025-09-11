// services/socket.service.js
import io from 'socket.io-client';
import { API_CONFIG } from '../lib/config';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.messageCallbacks = [];
    this.userStatusCallbacks = [];
    this.typingCallbacks = [];
    this.notificationCallbacks = [];
  }

  // Conectar al servidor
  connect(userId) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(API_CONFIG.BASE_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 4000,
      withCredentials: true,
      auth: { token: localStorage.getItem('token') || '', userId }
    });

    this.socket.on('connect', () => {
      console.log('🔌 Conectado al servidor Socket.IO');
      this.isConnected = true;

      // Unirse a la sala personal del usuario
      this.socket.emit('join', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Desconectado del servidor Socket.IO');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.IO:', error);
      this.isConnected = false;
    });

    // Escuchar mensajes entrantes
    this.socket.on('receive_message', (mensaje) => {
      console.log('📨 Mensaje recibido:', mensaje);
      this.messageCallbacks.forEach(callback => callback(mensaje));
    });

    // Escuchar mensajes de grupo
    this.socket.on('receive_group_message', (mensaje) => {
      console.log('👥 Mensaje de grupo recibido:', mensaje);
      this.messageCallbacks.forEach(callback => callback(mensaje));
    });

    // Escuchar estados de usuario
    this.socket.on('user_online', (userId) => {
      this.userStatusCallbacks.forEach(callback =>
        callback({ userId, status: 'online' })
      );
    });

    this.socket.on('user_offline', (userId) => {
      this.userStatusCallbacks.forEach(callback =>
        callback({ userId, status: 'offline' })
      );
    });

    // Escuchar indicadores de escritura
    this.socket.on('user_typing', (data) => {
      this.typingCallbacks.forEach(callback =>
        callback({ userId: data.userId, typing: true })
      );
    });

    this.socket.on('user_stop_typing', (data) => {
      this.typingCallbacks.forEach(callback =>
        callback({ userId: data.userId, typing: false })
      );
    });

    // Notificación cuando llega un mensaje y el usuario no está en el chat
    this.socket.on('notification_message', (payload) => {
      console.log('🔔 Notificación de mensaje:', payload);
      this.notificationCallbacks.forEach(callback => callback(payload));
    });

    // Confirmación de mensaje enviado
    this.socket.on('message_sent', (mensaje) => {
      console.log('✅ Mensaje enviado:', mensaje);
    });

    // Error al enviar mensaje
    this.socket.on('message_error', (error) => {
      console.error('❌ Error al enviar mensaje:', error);
    });
  }

  // Desconectar
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Enviar mensaje
  sendMessage(destinatarioId, contenido, tipo = 'texto') {
    if (!this.socket || !this.isConnected) {
      console.error('Socket no conectado');
      return false;
    }

    this.socket.emit('send_message', {
      destinatarioId,
      contenido,
      tipo
    });

    return true;
  }

  // Enviar mensaje a grupo
  sendGroupMessage(groupId, contenido, tipo = 'texto') {
    if (!this.socket || !this.isConnected) {
      return false;
    }

    this.socket.emit('send_group_message', {
      groupId,
      contenido,
      tipo
    });

    return true;
  }

  // Marcar mensaje como leído
  markAsRead(mensajeId, remitenteId) {
    if (!this.socket || !this.isConnected) {
      return false;
    }

    this.socket.emit('mark_as_read', {
      mensajeId,
      remitenteId
    });

    return true;
  }

  // Unirse a sala de grupo
  joinGroup(groupId) {
    if (!this.socket || !this.isConnected) {
      return false;
    }

    this.socket.emit('join_group', groupId);
    return true;
  }

  // Salir de sala de grupo
  leaveGroup(groupId) {
    if (!this.socket || !this.isConnected) {
      return false;
    }

    this.socket.emit('leave_group', groupId);
    return true;
  }

  // Indicadores de escritura
  startTyping(destinatarioId) {
    if (!this.socket || !this.isConnected) {
      return false;
    }

    this.socket.emit('typing_start', { destinatarioId });
    return true;
  }

  stopTyping(destinatarioId) {
    if (!this.socket || !this.isConnected) {
      return false;
    }

    this.socket.emit('typing_stop', { destinatarioId });
    return true;
  }

  // Callbacks para mensajes
  onMessage(callback) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  // Callbacks para estados de usuario
  onUserStatus(callback) {
    this.userStatusCallbacks.push(callback);
    return () => {
      this.userStatusCallbacks = this.userStatusCallbacks.filter(cb => cb !== callback);
    };
  }

  // Callbacks para indicadores de escritura
  onTyping(callback) {
    this.typingCallbacks.push(callback);
    return () => {
      this.typingCallbacks = this.typingCallbacks.filter(cb => cb !== callback);
    };
  }

  // Callback para notificaciones de nuevos mensajes
  onMessageNotification(callback) {
    this.notificationCallbacks.push(callback);
    return () => {
      this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
    };
  }

  // Señalar al servidor si el usuario entra/sale de un chat específico
  enterChat(otroUsuarioId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('enter_chat', otroUsuarioId);
    }
  }

  leaveChat() {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_chat');
    }
  }

  // Obtener estado de conexión
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id
    };
  }
}

// Instancia singleton
const socketService = new SocketService();
export default socketService;
