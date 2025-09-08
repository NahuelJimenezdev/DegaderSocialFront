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
      console.log('🔍 No hay usuarioId, estableciendo estado "ninguna"');
      setEstado('ninguna');
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      setError(null);

      console.log(`🔍 [useEstadoAmistad] Verificando estado de amistad con usuario: ${usuarioId}`);

      const response = await amistadesAPI.obtenerEstado(usuarioId);

      console.log(`📡 [useEstadoAmistad] Respuesta del servidor para usuario ${usuarioId}:`, response);

      if (response.success) {
        const estadoObtenido = response.estado || 'ninguna';
        setEstado(estadoObtenido);
        console.log(`👥 [useEstadoAmistad] Estado de amistad con ${usuarioId}: ${estadoObtenido}`);

        if (estadoObtenido === 'amigos') {
          console.log('🎉 [useEstadoAmistad] ¡Los usuarios ya son amigos!');
        } else if (estadoObtenido === 'ninguna') {
          console.log('📝 [useEstadoAmistad] No hay relación de amistad');
        } else {
          console.log(`📋 [useEstadoAmistad] Estado especial: ${estadoObtenido}`);
        }
      } else {
        setEstado('ninguna');
        console.warn('⚠️ [useEstadoAmistad] No se pudo obtener el estado de amistad:', response);
      }
    } catch (err) {
      console.error('❌ [useEstadoAmistad] Error cargando estado de amistad:', err);
      setError(err.message);
      setEstado('ninguna');
    } finally {
      setCargando(false);
    }
  }, [usuarioId]);

  // Cargar estado inicial
  useEffect(() => {
    cargarEstado();
  }, [usuarioId]);

  // Escuchar eventos de cambios de estado para este usuario específico
  useEffect(() => {
    const unsubscribeAmistad = onAmistadActualizada((eventData) => {
      // Solo actualizar si el evento es para este usuario específico
      if (eventData.usuarioId === usuarioId) {
        console.log(`🔄 Sincronizando estado para usuario ${usuarioId}:`, eventData.estado);
        console.log('📊 Datos del evento:', eventData);
        setEstado(eventData.estado);
      } else {
        console.log(`⏭️ Evento ignorado para usuario ${eventData.usuarioId}, esperaba ${usuarioId}`);
      }
    });

    const unsubscribeSolicitud = onSolicitudRespondida((eventData) => {
      // Solo actualizar si el evento es para este usuario específico
      if (eventData.usuarioId === usuarioId) {
        console.log(`🔄 Sincronizando respuesta para usuario ${usuarioId}:`, eventData.accion);
        console.log('📊 Datos del evento:', eventData);
        const nuevoEstado = eventData.accion === 'aceptar' ? 'amigos' : 'ninguna';
        setEstado(nuevoEstado);
      } else {
        console.log(`⏭️ Evento respuesta ignorado para usuario ${eventData.usuarioId}, esperaba ${usuarioId}`);
      }
    });

    return () => {
      unsubscribeAmistad();
      unsubscribeSolicitud();
    };
  }, [usuarioId, onAmistadActualizada, onSolicitudRespondida]);

  // Función para enviar solicitud de amistad
  const enviarSolicitud = useCallback(async () => {
    try {
      console.log(`🚀 [useEstadoAmistad] Intentando enviar solicitud a usuario: ${usuarioId}`);
      console.log(`🔍 [useEstadoAmistad] Estado actual antes de enviar: ${estado}`);

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
      console.error(`❌ [useEstadoAmistad] Error enviando solicitud a ${usuarioId}:`, err);
      setError(err.message);

      // Si el error es "Ya son amigos", actualizar el estado correctamente
      if (err.message.includes('Ya son amigos')) {
        console.log(`🔄 [useEstadoAmistad] Detectado que ya son amigos, actualizando estado...`);
        setEstado('amigos');
      }
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
