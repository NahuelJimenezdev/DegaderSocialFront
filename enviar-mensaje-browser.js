// enviar-mensaje-browser.js
// Script para ejecutar en la consola del navegador
// Copia y pega este código en la consola del navegador en http://localhost:5173

const enviarMensajeConsola = async () => {
  try {
    // Configuración del mensaje
    const destinatarioId = '68c1ee6654116e0f99a8035a'; // Cristiam Celis
    const mensaje = 'Hola cristiam';
    const tipo = 'texto';

    // Obtener token del localStorage (debes estar logueado)
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('❌ No hay token de autenticación. Debes iniciar sesión primero.');
      return;
    }

    console.log('📤 Enviando mensaje desde el navegador...');
    console.log(`👥 Para: Cristiam Celis (${destinatarioId})`);
    console.log(`💬 Mensaje: "${mensaje}"`);

    // Hacer la petición POST usando el proxy del frontend
    const response = await fetch(`/api/mensajes/${destinatarioId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        contenido: mensaje,
        tipo: tipo
      })
    });

    console.log(`📊 Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Mensaje enviado exitosamente!');
      console.log('📝 Respuesta:', data);
    } else {
      const errorData = await response.text();
      console.log('❌ Error al enviar mensaje:');
      console.log('📝 Error:', errorData);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
};

// Ejecutar la función
enviarMensajeConsola();
