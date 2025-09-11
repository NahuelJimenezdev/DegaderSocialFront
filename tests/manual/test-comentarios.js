// Test manual para comentarios multimedia
// Ejecutar en la consola del navegador en http://localhost:5174/

// 1. Test básico de la API
async function testComentarioAPI() {
  const token = localStorage.getItem('token');
  console.log('🔑 Token:', token ? 'Encontrado' : 'No encontrado');

  if (!token) {
    console.error('❌ No hay token de autenticación');
    return;
  }

  // Test de endpoint básico
  try {
    const response = await fetch('http://localhost:3001/api/publicaciones', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('📡 API Status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('📝 Publicaciones encontradas:', data.publicaciones?.length || 0);
      return data.publicaciones?.[0]?._id; // Retorna ID de primera publicación
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

// 2. Test de FormData
function testFormData() {
  const formData = new FormData();
  formData.append('texto', 'Test de comentario con emoji 😀');

  console.log('📦 FormData creado:');
  for (let pair of formData.entries()) {
    console.log(`  ${pair[0]}:`, pair[1]);
  }

  return formData;
}

// Ejecutar tests
console.log('🧪 Iniciando tests...');
testComentarioAPI().then(publicacionId => {
  if (publicacionId) {
    console.log('✅ Test API exitoso, ID de publicación:', publicacionId);
    const testData = testFormData();
    console.log('✅ Test FormData exitoso');
  }
});
