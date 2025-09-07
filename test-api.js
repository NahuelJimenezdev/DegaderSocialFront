// Test script para probar las APIs de notificaciones
// Ejecutar desde la consola del navegador en http://localhost:5173

console.log('🧪 Iniciando pruebas de API...');

// Función helper para hacer peticiones
const testAPI = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    });

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Test 1: Health check del backend
console.log('📡 Probando conexión con backend...');
testAPI('http://localhost:3001/api/health')
  .then(result => {
    if (result.success) {
      console.log('✅ Backend conectado:', result.data);
    } else {
      console.log('❌ Error conectando backend:', result);
    }
  });

// Test 2: Debug de rutas de amistades
console.log('👥 Probando rutas de amistades...');
testAPI('http://localhost:3001/api/amigos/debug')
  .then(result => {
    if (result.success) {
      console.log('✅ Rutas de amistades funcionando:', result.data);
    } else {
      console.log('❌ Error en rutas de amistades:', result);
    }
  });

// Test 3: Debug de rutas de notificaciones
console.log('🔔 Probando rutas de notificaciones...');
testAPI('http://localhost:3001/api/notificaciones/debug')
  .then(result => {
    if (result.success) {
      console.log('✅ Rutas de notificaciones funcionando:', result.data);
    } else {
      console.log('❌ Error en rutas de notificaciones:', result);
    }
  });

// Test 4: Obtener contador de notificaciones
console.log('📊 Probando contador de notificaciones...');
testAPI('http://localhost:3001/api/notificaciones/contador')
  .then(result => {
    if (result.success) {
      console.log('✅ Contador obtenido:', result.data);
    } else {
      console.log('❌ Error obteniendo contador:', result);
    }
  });

// Test 5: Obtener notificaciones
console.log('📝 Probando obtener notificaciones...');
testAPI('http://localhost:3001/api/notificaciones?limit=5')
  .then(result => {
    if (result.success) {
      console.log('✅ Notificaciones obtenidas:', result.data);
    } else {
      console.log('❌ Error obteniendo notificaciones:', result);
    }
  });

console.log('🧪 Pruebas iniciadas. Revisa los resultados arriba.');

// Función para probar la creación de notificaciones de solicitud
window.testNotificationCreation = () => {
  console.log('🧪 Probando creación de notificación de solicitud...');

  // Simular datos de prueba
  const testData = {
    destinatarioId: '64b123456789abcdef123456', // ID de prueba
    remitenteId: '64b123456789abcdef123457',    // ID de prueba
    tipo: 'solicitud_amistad',
    mensaje: 'Test: Usuario de prueba te envió una solicitud de amistad',
    prioridad: 'alta'
  };

  testAPI('http://localhost:3001/api/notificaciones', {
    method: 'POST',
    body: JSON.stringify(testData)
  }).then(result => {
    if (result.success) {
      console.log('✅ Notificación de prueba creada:', result.data);
    } else {
      console.log('❌ Error creando notificación de prueba:', result);
    }
  });
};

console.log('💡 Ejecuta testNotificationCreation() para probar la creación de notificaciones');
