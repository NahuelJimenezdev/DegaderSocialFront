// Script de prueba para el sistema de notificaciones integrado
// Ejecutar desde la consola del navegador en http://localhost:5173

console.log('🧪 === PRUEBAS DE SISTEMA DE NOTIFICACIONES ===');
console.log('📍 Frontend: http://localhost:5173');
console.log('📍 Backend: http://localhost:3001');

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
    return {
      success: response.ok,
      data,
      status: response.status,
      url: url.replace('http://localhost:3001', '')
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      url: url.replace('http://localhost:3001', '')
    };
  }
};

// === PRUEBAS DE CONECTIVIDAD ===

console.log('\n🔌 === PRUEBAS DE CONECTIVIDAD ===');

// Test 1: Health check del backend
console.log('1️⃣ Probando health check...');
testAPI('http://localhost:3001/api/health')
  .then(result => {
    if (result.success) {
      console.log('✅ Backend conectado:', result.data.message);
    } else {
      console.log('❌ Error conectando backend:', result.error || result.data);
    }
  });

// Test 2: Debug de rutas de notificaciones
console.log('2️⃣ Probando rutas de notificaciones...');
testAPI('http://localhost:3001/api/notificaciones/debug')
  .then(result => {
    if (result.success) {
      console.log('✅ Rutas de notificaciones:', result.data.message);
      console.log('📋 Endpoints disponibles:', Object.keys(result.data.endpoints).length);
    } else {
      if (result.status === 401) {
        console.log('🔐 Necesitas estar logueado para acceder a notificaciones');
      } else {
        console.log('❌ Error en rutas de notificaciones:', result.error || result.data);
      }
    }
  });

// Test 3: Debug de rutas de amistades
console.log('3️⃣ Probando rutas de amistades...');
testAPI('http://localhost:3001/api/amigos/debug')
  .then(result => {
    if (result.success) {
      console.log('✅ Rutas de amistades:', result.data.message);
      console.log('📋 Endpoints disponibles:', Object.keys(result.data.endpoints).length);
    } else {
      if (result.status === 401) {
        console.log('🔐 Necesitas estar logueado para acceder a amistades');
      } else {
        console.log('❌ Error en rutas de amistades:', result.error || result.data);
      }
    }
  });

// === PRUEBAS DE AUTENTICACIÓN ===

console.log('\n🔐 === ESTADO DE AUTENTICACIÓN ===');

const token = localStorage.getItem('token');
if (token) {
  console.log('✅ Token encontrado en localStorage');

  // Verificar si el token es válido haciendo una petición autenticada
  console.log('4️⃣ Verificando validez del token...');
  testAPI('http://localhost:3001/api/notificaciones/contador')
    .then(result => {
      if (result.success) {
        console.log('✅ Token válido - Contador de notificaciones:', result.data);
      } else {
        console.log('❌ Token inválido o expirado:', result.error || result.data);
        console.log('💡 Tip: Intenta hacer login nuevamente');
      }
    });
} else {
  console.log('❌ No hay token en localStorage');
  console.log('💡 Tip: Necesitas hacer login primero');
}

// === FUNCIONES DE UTILIDAD PARA PRUEBAS MANUALES ===

console.log('\n🛠️ === FUNCIONES DE UTILIDAD ===');

// Función para probar el login (si tienes credenciales)
window.testLogin = async (email, password) => {
  console.log('🔐 Probando login...');

  const result = await testAPI('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (result.success) {
    localStorage.setItem('token', result.data.token);
    console.log('✅ Login exitoso! Token guardado');
    console.log('👤 Usuario:', result.data.user);

    // Probar inmediatamente las notificaciones
    setTimeout(() => {
      testAPI('http://localhost:3001/api/notificaciones/contador')
        .then(r => {
          if (r.success) {
            console.log('✅ Notificaciones después del login:', r.data);
          }
        });
    }, 500);

  } else {
    console.log('❌ Error en login:', result.error || result.data);
  }
};

// Función para obtener notificaciones
window.testNotificaciones = async () => {
  console.log('📬 Obteniendo notificaciones...');

  const contador = await testAPI('http://localhost:3001/api/notificaciones/contador');
  console.log('📊 Contador:', contador.success ? contador.data : contador.error);

  const notificaciones = await testAPI('http://localhost:3001/api/notificaciones?limit=10');
  console.log('📋 Notificaciones:', notificaciones.success ? notificaciones.data : notificaciones.error);
};

// Función para obtener solicitudes de amistad
window.testSolicitudes = async () => {
  console.log('👥 Obteniendo solicitudes de amistad...');

  const recibidas = await testAPI('http://localhost:3001/api/amigos/solicitudes/recibidas');
  console.log('📨 Recibidas:', recibidas.success ? recibidas.data : recibidas.error);

  const enviadas = await testAPI('http://localhost:3001/api/amigos/solicitudes/enviadas');
  console.log('📤 Enviadas:', enviadas.success ? enviadas.data : enviadas.error);
};

console.log('\n💡 === COMANDOS DISPONIBLES ===');
console.log('testLogin("email", "password") - Hacer login');
console.log('testNotificaciones() - Probar notificaciones');
console.log('testSolicitudes() - Probar solicitudes de amistad');

console.log('\n🏁 === PRUEBAS COMPLETADAS ===');
console.log('Revisa los resultados arriba y usa las funciones de utilidad para pruebas específicas');

// Auto-test si hay token
if (token) {
  setTimeout(() => {
    console.log('\n🔄 === AUTO-TEST CON TOKEN EXISTENTE ===');
    window.testNotificaciones();
    window.testSolicitudes();
  }, 2000);
}
