import React, { useState, useEffect } from 'react';
import { Users, Loader, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

const PruebaContactos = () => {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarContactos = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/amigos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Contactos recibidos:', data);
        setContactos(data.amigos || []);
      } else {
        const errorData = await response.json();
        setError(`Error ${response.status}: ${errorData.message || 'Error al cargar contactos'}`);
      }
    } catch (error) {
      console.error('❌ Error al cargar contactos:', error);
      setError(`Error de conexión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarContactos();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <Users className="me-2" size={20} />
            Prueba de Carga de Contactos
          </h5>
        </div>
        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Estado: {loading ? 'Cargando...' : `${contactos.length} contactos encontrados`}</span>
            <button
              className="btn btn-primary btn-sm"
              onClick={cargarContactos}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="me-1 spinner-border spinner-border-sm" size={14} />
                  Cargando...
                </>
              ) : (
                <>
                  <UserPlus className="me-1" size={14} />
                  Recargar
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <AlertCircle className="me-2" size={16} />
              {error}
            </div>
          )}

          {!loading && !error && contactos.length === 0 && (
            <div className="alert alert-info" role="alert">
              <Users className="me-2" size={16} />
              No tienes contactos agregados aún. ¡Busca y agrega amigos!
            </div>
          )}

          {contactos.length > 0 && (
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {contactos.map((contacto, index) => (
                    <tr key={contacto._id || index}>
                      <td>
                        <img
                          src={contacto.fotoPerfil || '/default-avatar.png'}
                          alt={contacto.primernombreUsuario}
                          className="rounded-circle"
                          width="32"
                          height="32"
                        />
                      </td>
                      <td>
                        <strong>
                          {contacto.primernombreUsuario} {contacto.primerapellidoUsuario}
                        </strong>
                      </td>
                      <td>
                        <small className="text-muted">
                          {contacto.correoUsuario || 'Sin email'}
                        </small>
                      </td>
                      <td>
                        <CheckCircle className="text-success" size={16} />
                        <small className="ms-1">Amigo</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <hr />

          <div className="row">
            <div className="col-md-6">
              <h6>Información del endpoint:</h6>
              <ul className="list-unstyled small text-muted">
                <li><strong>URL:</strong> /api/amigos</li>
                <li><strong>Método:</strong> GET</li>
                <li><strong>Autenticación:</strong> Bearer Token</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6>Formato esperado:</h6>
              <pre className="small text-muted">
                {`{
  "amigos": [
    {
      "_id": "id_usuario",
      "primernombreUsuario": "Nombre",
      "primerapellidoUsuario": "Apellido",
      "correoUsuario": "email@ejemplo.com",
      "fotoPerfil": "url_imagen"
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PruebaContactos;
