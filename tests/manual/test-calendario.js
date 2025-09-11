// Script para probar la funcionalidad del calendario con datos reales
const baseURL = 'http://localhost:3001/api';

// Datos de prueba para login
const loginData = {
  usuario: 'admin',
  password: 'admin123'
};

async function testCalendario() {
  try {
    console.log('🚀 Iniciando test del calendario...\n');

    // 1. Login para obtener token
    console.log('📝 Haciendo login...');
    const loginResponse = await fetch(`${baseURL}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    const loginResult = await loginResponse.json();

    if (loginResult.success) {
      console.log('✅ Login exitoso');
      const token = loginResult.data.token;

      // 2. Obtener eventos del usuario
      console.log('\n📅 Obteniendo eventos del usuario...');
      const eventosResponse = await fetch(`${baseURL}/eventos/usuario/mis-eventos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const eventosResult = await eventosResponse.json();

      if (eventosResult.success) {
        console.log('✅ Eventos obtenidos exitosamente');
        const eventos = eventosResult.data;

        console.log(`\n📊 Resumen de eventos (${eventos.length} eventos):`);

        // Agrupar eventos por mes para verificar funcionalidad del calendario
        const eventosPorMes = {};

        eventos.forEach((evento, index) => {
          console.log(`\n${index + 1}. ${evento.nombre}`);
          console.log(`   📍 Ubicación: ${evento.ubicacion || 'No especificada'}`);
          console.log(`   🔗 Modalidad: ${evento.tipoModalidad || 'No especificada'}`);
          console.log(`   🔒 Privado: ${evento.esPrivado ? 'Sí' : 'No'}`);

          if (evento.fechaInicio) {
            const fecha = new Date(evento.fechaInicio);
            const mesAno = fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

            if (!eventosPorMes[mesAno]) {
              eventosPorMes[mesAno] = [];
            }
            eventosPorMes[mesAno].push(evento);

            console.log(`   📅 Fecha: ${fecha.toLocaleDateString('es-ES')}`);
            console.log(`   🕐 Hora: ${fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`);
          }
        });

        console.log('\n📊 Eventos por mes (para calendario):');
        Object.keys(eventosPorMes).forEach(mes => {
          console.log(`\n📅 ${mes}: ${eventosPorMes[mes].length} eventos`);
          eventosPorMes[mes].forEach(evento => {
            const fecha = new Date(evento.fechaInicio);
            console.log(`   - ${evento.nombre} (${fecha.getDate()}/${fecha.getMonth() + 1})`);
          });
        });

        console.log('\n✅ El calendario debería mostrar estos eventos organizados por día');
        console.log('💡 Puedes navegar entre meses para ver todos los eventos');

      } else {
        console.log('❌ Error obteniendo eventos:', eventosResult.message);
      }

    } else {
      console.log('❌ Error en login:', loginResult.message);
    }

  } catch (error) {
    console.error('💥 Error en el test:', error.message);
    if (error.cause) {
      console.error('🔍 Causa del error:', error.cause);
    }
    console.error('🌐 Verificar que el servidor esté corriendo en:', baseURL);
  }
}

// Ejecutar el test
testCalendario();
