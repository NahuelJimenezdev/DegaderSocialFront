// src/hooks/useEstadoAmistad.js
import { useState, useEffect, useCallback } from 'react';
import { amistadesAPI } from '../lib/apiNotificaciones';
import { useAmistadEvents } from './useGlobalEvents';

/**
 * Hook personalizado para manejar el estado de amistad con un usuario específico
 * @param {string} usuarioId - ID del usuario con el que se quiere verificar la amistad
 * @returns {object} Estado y funciones para manejar la amistad
 */
export const useEstadoAmistad = (usuarioId) => {
  const [estado, setEstado] = useState('cargando'); // 'cargando', 'amigos', 'solicitud_enviada', 'solicitud_recibida', 'ninguna'
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Hook para eventos globales
  const { onSolicitudRespondida, onAmistadActualizada, emitSolicitudRespondida, emitAmistadActualizada } = useAmistadEvents();

  // Función para cargar el estado actual de amistad
  const cargarEstado = useCallback(async () => {
    if (!usuarioId) {
      setEstado('ninguna');
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      setError(null);

      const response = await amistadesAPI.obtenerEstado(usuarioId);

      if (response.success) {
        setEstado(response.estado || 'ninguna');
        console.log(`👥 Estado de amistad con ${usuarioId}:`, response.estado);
      } else {
        setEstado('ninguna');
        console.warn('No se pudo obtener el estado de amistad:', response);
      }
    } catch (err) {
      console.error('Error cargando estado de amistad:', err);
      setError(err.message);
      setEstado('ninguna');
    } finally {
      setCargando(false);
    }
  }, [usuarioId]);

  // Función para enviar solicitud de amistad
  const enviarSolicitud = useCallback(async () => {
    try {
      setCargando(true);
      await amistadesAPI.enviarSolicitud(usuarioId);

      setEstado('solicitud_enviada');

      // Emitir evento global
      emitAmistadActualizada({
        usuarioId: usuarioId,
        estado: 'solicitud_enviada'
      });

      console.log(`✅ Solicitud enviada a usuario ${usuarioId}`);
    } catch (err) {
      console.error('Error enviando solicitud:', err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [usuarioId, emitAmistadActualizada]);

  // Función para aceptar solicitud
  const aceptarSolicitud = useCallback(async () => {
    try {
      setCargando(true);
      await amistadesAPI.aceptarSolicitud(usuarioId);

      setEstado('amigos');

      // Emitir eventos globales
      emitSolicitudRespondida({
        usuarioId: usuarioId,
        accion: 'aceptar'
      });

      emitAmistadActualizada({
        usuarioId: usuarioId,
        estado: 'amigos'
      });

      console.log(`✅ Solicitud aceptada de usuario ${usuarioId}`);
    } catch (err) {
      console.error('Error aceptando solicitud:', err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [usuarioId, emitSolicitudRespondida, emitAmistadActualizada]);

  // Función para rechazar solicitud
  const rechazarSolicitud = useCallback(async () => {
    try {
      setCargando(true);
      await amistadesAPI.rechazarSolicitud(usuarioId);

      setEstado('ninguna');

      // Emitir eventos globales
      emitSolicitudRespondida({
        usuarioId: usuarioId,
        accion: 'rechazar'
      });

      emitAmistadActualizada({
        usuarioId: usuarioId,
        estado: 'rechazada'
      });

      console.log(`✅ Solicitud rechazada de usuario ${usuarioId}`);
    } catch (err) {
      console.error('Error rechazando solicitud:', err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [usuarioId, emitSolicitudRespondida, emitAmistadActualizada]);

  // Función para eliminar amistad
  const eliminarAmigo = useCallback(async () => {
    try {
      setCargando(true);
      await amistadesAPI.eliminarAmigo(usuarioId);

      setEstado('ninguna');

      // Emitir evento global
      emitAmistadActualizada({
        usuarioId: usuarioId,
        estado: 'ninguna'
      });

      console.log(`✅ Amistad eliminada con usuario ${usuarioId}`);
    } catch (err) {
      console.error('Error eliminando amistad:', err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [usuarioId, emitAmistadActualizada]);

  // Cargar estado inicial
  useEffect(() => {
    cargarEstado();
  }, [cargarEstado]);

  // Escuchar eventos globales para sincronizar estado
  useEffect(() => {
    const unsubscribeSolicitud = onSolicitudRespondida((eventData) => {
      if (eventData.usuarioId === usuarioId) {
        console.log(`📨 Actualizando estado por evento de solicitud: ${eventData.accion}`);
        setEstado(eventData.accion === 'aceptar' ? 'amigos' : 'ninguna');
      }
    });

    const unsubscribeAmistad = onAmistadActualizada((eventData) => {
      if (eventData.usuarioId === usuarioId) {
        console.log(`👥 Actualizando estado por evento de amistad: ${eventData.estado}`);
        setEstado(eventData.estado);
      }
    });

    return () => {
      unsubscribeSolicitud();
      unsubscribeAmistad();
    };
  }, [usuarioId, onSolicitudRespondida, onAmistadActualizada]);

  return {
    // Estado
    estado,
    cargando,
    error,

    // Acciones
    enviarSolicitud,
    aceptarSolicitud,
    rechazarSolicitud,
    eliminarAmigo,
    recargar: cargarEstado,

    // Utilidades
    esAmigo: estado === 'amigos',
    tieneSolicitudEnviada: estado === 'solicitud_enviada',
    tieneSolicitudRecibida: estado === 'solicitud_recibida',
    sinRelacion: estado === 'ninguna'
  };
};
