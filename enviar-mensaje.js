// enviar-mensaje.js - Script para enviar mensaje desde consola
// Usando fetch nativo de Node.js (disponible desde v18+)

async function enviarMensaje() {
  try {
    // Configuración del mensaje
    const remitenteId = '68c07e6e4024ed65d6b6f295'; // Nahuel Jimenez
    const destinatarioId = '68c1ee6654116e0f99a8035a'; // Cristiam Celis
    const mensaje = 'Hola cristiam';
    const tipo = 'texto';

    // Token JWT (del usuario Nahuel)
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzA3ZTZlNDAyNGVkNjVkNmI2ZjI5NSIsImlkVXN1YXJpbyI6IjY4YzA3ZTZlNDAyNGVkNjVkNmI2ZjI5NSIsInByaW1lcm5vbWJyZVVzdWFyaW8iOiJOYWh1ZWwiLCJwcmltZXJhcGVsbGlkb1VzdWFyaW8iOiJKaW1lbmV6IiwiY29ycmVvVXN1YXJpbyI6Im5haHVlbEBnbWFpbC5jb20iLCJyb2xVc3VhcmlvIjoiRm91bmRlciIsImplcmFycXVpYVVzdWFyaW8iOiJiYXJyaW8iLCJpZENhcnJpdG8iOiI2OGMwN2U2ZTQwMjRlZDY1ZDZiNmYyOTYiLCJpZEZhdm9yaXRvcyI6IjY4YzA3ZTZlNDAyNGVkNjVkNmI2ZjI5NyIsImlhdCI6MTc1NzUyODg2OCwiZXhwIjoxNzU3NjE1MjY4fQ.VXRWWc-mZiPWyikSHR3gcbwGz0MoIciNkrmAFhrB7t0';

    console.log('📤 Enviando mensaje...');
    console.log(`👤 De: Nahuel Jimenez (${remitenteId})`);
    console.log(`👥 Para: Cristiam Celis (${destinatarioId})`);
    console.log(`💬 Mensaje: "${mensaje}"`);

    // Hacer la petición POST usando el proxy del frontend
    const response = await fetch(`http://localhost:5173/api/mensajes/${destinatarioId}`, {
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
      console.log('📝 Respuesta:', JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.text();
      console.log('❌ Error al enviar mensaje:');
      console.log('📝 Error:', errorData);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

enviarMensaje();
