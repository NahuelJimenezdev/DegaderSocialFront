// Test rápido de APIs después de reiniciar servidores
console.log('🧪 === PRUEBA RÁPIDA POST-REINICIO ===');

const testQuick = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('❌ No hay token. Necesitas hacer login primero.');
    return;
  }

  console.log('📡 Probando conectividad...');

  // Health check
  try {
    const health = await fetch('http://localhost:3001/api/health');
    const healthData = await health.json();
    console.log('✅ Backend:', healthData.message);
  } catch (error) {
    console.log('❌ Backend sin respuesta:', error.message);
    return;
  }

  // Test notificaciones (el que estaba fallando)
  try {
    const notifs = await fetch('http://localhost:3001/api/notificaciones?limit=5', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (notifs.ok) {
      const notifsData = await notifs.json();
      console.log('✅ Notificaciones API funcionando:', notifsData);
    } else {
      const errorData = await notifs.json();
      console.log('❌ Error en notificaciones:', notifs.status, errorData);
    }
  } catch (error) {
    console.log('❌ Error consultando notificaciones:', error.message);
  }

  // Test solicitudes (que sabemos que funciona)
  try {
    const solicitudes = await fetch('http://localhost:3001/api/amigos/solicitudes/recibidas', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (solicitudes.ok) {
      const solicitudesData = await solicitudes.json();
      console.log('✅ Solicitudes API funcionando:', solicitudesData);
    } else {
      console.log('❌ Error en solicitudes:', solicitudes.status);
    }
  } catch (error) {
    console.log('❌ Error consultando solicitudes:', error.message);
  }

  console.log('🏁 Prueba completada. Ahora intenta usar la campanita nuevamente.');
};

// Ejecutar el test
testQuick();
