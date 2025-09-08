import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="h3 mb-4">Panel de Administración</h1>

          <div className="row g-4">
            {/* Tarjeta de Gestión de Roles */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-users-cog text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5 className="card-title">Gestión de Roles</h5>
                  <p className="card-text text-muted">
                    Administra roles organizacionales, ministerios y permisos de usuarios
                  </p>
                  <Link to="/admin/roles" className="btn btn-primary">
                    <i className="fas fa-arrow-right me-2"></i>
                    Gestionar Roles
                  </Link>
                </div>
              </div>
            </div>

            {/* Tarjeta de Gestión de Usuarios */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-users text-success" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5 className="card-title">Gestión de Usuarios</h5>
                  <p className="card-text text-muted">
                    Administra usuarios, activaciones y desactivaciones
                  </p>
                  <button className="btn btn-success" disabled>
                    <i className="fas fa-arrow-right me-2"></i>
                    Gestionar Usuarios
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjeta de Eventos */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-calendar-alt text-warning" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5 className="card-title">Gestión de Eventos</h5>
                  <p className="card-text text-muted">
                    Administra eventos, reuniones y actividades
                  </p>
                  <Link to="/meetings" className="btn btn-warning">
                    <i className="fas fa-arrow-right me-2"></i>
                    Ver Eventos
                  </Link>
                </div>
              </div>
            </div>

            {/* Tarjeta de Reportes */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-chart-bar text-info" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5 className="card-title">Reportes</h5>
                  <p className="card-text text-muted">
                    Estadísticas de usuarios, eventos y actividad
                  </p>
                  <button className="btn btn-info" disabled>
                    <i className="fas fa-arrow-right me-2"></i>
                    Ver Reportes
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjeta de Configuración */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-cog text-secondary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5 className="card-title">Configuración</h5>
                  <p className="card-text text-muted">
                    Configuración general del sistema
                  </p>
                  <button className="btn btn-secondary" disabled>
                    <i className="fas fa-arrow-right me-2"></i>
                    Configurar
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjeta de Solicitudes Pendientes */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="fas fa-user-clock text-danger" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5 className="card-title">Solicitudes Pendientes</h5>
                  <p className="card-text text-muted">
                    Revisar solicitudes de amistad y permisos
                  </p>
                  <Link to="/solicitudes" className="btn btn-danger">
                    <i className="fas fa-arrow-right me-2"></i>
                    Ver Solicitudes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;