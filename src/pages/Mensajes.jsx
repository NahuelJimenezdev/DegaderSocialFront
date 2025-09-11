import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Users, UserPlus, Send, Search, MoreVertical, Phone, Video, Image, Paperclip, Smile, ThumbsUp, Heart, Laugh, Angry, PaperclipIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import MensajesService from '../services/mensajes.service';
import SolicitudesChat from '../components/SolicitudesChat';
import socketService from '../services/socket.service';
import './Mensajes.css';
import { buildApiUrl } from '../lib/config';
import { useAuth } from '../context/AuthContext';

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoy';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ayer';
  } else {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

const Mensajes = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('chats');
  const [conversaciones, setConversaciones] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [buscandoUsuarios, setBuscandoUsuarios] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastUserIdRef = useRef(null);

  // Simulación de datos (reemplazar con llamadas reales a la API)
  useEffect(() => {
    cargarConversaciones();

    // Conectar Socket.IO
    const currentUserId = user?._id || 'currentUser';
    socketService.connect(currentUserId);

    // Listeners de Socket.IO
    const unsubscribeMessage = socketService.onMessage((mensaje) => {
      setMensajes(prev => {
        // Verificar si el mensaje ya existe para evitar duplicados
        const mensajeExiste = prev.some(m => m._id === mensaje._id);
        if (mensajeExiste) {
          return prev; // No agregar duplicado
        }
        return [...prev, mensaje];
      });
      // No necesitamos recargar conversaciones aquí, solo actualizar localmente
    });

    // Notificación de mensaje si no estamos en este chat (ya manejado por backend)
    const unsubscribeNotif = socketService.onMessageNotification((payload) => {
      // Opcionalmente podríamos disparar un toast aquí
      // console.log('Notificación de mensaje:', payload);
    });

    const unsubscribeUserStatus = socketService.onUserStatus((status) => {
      // Actualizar estado de usuario en conversaciones
      setConversaciones(prev =>
        prev.map(conv =>
          conv.usuario._id === status.userId
            ? { ...conv, usuario: { ...conv.usuario, estadoUsuario: status.status === 'online' ? 'activo' : 'inactivo' } }
            : conv
        )
      );
    });

    const unsubscribeTyping = socketService.onTyping((data) => {
      if (usuarioSeleccionado && data.userId === usuarioSeleccionado._id) {
        setOtherUserTyping(data.typing);
      }
    });

    // Verificar conexión
    const connectionStatus = socketService.getConnectionStatus();
    setSocketConnected(connectionStatus.isConnected);

    return () => {
      unsubscribeMessage();
      unsubscribeUserStatus();
      unsubscribeTyping();
      unsubscribeNotif && unsubscribeNotif();
    };
  }, []);

  useEffect(() => {
    const currentId = usuarioSeleccionado?._id;
    if (currentId && lastUserIdRef.current !== currentId) {
      lastUserIdRef.current = currentId;
      cargarMensajes(currentId);
      // Avisar al servidor que entramos a este chat para evitar notificaciones
      socketService.enterChat(currentId);
    }
    return () => {
      // Al cambiar/abandonar chat actual
      socketService.leaveChat();
    };
  }, [usuarioSeleccionado?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  // Efecto para búsqueda de usuarios
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      buscarUsuarios(busqueda);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  // Efecto para manejar navegación desde perfil de invitado
  useEffect(() => {
    if (location.state?.usuarioSeleccionado) {
      console.log('📨 Navegando desde perfil invitado con usuario:', location.state.usuarioSeleccionado);
      const incoming = location.state.usuarioSeleccionado;
      if (!usuarioSeleccionado || usuarioSeleccionado._id !== incoming._id) {
        setUsuarioSeleccionado(incoming);
      }
      setActiveTab('chats');
    }
  }, [location.state]);

  const cargarConversaciones = async () => {
    try {
      setLoading(true);
      const response = await MensajesService.obtenerConversaciones();

      if (response.success) {
        setConversaciones(response.conversaciones);
      } else {
        console.error('Error al cargar conversaciones:', response.message);
        // Mantener datos simulados como fallback
        setConversaciones([
          {
            usuario: {
              _id: '1',
              primernombreUsuario: 'Nahuel',
              primerapellidoUsuario: 'Jimenez',
              fotoPerfil: '',
              estadoUsuario: 'activo'
            },
            ultimoMensaje: {
              contenido: 'Hola, ¿cómo estás?',
              fechaEnvio: new Date(Date.now() - 1000 * 60 * 5)
            },
            mensajesNoLeidos: 2,
            fechaUltimoMensaje: new Date(Date.now() - 1000 * 60 * 5)
          }
        ]);
      }
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
      // Mantener datos simulados como fallback
    } finally {
      setLoading(false);
    }
  };

  const cargarMensajes = async (usuarioId) => {
    try {
      const response = await MensajesService.obtenerMensajes(usuarioId);

      if (response.success) {
        setMensajes(response.mensajes);
      } else {
        console.error('Error al cargar mensajes:', response.message);
        // Mantener datos simulados como fallback
        setMensajes([
          {
            _id: '1',
            remitente: { _id: '1', primernombreUsuario: 'Nahuel', primerapellidoUsuario: 'Jimenez' },
            contenido: 'Hola, ¿cómo estás?',
            fechaEnvio: new Date(Date.now() - 1000 * 60 * 10),
            estado: 'leido'
          }
        ]);
      }
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      // Mantener datos simulados como fallback
    }
  };

  // Cuando se abre un chat, limpiar contador de no leídos de esa conversación
  useEffect(() => {
    if (!usuarioSeleccionado) return;
    setConversaciones(prev => prev.map(c =>
      c.usuario._id === usuarioSeleccionado._id ? { ...c, mensajesNoLeidos: 0 } : c
    ));
  }, [usuarioSeleccionado]);

  const buscarUsuarios = async (query) => {
    if (!query.trim()) {
      setResultadosBusqueda([]);
      return;
    }

    try {
      setBuscandoUsuarios(true);
      const url = `${buildApiUrl('/api/buscar')}?q=${encodeURIComponent(query)}&soloAmigos=true`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (response.ok && data?.exito) {
        setResultadosBusqueda(data.resultados?.usuarios || []);
      } else {
        setResultadosBusqueda([]);
      }
    } catch (error) {
      console.error('Error buscando usuarios:', error);
      setResultadosBusqueda([]);
    } finally {
      setBuscandoUsuarios(false);
    }
  };

  const iniciarConversacion = async (usuario) => {
    // Verificar si ya existe una conversación con este usuario
    const conversacionExistente = conversaciones.find(
      conv => conv.usuario._id === usuario._id
    );

    if (conversacionExistente) {
      // Si existe, seleccionar esa conversación
      setUsuarioSeleccionado(conversacionExistente.usuario);
    } else {
      // Si no existe, crear una nueva conversación
      setUsuarioSeleccionado(usuario);
      // Limpiar búsqueda
      setBusqueda('');
      setResultadosBusqueda([]);
    }
  };

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !usuarioSeleccionado) return;

    try {
      // Intentar enviar por Socket.IO para notificación en tiempo real
      const enviado = socketService.sendMessage(
        usuarioSeleccionado._id,
        nuevoMensaje.trim()
      );

      // Agregar mensaje localmente para feedback inmediato
      const tempId = Date.now().toString();
      const mensajeTemporal = {
        _id: tempId,
        remitente: { _id: 'currentUser', primernombreUsuario: 'Tú' },
        contenido: nuevoMensaje,
        fechaEnvio: new Date(),
        estado: enviado ? 'enviado' : 'pendiente'
      };
      setMensajes(prev => [...prev, mensajeTemporal]);
      setNuevoMensaje('');

      // Detener indicador de escritura
      if (isTyping) {
        socketService.stopTyping(usuarioSeleccionado._id);
        setIsTyping(false);
      }

      // Persistir SIEMPRE por HTTP y reemplazar el mensaje temporal
      const response = await MensajesService.enviarMensaje(
        usuarioSeleccionado._id,
        mensajeTemporal.contenido
      );

      if (response.success && response.mensaje?._id) {
        setMensajes(prev => prev.map(m =>
          m._id === tempId
            ? { ...m, _id: response.mensaje._id, estado: 'entregado' }
            : m
        ));
      } else {
        // Si falla la persistencia, marcar como error
        setMensajes(prev => prev.map(m =>
          m._id === tempId ? { ...m, estado: 'error' } : m
        ));
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      // Si algo falla, no hacemos nada más aquí; el mensaje temporal queda como está
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNuevoMensaje(value);

    // Indicador de escritura
    if (usuarioSeleccionado) {
      if (value.trim() && !isTyping) {
        socketService.startTyping(usuarioSeleccionado._id);
        setIsTyping(true);
      } else if (!value.trim() && isTyping) {
        socketService.stopTyping(usuarioSeleccionado._id);
        setIsTyping(false);
      }

      // Limpiar timeout anterior
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Detener escritura después de 3 segundos de inactividad
      typingTimeoutRef.current = setTimeout(() => {
        if (isTyping) {
          socketService.stopTyping(usuarioSeleccionado._id);
          setIsTyping(false);
        }
      }, 3000);
    }
  };

  const mostrarReacciones = (mensajeId) => {
    setSelectedMessageId(mensajeId);
    setShowReactions(true);
  };

  const agregarReaccion = async (mensajeId, emoji) => {
    try {
      // Aquí iría la llamada a la API para agregar reacción
      console.log('Agregando reacción:', emoji, 'al mensaje:', mensajeId);

      // Actualizar mensaje localmente
      setMensajes(prev =>
        prev.map(msg =>
          msg._id === mensajeId
            ? {
              ...msg,
              reacciones: [
                ...(msg.reacciones || []),
                {
                  usuario: { _id: 'currentUser', primernombreUsuario: 'Tú' },
                  emoji: emoji,
                  fecha: new Date()
                }
              ]
            }
            : msg
        )
      );

      setShowReactions(false);
      setSelectedMessageId(null);
    } catch (error) {
      console.error('Error agregando reacción:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !usuarioSeleccionado) return;

    try {
      const formData = new FormData();
      formData.append('archivo', file);

      // Aquí iría la subida del archivo
      console.log('Subiendo archivo:', file.name);

      // Simular envío de archivo
      const mensajeArchivo = {
        _id: Date.now().toString(),
        remitente: { _id: 'currentUser', primernombreUsuario: 'Tú' },
        contenido: `Archivo: ${file.name}`,
        tipo: file.type.startsWith('image/') ? 'imagen' : 'archivo',
        archivoAdjunto: {
          nombre: file.name,
          tipo: file.type,
          tamano: file.size
        },
        fechaEnvio: new Date(),
        estado: 'enviado'
      };

      setMensajes(prev => [...prev, mensajeArchivo]);
    } catch (error) {
      console.error('Error subiendo archivo:', error);
    }
  };

  const reacciones = [
    { emoji: '👍', icon: ThumbsUp },
    { emoji: '❤️', icon: Heart },
    { emoji: '😂', icon: Laugh },
    { emoji: '😡', icon: Angry }
  ];

  return (
    <div className="mensajes-container">
      {/* Sidebar */}
      <div className="mensajes-sidebar">
        {/* Header */}
        <div className="mensajes-header">
          <h2>Mensajes</h2>
          <div className="mensajes-actions">
            <button className="action-btn">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mensajes-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="mensajes-tabs">
          <button
            className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <MessageCircle size={18} />
            Chats
          </button>
          <button
            className={`tab-btn ${activeTab === 'grupos' ? 'active' : ''}`}
            onClick={() => setActiveTab('grupos')}
          >
            <Users size={18} />
            Grupos
          </button>
          <button
            className={`tab-btn ${activeTab === 'solicitudes' ? 'active' : ''}`}
            onClick={() => setActiveTab('solicitudes')}
          >
            <UserPlus size={18} />
            Solicitudes
          </button>
        </div>

        {/* Conversations List */}
        <div className="conversaciones-list">
          {activeTab === 'chats' && (
            <>
              {buscandoUsuarios && (
                <div className="loading">Buscando usuarios...</div>
              )}

              {/* Mostrar resultados de búsqueda de usuarios si hay búsqueda */}
              {busqueda.trim() && resultadosBusqueda.length > 0 && (
                <div className="resultados-busqueda">
                  <h4>Usuarios encontrados</h4>
                  {resultadosBusqueda.map((usuario) => (
                    <div
                      key={usuario._id}
                      className="usuario-resultado"
                      onClick={() => iniciarConversacion(usuario)}
                    >
                      <div className="usuario-avatar">
                        {usuario.fotoPerfil ? (
                          <img src={usuario.fotoPerfil} alt="Avatar" />
                        ) : (
                          <div className="avatar-placeholder">
                            {usuario.primernombreUsuario[0]}
                          </div>
                        )}
                        <div className={`estado-indicator ${usuario.estadoUsuario === 'activo' ? 'online' : 'offline'}`}></div>
                      </div>
                      <div className="usuario-info">
                        <span className="usuario-nombre">
                          {usuario.primernombreUsuario} {usuario.primerapellidoUsuario}
                        </span>
                        <small>Enviar mensaje</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mostrar conversaciones filtradas */}
              {(!busqueda.trim() || resultadosBusqueda.length === 0) && (
                <>
                  {loading ? (
                    <div className="loading">Cargando conversaciones...</div>
                  ) : conversaciones.length === 0 ? (
                    <div className="empty-state">
                      <MessageCircle size={48} />
                      <p>No hay conversaciones</p>
                      <small>Busca a un amigo para empezar a chatear</small>
                    </div>
                  ) : (
                    conversaciones
                      .filter(conv =>
                        `${conv.usuario.primernombreUsuario} ${conv.usuario.primerapellidoUsuario}`
                          .toLowerCase()
                          .includes(busqueda.toLowerCase())
                      )
                      .map((conversacion) => (
                        <div
                          key={conversacion.usuario._id}
                          className={`conversacion-item ${usuarioSeleccionado?._id === conversacion.usuario._id ? 'active' : ''}`}
                          onClick={() => setUsuarioSeleccionado(conversacion.usuario)}
                        >
                          <div className="conversacion-avatar">
                            {conversacion.usuario.fotoPerfil ? (
                              <img src={conversacion.usuario.fotoPerfil} alt="Avatar" />
                            ) : (
                              <div className="avatar-placeholder">
                                {(conversacion.usuario.primernombreUsuario || '?').charAt(0)}
                              </div>
                            )}
                            <div className={`estado-indicator ${conversacion.usuario.estadoUsuario === 'activo' ? 'online' : 'offline'}`}></div>
                          </div>

                          <div className="conversacion-info">
                            <div className="conversacion-header">
                              <span className="conversacion-nombre">
                                {conversacion.usuario.primernombreUsuario} {conversacion.usuario.primerapellidoUsuario}
                              </span>
                              <span className="conversacion-tiempo">
                                {formatTime(conversacion.fechaUltimoMensaje)}
                              </span>
                            </div>

                            <div className="conversacion-preview">
                              <span className="ultimo-mensaje">
                                {conversacion.ultimoMensaje?.contenido || 'Sin mensajes'}
                              </span>
                              {conversacion.mensajesNoLeidos > 0 && (
                                <span className="mensajes-no-leidos">
                                  {conversacion.mensajesNoLeidos}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </>
              )}
            </>
          )}

          {activeTab === 'grupos' && (
            <div className="empty-state">
              <Users size={48} />
              <p>Grupos próximamente</p>
              <small>Esta funcionalidad estará disponible pronto</small>
            </div>
          )}

          {activeTab === 'solicitudes' && (
            <SolicitudesChat />
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="mensajes-chat">
        {usuarioSeleccionado ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="chat-avatar">
                  {usuarioSeleccionado.fotoPerfil ? (
                    <img src={usuarioSeleccionado.fotoPerfil} alt="Avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      {(usuarioSeleccionado.primernombreUsuario || '?').charAt(0)}
                    </div>
                  )}
                  <div className={`estado-indicator ${usuarioSeleccionado.estadoUsuario === 'activo' ? 'online' : 'offline'}`}></div>
                </div>

                <div className="chat-user-details">
                  <h3>{usuarioSeleccionado.primernombreUsuario} {usuarioSeleccionado.primerapellidoUsuario}</h3>
                  <span className="user-status">
                    {usuarioSeleccionado.estadoUsuario === 'activo' ? 'En línea' : 'Desconectado'}
                  </span>
                </div>
              </div>

              <div className="chat-actions">
                <button className="action-btn">
                  <Phone size={20} />
                </button>
                <button className="action-btn">
                  <Video size={20} />
                </button>
                <button className="action-btn">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {mensajes.map((mensaje, index) => {
                const isCurrentUser = mensaje.remitente._id === (user?._id || 'currentUser');
                const showDate = index === 0 ||
                  formatDate(mensajes[index - 1].fechaEnvio) !== formatDate(mensaje.fechaEnvio);

                return (
                  <React.Fragment key={mensaje._id}>
                    {showDate && (
                      <div className="message-date">
                        <span>{formatDate(mensaje.fechaEnvio)}</span>
                      </div>
                    )}

                    <div className={`message ${isCurrentUser ? 'own' : 'other'}`}>
                      {!isCurrentUser && (
                        <div className="message-avatar">
                          {mensaje.remitente.fotoPerfil ? (
                            <img src={mensaje.remitente.fotoPerfil} alt="Avatar" />
                          ) : (
                            <div className="avatar-placeholder small">
                              {(mensaje.remitente.primernombreUsuario || '?').charAt(0)}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="message-content">
                        <div className={`message-bubble ${mensaje.estado || ''}`}>
                          {mensaje.tipo === 'imagen' && mensaje.archivoAdjunto ? (
                            <div className="message-image">
                              <img src={mensaje.archivoAdjunto.url || '/placeholder-image.png'} alt="Imagen" />
                            </div>
                          ) : null}

                          <p>{mensaje.contenido}</p>
                          <div className="message-meta-inside">
                            <span className="message-time-inside">{formatTime(mensaje.fechaEnvio)}</span>
                            {isCurrentUser && (
                              <span className={`message-ticks ${mensaje.estado || 'enviado'}`}>
                                {mensaje.estado === 'enviado' && '✓'}
                                {(mensaje.estado === 'entregado' || mensaje.estado === 'leido') && '✓✓'}
                                {mensaje.estado === 'error' && '✕'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="message-actions">
                          <button
                            className="action-btn small"
                            onClick={() => mostrarReacciones(mensaje._id)}
                          >
                            <Smile size={14} />
                          </button>
                        </div>

                        {/* hora ya se muestra dentro de la burbuja para ambos lados */}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              {/* Indicador de escritura */}
              {otherUserTyping && (
                <div className="typing-indicator">
                  <div className="typing-avatar">
                    {usuarioSeleccionado?.fotoPerfil ? (
                      <img src={usuarioSeleccionado.fotoPerfil} alt="Avatar" />
                    ) : (
                      <div className="avatar-placeholder small">
                        {(usuarioSeleccionado?.primernombreUsuario || '?').charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="typing-bubble">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="chat-input">
              <div className="input-container">
                <button className="input-btn">
                  <Paperclip size={20} />
                </button>

                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={nuevoMensaje}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
                />

                <button className="input-btn">
                  <Smile size={20} />
                </button>

                <button
                  className="input-btn send-btn"
                  onClick={enviarMensaje}
                  disabled={!nuevoMensaje.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">
            <MessageCircle size={64} />
            <h3>Selecciona una conversación</h3>
            <p>Elige un chat para empezar a conversar</p>
          </div>
        )}
      </div>

      {/* Modal de Reacciones */}
      {showReactions && (
        <div className="reactions-modal-overlay" onClick={() => setShowReactions(false)}>
          <div className="reactions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reactions-grid">
              {reacciones.map((reaccion, index) => (
                <button
                  key={index}
                  className="reaction-btn"
                  onClick={() => agregarReaccion(selectedMessageId, reaccion.emoji)}
                  title={reaccion.emoji}
                >
                  <span className="reaction-emoji">{reaccion.emoji}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mensajes;