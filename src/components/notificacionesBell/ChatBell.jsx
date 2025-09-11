// components/notificacionesBell/ChatBell.jsx
import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, MoreHorizontal } from 'lucide-react';
import socketService from '../../services/socket.service';
import MensajesService from '../../services/mensajes.service';
import { useNavigate } from 'react-router-dom';

const ChatBell = () => {
  const [totalMensajes, setTotalMensajes] = useState(0);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [conversaciones, setConversaciones] = useState([]);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const cargarConversaciones = async () => {
    try {
      const data = await MensajesService.obtenerConversaciones();
      if (data?.success && Array.isArray(data.conversaciones)) {
        setConversaciones(data.conversaciones);
        const total = data.conversaciones.reduce((acc, c) => acc + (c.mensajesNoLeidos || 0), 0);
        setTotalMensajes(total);
      } else {
        setConversaciones([]);
        setTotalMensajes(0);
      }
    } catch (e) {
      setConversaciones([]);
      setTotalMensajes(0);
    }
  };

  useEffect(() => {
    cargarConversaciones();
    // Actualizar cuando llega un mensaje por socket
    const unsub = socketService.onMessage(() => {
      cargarConversaciones();
    });
    // También actualizar cuando llega notificación de mensaje (si no está en el chat)
    const unsubNotif = socketService.onMessageNotification(() => {
      cargarConversaciones();
    });
    return () => {
      unsub && unsub();
      unsubNotif && unsubNotif();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMostrarLista(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={menuRef}>
      <button
        onClick={async () => {
          await cargarConversaciones();
          setMostrarLista((v) => !v);
        }}
        className="btn btn-light p-2 rounded-circle position-relative"
        style={{ border: 'none' }}
        title="Mensajes"
      >
        <MessageCircle size={20} className="text-secondary" />
        {totalMensajes > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill" style={{ fontSize: '10px', padding: '2px 6px' }}>
            {totalMensajes > 99 ? '99+' : totalMensajes}
          </span>
        )}
      </button>

      {mostrarLista && (
        <div className="bg-white border rounded shadow-lg position-absolute" style={{ top: '100%', right: 0, marginTop: 8, width: 360, zIndex: 10000 }}>
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="m-0 fw-bold">Mensajes</h6>
            <button
              className="btn btn-link btn-sm text-primary p-0"
              onClick={() => {
                setMostrarLista(false);
                navigate('/messages');
              }}
              style={{ textDecoration: 'none' }}
            >
              <MoreHorizontal size={16} className="me-1" />
              Ver todos
            </button>
          </div>

          {conversaciones.length === 0 ? (
            <div className="p-4 text-center text-muted">No hay conversaciones</div>
          ) : (
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              {conversaciones.map((c) => (
                <div
                  key={c.usuario._id}
                  className="p-3 border-bottom d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setMostrarLista(false);
                    navigate('/messages', { state: { usuarioSeleccionado: c.usuario } });
                  }}
                >
                  <div className="me-3 position-relative">
                    {c.usuario.fotoPerfil ? (
                      <img src={c.usuario.fotoPerfil} alt="Avatar" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div className="avatar-placeholder" style={{ width: 40, height: 40, borderRadius: '50%', background: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {(c.usuario.primernombreUsuario || '?').charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold" style={{ fontSize: 14 }}>
                        {c.usuario.primernombreUsuario} {c.usuario.primerapellidoUsuario}
                      </span>
                      <small className="text-muted">
                        {c.fechaUltimoMensaje ? new Date(c.fechaUltimoMensaje).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </small>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <small className="text-muted" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.ultimoMensaje?.contenido || 'Sin mensajes'}
                      </small>
                      {c.mensajesNoLeidos > 0 && (
                        <span className="badge bg-primary rounded-pill" style={{ fontSize: 11 }}>{c.mensajesNoLeidos}</span>
                      )}
                    </div>
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

export default ChatBell;


