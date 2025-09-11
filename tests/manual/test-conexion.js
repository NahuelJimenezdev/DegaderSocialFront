// test-conexion.js - Script para probar la conexión entre frontend y backend
// Usando fetch nativo de Node.js (disponible desde v18+)

async function testConexion() {
  console.log('🧪 Probando conexión entre frontend y backend...\n');

  try {
    // Probar endpoint de conversaciones sin autenticación (debería dar error 401)
    console.log('📡 Probando endpoint: /api/mensajes/conversaciones');
    const response = await fetch('http://localhost:8080/api/mensajes/conversaciones');

    console.log(`📊 Status: ${response.status}`);
    console.log(`📝 Content-Type: ${response.headers.get('content-type')}`);

    if (response.status === 401) {
      console.log('✅ Endpoint responde correctamente (requiere autenticación)');
    } else if (response.status === 200) {
      console.log('✅ Endpoint responde correctamente');
    } else {
      console.log('⚠️  Respuesta inesperada');
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }

  console.log('\n🔗 Configuración actual:');
  console.log('- Backend: http://localhost:8080');
  console.log('- Frontend: http://localhost:5173');
  console.log('- Proxy configurado: /api/* → http://localhost:8080');
}

testConexion();
