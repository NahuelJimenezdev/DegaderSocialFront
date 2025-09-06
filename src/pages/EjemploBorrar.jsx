// Componente de ejemplo de uso
const EjemploUso = () => {
  const [usuarios, setUsuarios] = useState([
    { id: '1', nombre: 'Juan Pérez', estado: 'ninguna' },
    { id: '2', nombre: 'María García', estado: 'solicitud_enviada' },
    { id: '3', nombre: 'Carlos López', estado: 'solicitud_recibida' },
    { id: '4', nombre: 'Ana Martínez', estado: 'amigos' },
  ]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Ejemplo de Botones de Amistad</h2>

      <div className="space-y-4">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <h3 className="font-semibold">{usuario.nombre}</h3>
                <p className="text-sm text-gray-600">Estado: {usuario.estado}</p>
              </div>
            </div>

            <FriendshipButton userId={usuario.id} />
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Estados posibles:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li><strong>ninguna:</strong> No hay relación, muestra "Agregar amigo"</li>
          <li><strong>solicitud_enviada:</strong> Solicitud pendiente enviada, muestra "Solicitud enviada" + botón cancelar</li>
          <li><strong>solicitud_recibida:</strong> Solicitud recibida, muestra botones "Aceptar" y "Rechazar"</li>
          <li><strong>amigos:</strong> Ya son amigos, muestra "Amigos" + botón eliminar</li>
          <li><strong>self:</strong> Es el mismo usuario, no muestra botón</li>
        </ul>
      </div>
    </div>
  );
};
