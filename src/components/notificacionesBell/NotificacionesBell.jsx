// components/NotificacionesBell.jsx
import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';

const NotificacionesBell = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [cargando, setCargando] = useState(true);

  const cargarContador = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/notificaciones/contador', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      setNoLeidas(data.count);
    } catch (error) {
      console.error('Error cargando contador:', error);
    }
  };

  // Agrega esto temporalmente en cargarNotificaciones:
  const cargarNotificaciones = async () => {
    try {
      console.log('Iniciando carga de notificaciones');
      setCargando(true);

      // DATOS DE PRUEBA TEMPORALES
      const notificacionesPrueba = [
        {
          _id: '1',
          mensaje: 'Juan Pérez te envió una solicitud de amistad',
          leida: false,
          createdAt: new Date().toISOString(),
          tipo: 'solicitud_amistad'
        },
        {
          _id: '2',
          mensaje: 'María García aceptó tu solicitud de amistad',
          leida: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          tipo: 'amistad_aceptada'
        }
      ];

      setNotificaciones(notificacionesPrueba);
      console.log('Usando datos de prueba');

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };
  const marcarComoLeida = async (notificacionId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/notificaciones/${notificacionId}/leer`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Actualizar estado local
      setNotificaciones(prev => prev.map(n =>
        n._id === notificacionId ? { ...n, leida: true } : n
      ));
      setNoLeidas(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  useEffect(() => {
    cargarContador();

    // Polling cada 30 segundos para nuevas notificaciones
    const interval = setInterval(cargarContador, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleLista = async () => {
    console.log('Toggle lista clicked, estado actual:', mostrarLista);
    if (!mostrarLista) {
      console.log('Cargando notificaciones...');
      await cargarNotificaciones();
    }
    setMostrarLista(!mostrarLista);
    console.log('Nuevo estado:', !mostrarLista);
  };

  return (
    <div className="position-relative">
      <button
        onClick={toggleLista}
        className="btn btn-light p-2 rounded-circle position-relative"
      >
        <Bell size={20} className="text-secondary" />
        {noLeidas > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </button>

      {mostrarLista && (
        <div className="absolute right-0 top-12 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notificaciones</h3>
            {noLeidas > 0 && (
              <button
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  await fetch('http://localhost:3001/api/notificaciones/leer-todas', {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                  setNoLeidas(0);
                  setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
                }}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {cargando ? (
            <div className="p-4 text-center">Cargando...</div>
          ) : notificaciones.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No hay notificaciones</div>
          ) : (
            <div className="divide-y">
              {notificaciones.map(notificacion => (
                <div
                  key={notificacion._id}
                  className={`p-3 hover:bg-gray-50 cursor-pointer ${!notificacion.leida ? 'bg-blue-50' : ''
                    }`}
                  onClick={() => marcarComoLeida(notificacion._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm">{notificacion.mensaje}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notificacion.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notificacion.leida && (
                      <Check size={16} className="text-blue-500 ml-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificacionesBell;