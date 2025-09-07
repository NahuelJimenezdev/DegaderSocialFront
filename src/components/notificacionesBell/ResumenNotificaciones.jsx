// components/notificacionesBell/ResumenNotificaciones.jsx
import React, { useState, useEffect } from 'react';
import { Bell, UserPlus, UserCheck, MessageCircle, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResumenNotificaciones = () => {
  const [resumen, setResumen] = useState({
    total: 0,
    solicitudesPendientes: 0,
    mensajesSinLeer: 0,
    proximasReuniones: 0,
    nuevasPublicaciones: 0
  });
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarResumen();
  }, []);

  const cargarResumen = async () => {
    try {
      setCargando(true);

      // DATOS DE PRUEBA - Reemplazar con llamadas reales a la API
      const resumenPrueba = {
        total: 8,
        solicitudesPendientes: 3,
        mensajesSinLeer: 2,
        proximasReuniones: 1,
        nuevasPublicaciones: 2
      };

      setResumen(resumenPrueba);
    } catch (error) {
      console.error('Error cargando resumen:', error);
    } finally {
      setCargando(false);
    }
  };

  const items = [
    {
      icon: UserPlus,
      titulo: 'Solicitudes de Amistad',
      cantidad: resumen.solicitudesPendientes,
      color: 'text-primary',
      bgColor: 'bg-primary-subtle',
      ruta: '/solicitudes',
      descripcion: 'pendientes'
    },
    {
      icon: MessageCircle,
      titulo: 'Mensajes',
      cantidad: resumen.mensajesSinLeer,
      color: 'text-success',
      bgColor: 'bg-success-subtle',
      ruta: '/messages',
      descripcion: 'sin leer'
    },
    {
      icon: Calendar,
      titulo: 'Reuniones',
      cantidad: resumen.proximasReuniones,
      color: 'text-warning',
      bgColor: 'bg-warning-subtle',
      ruta: '/meetings',
      descripcion: 'próximas'
    },
    {
      icon: Bell,
      titulo: 'Publicaciones',
      cantidad: resumen.nuevasPublicaciones,
      color: 'text-info',
      bgColor: 'bg-info-subtle',
      ruta: '/feed',
      descripcion: 'nuevas'
    }
  ];

  if (cargando) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (resumen.total === 0) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <Bell size={48} className="text-muted mb-3" />
          <h6 className="text-muted">Todo al día</h6>
          <small className="text-muted">No tienes notificaciones pendientes</small>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="m-0">
          <Bell size={20} className="me-2" />
          Resumen de Actividades
        </h6>
        <span className="badge bg-primary rounded-pill">{resumen.total}</span>
      </div>
      <div className="card-body p-0">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="d-flex align-items-center p-3 border-bottom cursor-pointer hover-bg-light"
              onClick={() => navigate(item.ruta)}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div
                className={`d-flex align-items-center justify-content-center rounded-circle me-3 ${item.bgColor}`}
                style={{ width: '40px', height: '40px' }}
              >
                <Icon size={20} className={item.color} />
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="m-0" style={{ fontSize: '14px' }}>{item.titulo}</h6>
                    <small className="text-muted">
                      {item.cantidad} {item.descripcion}
                    </small>
                  </div>
                  <div className="d-flex align-items-center">
                    {item.cantidad > 0 && (
                      <span className={`badge ${item.color.replace('text-', 'bg-')} rounded-pill me-2`}>
                        {item.cantidad}
                      </span>
                    )}
                    <ArrowRight size={16} className="text-muted" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="card-footer text-center">
        <small className="text-muted">
          Última actualización: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </small>
      </div>
    </div>
  );
};

export default ResumenNotificaciones;
