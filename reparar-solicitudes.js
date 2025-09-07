// Script para crear solicitud de amistad real basada en la notificación
console.log('🔧 === REPARAR SOLICITUDES DE AMISTAD ===');

const repararSolicitudes = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('❌ No hay token');
    return;
  }

  // ID del remitente de la notificación
  const remitenteId = '68bc77068381de5b25622739'; // Joselin Jimenez

  console.log('🔧 Intentando crear solicitud de amistad para:', remitenteId);

  try {
    // Intentar enviar solicitud desde el remitente hacia ti
    const response = await fetch('http://localhost:3001/api/amigos/solicitar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ receptorId: remitenteId })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Solicitud creada (enviada por ti):', data);
    } else {
      const error = await response.json();
      console.log('⚠️ No se pudo crear solicitud enviada:', error);
    }
  } catch (error) {
    console.log('❌ Error creando solicitud:', error);
  }

  // Verificar solicitudes después del intento
  setTimeout(async () => {
    console.log('🔍 Verificando solicitudes después de reparación...');

    try {
      const solicitudes = await fetch('http://localhost:3001/api/amigos/solicitudes/recibidas', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (solicitudes.ok) {
        const data = await solicitudes.json();
        console.log('📨 Solicitudes recibidas después:', data);

        if (data.solicitudes && data.solicitudes.length > 0) {
          console.log('✅ Ahora tienes solicitudes para aceptar!');
          window.testSolicitudId = data.solicitudes[0]._id;
          console.log('💾 ID guardado:', window.testSolicitudId);
        } else {
          console.log('ℹ️ Aún no hay solicitudes recibidas');
        }
      }
    } catch (error) {
      console.log('❌ Error verificando:', error);
    }
  }, 1000);
};

// También crear función para aceptar con el ID correcto
window.aceptarConIDCorrecto = async () => {
  const remitenteId = '68bc77068381de5b25622739'; // De la notificación

  console.log('🧪 Intentando aceptar con ID del remitente de la notificación:', remitenteId);

  try {
    const response = await fetch('http://localhost:3001/api/amigos/aceptar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ solicitanteId: remitenteId })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Solicitud aceptada exitosamente:', data);
    } else {
      const error = await response.json();
      console.log('❌ Error aceptando:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Error de red:', error);
  }
};

console.log('💡 Comandos disponibles:');
console.log('repararSolicitudes() - Crear solicitud real');
console.log('aceptarConIDCorrecto() - Aceptar con ID de la notificación');

// Ejecutar reparación
repararSolicitudes();
