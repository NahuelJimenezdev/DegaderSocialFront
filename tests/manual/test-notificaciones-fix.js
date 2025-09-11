// Test específico para notificaciones después de la corrección
console.log('🧪 === TEST DE NOTIFICACIONES POST-CORRECCIÓN ===');

const testNotificacionesCorregidas = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('❌ No hay token. Haz login primero.');
    return;
  }

  console.log('🔔 Probando API de notificaciones corregida...');

  // Test 1: Contador de notificaciones
  try {
    const contador = await fetch('http://localhost:3001/api/notificaciones/contador', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (contador.ok) {
      const contadorData = await contador.json();
      console.log('✅ Contador funcionando:', contadorData);
    } else {
      const errorData = await contador.json();
      console.log('❌ Error en contador:', contador.status, errorData);
    }
  } catch (error) {
    console.log('❌ Error consultando contador:', error.message);
  }

  // Test 2: Lista de notificaciones
  try {
    const notificaciones = await fetch('http://localhost:3001/api/notificaciones?limit=5', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (notificaciones.ok) {
      const notifData = await notificaciones.json();
      console.log('✅ Notificaciones funcionando:', notifData);

      if (notifData.data && notifData.data.length > 0) {
        console.log('📋 Notificaciones encontradas:', notifData.data.length);
        notifData.data.forEach((notif, index) => {
          console.log(`   ${index + 1}. ${notif.tipo}: ${notif.mensaje}`);
        });
      } else {
        console.log('ℹ️ No hay notificaciones en la base de datos');
      }
    } else {
      const errorData = await notificaciones.json();
      console.log('❌ Error en notificaciones:', notificaciones.status, errorData);
    }
  } catch (error) {
    console.log('❌ Error consultando notificaciones:', error.message);
  }

  console.log('🏁 Test completado. Si funcionó, prueba la campanita ahora.');
};

// Ejecutar test
testNotificacionesCorregidas();
