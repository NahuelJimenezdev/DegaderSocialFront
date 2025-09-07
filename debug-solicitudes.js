// Debug para entender el problema de aceptar solicitudes
console.log('🔍 === DEBUG SOLICITUDES DE AMISTAD ===');

const debugSolicitudes = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('❌ No hay token');
    return;
  }

  console.log('📋 Obteniendo información de solicitudes...');

  // 1. Ver las solicitudes recibidas
  try {
    const solicitudes = await fetch('http://localhost:3001/api/amigos/solicitudes/recibidas', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (solicitudes.ok) {
      const data = await solicitudes.json();
      console.log('📨 Solicitudes recibidas:', data);

      if (data.solicitudes && data.solicitudes.length > 0) {
        console.log('👤 Primera solicitud:');
        const primera = data.solicitudes[0];
        console.log('   - ID:', primera._id);
        console.log('   - Nombre:', primera.primernombreUsuario, primera.primerapellidoUsuario);
        console.log('   - Usar este ID para aceptar:', primera._id);

        // Guardar para test
        window.testSolicitudId = primera._id;
        console.log('💾 ID guardado en window.testSolicitudId');
      }
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }

  // 2. Ver las notificaciones para entender la estructura
  try {
    const notifs = await fetch('http://localhost:3001/api/notificaciones?limit=5', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (notifs.ok) {
      const data = await notifs.json();
      console.log('🔔 Notificaciones:', data);

      if (data.data && data.data.length > 0) {
        console.log('📝 Primera notificación:');
        const primera = data.data[0];
        console.log('   - ID notificación:', primera._id);
        console.log('   - Remitente ID:', primera.remitenteId);
        console.log('   - Tipo:', primera.tipo);
        console.log('   - Mensaje:', primera.mensaje);
      }
    }
  } catch (error) {
    console.log('❌ Error notificaciones:', error);
  }

  console.log('🏁 Debug completado');
};

// Función para test manual
window.testAceptarSolicitud = async (solicitudId) => {
  if (!solicitudId && window.testSolicitudId) {
    solicitudId = window.testSolicitudId;
  }

  if (!solicitudId) {
    console.log('❌ Necesitas proporcionar un ID de solicitud');
    return;
  }

  console.log('🧪 Probando aceptar solicitud con ID:', solicitudId);

  try {
    const response = await fetch('http://localhost:3001/api/amigos/aceptar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ solicitanteId: solicitudId })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Solicitud aceptada:', data);
    } else {
      const error = await response.json();
      console.log('❌ Error aceptando:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Error de red:', error);
  }
};

console.log('💡 Comandos disponibles:');
console.log('debugSolicitudes() - Ver información de solicitudes');
console.log('testAceptarSolicitud() - Probar aceptar solicitud');

// Ejecutar debug automáticamente
debugSolicitudes();
