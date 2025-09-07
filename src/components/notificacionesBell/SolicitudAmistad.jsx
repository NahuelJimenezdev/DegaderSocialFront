// components/notificacionesBell/SolicitudAmistad.jsx
import React, { useState } from 'react';
import { Check, X, User } from 'lucide-react';

const SolicitudAmistad = ({ notificacionId, remitenteId, remitente, onResponder }) => {
  const [procesando, setProcesando] = useState(false);

  const handleRespuesta = async (accion) => {
    setProcesando(true);
    try {
      await onResponder(notificacionId, remitenteId, accion);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="mt-2">
      <div className="d-flex align-items-center mb-2">
        <div
          className="me-2 d-flex align-items-center justify-content-center bg-light rounded-circle"
          style={{ width: '32px', height: '32px' }}
        >
          {remitente?.fotoPerfil ? (
            <img
              src={remitente.fotoPerfil}
              alt={`${remitente.primernombreUsuario} ${remitente.primerapellidoUsuario}`}
              className="rounded-circle"
              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
            />
          ) : (
            <User size={16} className="text-muted" />
          )}
        </div>
        <div>
          <small className="fw-semibold">
            {remitente?.primernombreUsuario} {remitente?.primerapellidoUsuario}
          </small>
        </div>
      </div>

      <div className="d-flex gap-2">
        <button
          onClick={() => handleRespuesta('aceptar')}
          disabled={procesando}
          className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
          style={{ fontSize: '12px' }}
        >
          {procesando ? (
            <div className="spinner-border spinner-border-sm me-1" role="status" style={{ width: '12px', height: '12px' }}>
              <span className="visually-hidden">Cargando...</span>
            </div>
          ) : (
            <Check size={14} className="me-1" />
          )}
          Aceptar
        </button>

        <button
          onClick={() => handleRespuesta('rechazar')}
          disabled={procesando}
          className="btn btn-outline-secondary btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
          style={{ fontSize: '12px' }}
        >
          {procesando ? (
            <div className="spinner-border spinner-border-sm me-1" role="status" style={{ width: '12px', height: '12px' }}>
              <span className="visually-hidden">Cargando...</span>
            </div>
          ) : (
            <X size={14} className="me-1" />
          )}
          Rechazar
        </button>
      </div>
    </div>
  );
};

export default SolicitudAmistad;
