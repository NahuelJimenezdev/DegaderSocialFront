// src/hooks/useGlobalEvents.js
import { useEffect, useCallback } from 'react';

// Sistema de eventos globales para sincronizar estados entre componentes
class GlobalEventManager {
  constructor() {
    this.listeners = {};
  }

  // Agregar listener para un evento
  on(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);

    // Retornar función para remover el listener
    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
    };
  }

  // Emitir evento a todos los listeners
  emit(eventName, data) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error en listener de evento ${eventName}:`, error);
        }
      });
    }
    console.log(`📡 Evento emitido: ${eventName}`, data);
  }

  // Remover todos los listeners de un evento
  removeAllListeners(eventName) {
    delete this.listeners[eventName];
  }
}

// Instancia global del gestor de eventos
export const globalEvents = new GlobalEventManager();

// Hook personalizado para usar eventos globales
export const useGlobalEvents = () => {
  const emit = useCallback((eventName, data) => {
    globalEvents.emit(eventName, data);
  }, []);

  const on = useCallback((eventName, callback) => {
    return globalEvents.on(eventName, callback);
  }, []);

  return { emit, on };
};

// Hook específico para eventos de amistad
export const useAmistadEvents = () => {
  const { emit, on } = useGlobalEvents();

  const emitSolicitudRespondida = useCallback((data) => {
    emit('solicitud_respondida', {
      usuarioId: data.usuarioId,
      accion: data.accion, // 'aceptar' | 'rechazar'
      timestamp: new Date().toISOString(),
      ...data
    });
  }, [emit]);

  const emitAmistadActualizada = useCallback((data) => {
    emit('amistad_actualizada', {
      usuarioId: data.usuarioId,
      estado: data.estado, // 'amigos' | 'solicitud_enviada' | 'solicitud_recibida' | 'ninguna'
      timestamp: new Date().toISOString(),
      ...data
    });
  }, [emit]);

  const emitNotificacionLeida = useCallback((data) => {
    emit('notificacion_leida', {
      notificacionId: data.notificacionId,
      timestamp: new Date().toISOString(),
      ...data
    });
  }, [emit]);

  const onSolicitudRespondida = useCallback((callback) => {
    return on('solicitud_respondida', callback);
  }, [on]);

  const onAmistadActualizada = useCallback((callback) => {
    return on('amistad_actualizada', callback);
  }, [on]);

  const onNotificacionLeida = useCallback((callback) => {
    return on('notificacion_leida', callback);
  }, [on]);

  return {
    // Emitir eventos
    emitSolicitudRespondida,
    emitAmistadActualizada,
    emitNotificacionLeida,

    // Escuchar eventos
    onSolicitudRespondida,
    onAmistadActualizada,
    onNotificacionLeida
  };
};

// Eventos específicos disponibles:
// - 'solicitud_respondida': Cuando se acepta/rechaza una solicitud
// - 'amistad_actualizada': Cuando cambia el estado de amistad entre usuarios
// - 'notificacion_leida': Cuando se marca una notificación como leída
// - 'notificaciones_actualizadas': Cuando se actualizan las notificaciones
// - 'usuario_perfil_actualizado': Cuando se actualiza info de perfil
