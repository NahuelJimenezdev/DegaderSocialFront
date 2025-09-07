// components/notificacionesBell/NotificacionSolicitudAmistad.jsx
import React, { useState } from 'react';
import { User, Check, X, Eye, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificacionSolicitudAmistad = ({
  notificacionId,
  remitenteId,
  remitente,
  onResponder,
  showActions = true,
  showProfile = true
}) => {
  const [procesando, setProcesando] = useState(false);
  const navigate = useNavigate();

  const handleRespuesta = async (accion) => {
    setProcesando(true);
    try {
      await onResponder(notificacionId, remitenteId, accion);
    } finally {
      setProcesando(false);
    }
  };

  const verPerfil = () => {
    navigate(`/perfil/${remitenteId}`);
  };

  const enviarMensaje = () => {
    navigate(`/messages?user=${remitenteId}`);
  };

  return (
    <div className="border rounded p-3 mb-2 bg-white">
      {/* Header con información del usuario */}
      <div className="d-flex align-items-center mb-3">
        <div
          className="me-3 d-flex align-items-center justify-content-center bg-light rounded-circle position-relative"
          style={{ width: '48px', height: '48px' }}
        >
          {remitente?.fotoPerfil ? (
            <img
              src={remitente.fotoPerfil}
              alt={`${remitente.primernombreUsuario} ${remitente.primerapellidoUsuario}`}
              className="rounded-circle"
              style={{ width: '48px', height: '48px', objectFit: 'cover' }}
            />
          ) : (
            <User size={24} className="text-muted" />
          )}
          <div
            className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '16px', height: '16px' }}
          >
            <User size={8} className="text-white" />
          </div>
        </div>

        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="m-0 fw-bold">
                {remitente?.primernombreUsuario} {remitente?.primerapellidoUsuario}
              </h6>
              {remitente?.cargoFundacion && (
                <small className="text-muted">{remitente.cargoFundacion}</small>
              )}
              <div className="mt-1">
                <small className="text-primary">Te envió una solicitud de amistad</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional del usuario */}
      {remitente?.pais && (
        <div className="mb-3">
          <small className="text-muted">
            📍 {remitente.pais}
            {remitente.ciudad && `, ${remitente.ciudad}`}
          </small>
        </div>
      )}

      {/* Botones de acción */}
      <div className="d-flex gap-2">
        {showActions && (
          <>
            <button
              onClick={() => handleRespuesta('aceptar')}
              disabled={procesando}
              className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
            >
              {procesando ? (
                <div className="spinner-border spinner-border-sm me-1" role="status" style={{ width: '12px', height: '12px' }}>
                  <span className="visually-hidden">Cargando...</span>
                </div>
              ) : (
                <Check size={16} className="me-1" />
              )}
              Aceptar
            </button>

            <button
              onClick={() => handleRespuesta('rechazar')}
              disabled={procesando}
              className="btn btn-outline-secondary btn-sm flex-grow-1 d-flex align-items-center justify-content-center"
            >
              {procesando ? (
                <div className="spinner-border spinner-border-sm me-1" role="status" style={{ width: '12px', height: '12px' }}>
                  <span className="visually-hidden">Cargando...</span>
                </div>
              ) : (
                <X size={16} className="me-1" />
              )}
              Rechazar
            </button>
          </>
        )}

        {showProfile && (
          <button
            onClick={verPerfil}
            className="btn btn-outline-primary btn-sm d-flex align-items-center"
            title="Ver perfil"
          >
            <Eye size={16} />
          </button>
        )}

        <button
          onClick={enviarMensaje}
          className="btn btn-outline-success btn-sm d-flex align-items-center"
          title="Enviar mensaje"
        >
          <MessageCircle size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificacionSolicitudAmistad;
