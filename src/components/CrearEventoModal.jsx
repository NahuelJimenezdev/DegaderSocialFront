import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Monitor,
  Users,
  Upload,
  X,
  Globe,
  Lock,
  Image as ImageIcon,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import EmojiSelector from './EmojiSelector';
import ConfiguracionPrivacidad from './eventos/ConfiguracionPrivacidad';

const CrearEventoModal = ({ show, onHide, usuario, onEventoCreado }) => {
  // Estados básicos del evento
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    horaInicio: '',
    fechaFin: '',
    horaFin: '',
    zonaHoraria: 'America/Argentina/Buenos_Aires',
    tipoModalidad: 'presencial',
    categoria: 'otro',
    capacidadMaxima: '',
    esPrivado: false,
    requiereAprobacion: false,
    tienePortada: true
  });

  // Estados para ubicación
  const [ubicacion, setUbicacion] = useState({
    direccion: '',
    ciudad: '',
    provincia: '',
    pais: 'Argentina'
  });

  // Estados para virtual
  const [linkVirtual, setLinkVirtual] = useState('');

  // Estados para archivos
  const [imagenPortada, setImagenPortada] = useState(null);
  const [imagenesAdicionales, setImagenesAdicionales] = useState([]);
  const [previewPortada, setPreviewPortada] = useState(null);
  const [previewsAdicionales, setPreviewsAdicionales] = useState([]);

  // Estado para configuración de privacidad
  const [configuracionPrivacidad, setConfiguracionPrivacidad] = useState({
    tipoPrivacidad: 'publico',
    visibilidad: 'publico',
    aprobacion: {
      requerida: false,
      autorPersonaAprueba: '',
      mensajeAprobacion: '',
      tiempoLimiteAprobacion: 24,
      aprobarAutomaticamente: false
    },
    registros: {
      permitirAutoRegistro: true,
      limiteAsistentes: null,
      requiereConfirmacion: false,
      corteFechaRegistro: '',
      camposAdicionales: []
    },
    listaEspera: {
      activa: false,
      limite: null,
      notificarCuandoHayEspacio: true
    }
  });

  // Estados de UI
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState('');
  const [paso, setPaso] = useState(1);

  // Estado para contactos/amigos
  const [contactos, setContactos] = useState([]);
  const [loadingContactos, setLoadingContactos] = useState(false);

  // Referencias
  const descripcionRef = useRef(null);
  const portadaInputRef = useRef(null);
  const imagenesInputRef = useRef(null);

  // Categorías de eventos
  const categorias = [
    { value: 'conferencia', label: '🎯 Conferencia', icon: '🎯' },
    { value: 'taller', label: '🛠️ Taller', icon: '🛠️' },
    { value: 'seminario', label: '📚 Seminario', icon: '📚' },
    { value: 'webinar', label: '💻 Webinar', icon: '💻' },
    { value: 'networking', label: '🤝 Networking', icon: '🤝' },
    { value: 'social', label: '🎉 Social', icon: '🎉' },
    { value: 'deportivo', label: '⚽ Deportivo', icon: '⚽' },
    { value: 'cultural', label: '🎭 Cultural', icon: '🎭' },
    { value: 'educativo', label: '🎓 Educativo', icon: '🎓' },
    { value: 'corporativo', label: '🏢 Corporativo', icon: '🏢' },
    { value: 'tecnologia', label: '⚡ Tecnología', icon: '⚡' },
    { value: 'arte', label: '🎨 Arte', icon: '🎨' },
    { value: 'musica', label: '🎵 Música', icon: '🎵' },
    { value: 'negocios', label: '💼 Negocios', icon: '💼' },
    { value: 'salud', label: '🏥 Salud', icon: '🏥' },
    { value: 'otro', label: '📌 Otro', icon: '📌' }
  ];

  // Zonas horarias principales
  const zonasHorarias = [
    { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (UTC-3)' },
    { value: 'America/Sao_Paulo', label: 'Brasil (UTC-3)' },
    { value: 'America/Santiago', label: 'Chile (UTC-3)' },
    { value: 'America/Bogota', label: 'Colombia (UTC-5)' },
    { value: 'America/Mexico_City', label: 'México (UTC-6)' },
    { value: 'America/New_York', label: 'Nueva York (UTC-5)' },
    { value: 'Europe/Madrid', label: 'España (UTC+1)' },
    { value: 'UTC', label: 'UTC (Tiempo Universal)' }
  ];

  // Función para manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para agregar emoji a descripción
  const handleEmojiSelect = (emoji) => {
    const textarea = descripcionRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = formData.descripcion.substring(0, start) + emoji + formData.descripcion.substring(end);
      setFormData(prev => ({ ...prev, descripcion: newText }));

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setFormData(prev => ({ ...prev, descripcion: prev.descripcion + emoji }));
    }
  };

  // Función para manejar imagen de portada
  const handlePortadaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImagenPortada(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreviewPortada(e.target.result);
        reader.readAsDataURL(file);
        setError('');
      } else {
        setError('Solo se permiten archivos de imagen');
      }
    }
  };

  // Función para manejar imágenes adicionales
  const handleImagenesAdicionalesChange = (e) => {
    const files = Array.from(e.target.files);
    const imagenesValidas = files.filter(file => file.type.startsWith('image/'));

    if (imagenesValidas.length !== files.length) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    setImagenesAdicionales(prev => [...prev, ...imagenesValidas]);

    // Crear previews
    imagenesValidas.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewsAdicionales(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Función para quitar imagen adicional
  const quitarImagenAdicional = (index) => {
    setImagenesAdicionales(prev => prev.filter((_, i) => i !== index));
    setPreviewsAdicionales(prev => prev.filter((_, i) => i !== index));
  };

  // Función para cargar contactos/amigos
  const cargarContactos = async () => {
    setLoadingContactos(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/amigos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Incluir también al usuario actual en la lista
        const contactosCompletos = [
          {
            _id: usuario._id,
            primernombreUsuario: usuario.primernombreUsuario,
            primerapellidoUsuario: usuario.primerapellidoUsuario,
            correoUsuario: usuario.correoUsuario,
            esMiPerfil: true
          },
          ...(data.amigos || [])
        ];
        setContactos(contactosCompletos);
      } else {
        console.error('Error al cargar contactos');
        // Si no hay amigos, al menos agregar al usuario actual
        setContactos([{
          _id: usuario._id,
          primernombreUsuario: usuario.primernombreUsuario,
          primerapellidoUsuario: usuario.primerapellidoUsuario,
          correoUsuario: usuario.correoUsuario,
          esMiPerfil: true
        }]);
      }
    } catch (error) {
      console.error('Error al cargar contactos:', error);
      // En caso de error, agregar solo el usuario actual
      setContactos([{
        _id: usuario._id,
        primernombreUsuario: usuario.primernombreUsuario,
        primerapellidoUsuario: usuario.primerapellidoUsuario,
        correoUsuario: usuario.correoUsuario,
        esMiPerfil: true
      }]);
    } finally {
      setLoadingContactos(false);
    }
  };

  // useEffect para cargar contactos cuando se abre el modal
  useEffect(() => {
    if (show && usuario) {
      cargarContactos();
    }
  }, [show, usuario]);

  // Función para validar el formulario
  const validarFormulario = () => {
    if (!formData.nombre.trim()) {
      setError('El nombre del evento es obligatorio');
      return false;
    }
    if (!formData.descripcion.trim()) {
      setError('La descripción del evento es obligatoria');
      return false;
    }
    if (!formData.fechaInicio) {
      setError('La fecha de inicio es obligatoria');
      return false;
    }
    if (!formData.horaInicio) {
      setError('La hora de inicio es obligatoria');
      return false;
    }
    if (formData.tipoModalidad === 'presencial' && !ubicacion.direccion.trim()) {
      setError('La dirección es obligatoria para eventos presenciales');
      return false;
    }
    if (formData.tipoModalidad === 'virtual' && !linkVirtual.trim()) {
      setError('El enlace virtual es obligatorio para eventos virtuales');
      return false;
    }
    return true;
  };

  // Función para crear el evento
  const handleCrearEvento = async () => {
    if (!validarFormulario()) return;

    setCreando(true);
    setError('');

    try {
      const formDataToSend = new FormData();

      // Datos básicos
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Configuración de privacidad
      formDataToSend.append('configuracionPrivacidad', JSON.stringify(configuracionPrivacidad));

      // Ubicación para eventos presenciales
      if (formData.tipoModalidad === 'presencial' || formData.tipoModalidad === 'hibrido') {
        formDataToSend.append('ubicacion', JSON.stringify(ubicacion));
      }

      // Link para eventos virtuales
      if (formData.tipoModalidad === 'virtual' || formData.tipoModalidad === 'hibrido') {
        formDataToSend.append('linkVirtual', linkVirtual);
      }

      // Archivos
      if (imagenPortada) {
        formDataToSend.append('imagenPortada', imagenPortada);
      }

      imagenesAdicionales.forEach(imagen => {
        formDataToSend.append('imagenes', imagen);
      });

      const response = await fetch('http://localhost:3001/api/eventos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Evento creado exitosamente:', data);
        if (onEventoCreado) {
          onEventoCreado(data.evento);
        }
        onHide();
        resetForm();
      } else {
        setError(data.message || 'Error al crear el evento');
      }

    } catch (error) {
      console.error('❌ Error creando evento:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setCreando(false);
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      fechaInicio: '',
      horaInicio: '',
      fechaFin: '',
      horaFin: '',
      zonaHoraria: 'America/Argentina/Buenos_Aires',
      tipoModalidad: 'presencial',
      categoria: 'otro',
      capacidadMaxima: '',
      esPrivado: false,
      requiereAprobacion: false,
      tienePortada: true
    });
    setUbicacion({
      direccion: '',
      ciudad: '',
      provincia: '',
      pais: 'Argentina'
    });
    setLinkVirtual('');
    setImagenPortada(null);
    setImagenesAdicionales([]);
    setPreviewPortada(null);
    setPreviewsAdicionales([]);
    setPaso(1);
    setError('');
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg">
          {/* Header del modal */}
          <div className="modal-header bg-gradient border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white rounded-circle p-2">
                <Calendar className="text-primary" size={24} />
              </div>
              <div className="text-white">
                <h4 className="modal-title mb-0 fw-bold">Crear Nuevo Evento</h4>
                <small className="opacity-75">Organiza experiencias inolvidables</small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onHide}
            ></button>
          </div>

          {/* Indicador de pasos */}
          <div className="px-4 py-3 bg-light border-bottom">
            <div className="row">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  {[1, 2, 3].map(stepNumber => (
                    <div key={stepNumber} className="d-flex align-items-center">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${paso >= stepNumber
                          ? 'bg-primary text-white'
                          : 'bg-light text-muted border'
                          }`}
                        style={{ width: '32px', height: '32px' }}
                      >
                        {stepNumber}
                      </div>
                      <span className={`ms-2 small fw-medium ${paso >= stepNumber ? 'text-primary' : 'text-muted'}`}>
                        {stepNumber === 1 && 'Información Básica'}
                        {stepNumber === 2 && 'Detalles & Ubicación'}
                        {stepNumber === 3 && 'Imágenes & Configuración'}
                      </span>
                      {stepNumber < 3 && (
                        <div
                          className={`ms-3 flex-grow-1 ${paso > stepNumber ? 'bg-primary' : 'bg-light'}`}
                          style={{ height: '2px', minWidth: '50px' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Body del modal */}
          <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                <X size={16} />
                {error}
              </div>
            )}

            {/* Paso 1: Información Básica */}
            {paso === 1 && (
              <div className="row g-4">
                <div className="col-12">
                  <h5 className="text-primary fw-bold mb-3 d-flex align-items-center gap-2">
                    <Calendar size={20} />
                    Información Básica del Evento
                  </h5>
                </div>

                {/* Nombre del evento */}
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Nombre del Evento <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Ej: Conferencia de Tecnología 2025"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    maxLength={100}
                  />
                  <div className="form-text">
                    {formData.nombre.length}/100 caracteres
                  </div>
                </div>

                {/* Categoría */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Categoría</label>
                  <select
                    className="form-select"
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                  >
                    {categorias.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Modalidad */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Modalidad <span className="text-danger">*</span>
                  </label>
                  <div className="row g-2">
                    {[
                      { value: 'presencial', label: 'Presencial', icon: MapPin },
                      { value: 'virtual', label: 'Virtual', icon: Monitor },
                      { value: 'hibrido', label: 'Híbrido', icon: Globe }
                    ].map(modalidad => {
                      const Icon = modalidad.icon;
                      return (
                        <div key={modalidad.value} className="col-4">
                          <input
                            type="radio"
                            className="btn-check"
                            name="modalidad"
                            id={modalidad.value}
                            value={modalidad.value}
                            checked={formData.tipoModalidad === modalidad.value}
                            onChange={(e) => handleInputChange('tipoModalidad', e.target.value)}
                          />
                          <label className="btn btn-outline-primary w-100 d-flex flex-column align-items-center gap-1 py-3" htmlFor={modalidad.value}>
                            <Icon size={20} />
                            <small className="fw-medium">{modalidad.label}</small>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Descripción */}
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-semibold mb-0">
                      Descripción del Evento <span className="text-danger">*</span>
                    </label>
                    <EmojiSelector onEmojiSelect={handleEmojiSelect} />
                  </div>
                  <textarea
                    ref={descripcionRef}
                    className="form-control"
                    rows="4"
                    placeholder="Describe tu evento... ¿De qué se trata? ¿Qué pueden esperar los asistentes?"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    maxLength={2000}
                  />
                  <div className="form-text">
                    {formData.descripcion.length}/2000 caracteres
                  </div>
                </div>
              </div>
            )}

            {/* Paso 2: Detalles & Ubicación */}
            {paso === 2 && (
              <div className="row g-4">
                <div className="col-12">
                  <h5 className="text-primary fw-bold mb-3 d-flex align-items-center gap-2">
                    <Clock size={20} />
                    Fecha, Hora y Ubicación
                  </h5>
                </div>

                {/* Fecha y hora de inicio */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Fecha de Inicio <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.fechaInicio}
                    onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Hora de Inicio <span className="text-danger">*</span>
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    value={formData.horaInicio}
                    onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                  />
                </div>

                {/* Fecha y hora de fin (opcional) */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Fecha de Fin (Opcional)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.fechaFin}
                    onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                    min={formData.fechaInicio || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Hora de Fin (Opcional)</label>
                  <input
                    type="time"
                    className="form-control"
                    value={formData.horaFin}
                    onChange={(e) => handleInputChange('horaFin', e.target.value)}
                  />
                </div>

                {/* Zona horaria */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Zona Horaria</label>
                  <select
                    className="form-select"
                    value={formData.zonaHoraria}
                    onChange={(e) => handleInputChange('zonaHoraria', e.target.value)}
                  >
                    {zonasHorarias.map(zona => (
                      <option key={zona.value} value={zona.value}>
                        {zona.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Capacidad */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <Users size={16} className="me-1" />
                    Capacidad Máxima (Opcional)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ej: 100"
                    value={formData.capacidadMaxima}
                    onChange={(e) => handleInputChange('capacidadMaxima', e.target.value)}
                    min="1"
                  />
                  <div className="form-text">Deja vacío para capacidad ilimitada</div>
                </div>

                {/* Ubicación para eventos presenciales */}
                {(formData.tipoModalidad === 'presencial' || formData.tipoModalidad === 'hibrido') && (
                  <>
                    <div className="col-12">
                      <h6 className="text-secondary fw-semibold mb-3 d-flex align-items-center gap-2">
                        <MapPin size={18} />
                        Ubicación del Evento
                      </h6>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Dirección <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Av. Corrientes 1234, CABA"
                        value={ubicacion.direccion}
                        onChange={(e) => setUbicacion(prev => ({ ...prev, direccion: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Ciudad</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buenos Aires"
                        value={ubicacion.ciudad}
                        onChange={(e) => setUbicacion(prev => ({ ...prev, ciudad: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Provincia/Estado</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="CABA"
                        value={ubicacion.provincia}
                        onChange={(e) => setUbicacion(prev => ({ ...prev, provincia: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">País</label>
                      <input
                        type="text"
                        className="form-control"
                        value={ubicacion.pais}
                        onChange={(e) => setUbicacion(prev => ({ ...prev, pais: e.target.value }))}
                      />
                    </div>
                  </>
                )}

                {/* Link virtual para eventos virtuales */}
                {(formData.tipoModalidad === 'virtual' || formData.tipoModalidad === 'hibrido') && (
                  <div className="col-12">
                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                      <Monitor size={16} />
                      Enlace Virtual <span className="text-danger">*</span>
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://meet.google.com/abc-defg-hij o https://zoom.us/j/123456789"
                      value={linkVirtual}
                      onChange={(e) => setLinkVirtual(e.target.value)}
                    />
                    <div className="form-text">
                      Enlace de Zoom, Meet, Teams, etc. donde se realizará el evento
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Paso 3: Imágenes & Configuración */}
            {paso === 3 && (
              <div className="row g-4">
                <div className="col-12">
                  <h5 className="text-primary fw-bold mb-3 d-flex align-items-center gap-2">
                    <ImageIcon size={20} />
                    Imágenes y Configuración Final
                  </h5>
                </div>

                {/* Configuración de portada */}
                <div className="col-12">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.tienePortada}
                        onChange={(e) => handleInputChange('tienePortada', e.target.checked)}
                      />
                      <label className="form-check-label fw-semibold">
                        {formData.tienePortada ? (
                          <span className="d-flex align-items-center gap-2">
                            <Eye size={16} />
                            Con Portada
                          </span>
                        ) : (
                          <span className="d-flex align-items-center gap-2">
                            <EyeOff size={16} />
                            Sin Portada
                          </span>
                        )}
                      </label>
                    </div>
                    <small className="text-muted">
                      {formData.tienePortada
                        ? 'El evento tendrá una imagen destacada'
                        : 'El evento no mostrará imagen de portada'
                      }
                    </small>
                  </div>
                </div>

                {/* Imagen de portada */}
                {formData.tienePortada && (
                  <div className="col-12">
                    <label className="form-label fw-semibold">Imagen de Portada</label>
                    <div className="border-2 border-dashed border-primary rounded-3 p-4 text-center bg-light">
                      {previewPortada ? (
                        <div className="position-relative d-inline-block">
                          <img
                            src={previewPortada}
                            alt="Preview portada"
                            className="img-fluid rounded-3 shadow-sm"
                            style={{ maxHeight: '200px' }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle p-1 m-1"
                            onClick={() => {
                              setImagenPortada(null);
                              setPreviewPortada(null);
                              if (portadaInputRef.current) {
                                portadaInputRef.current.value = '';
                              }
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="text-primary mb-2" size={48} />
                          <h6 className="text-primary">Subir Imagen de Portada</h6>
                          <p className="text-muted mb-3">
                            Arrastra una imagen aquí o haz clic para seleccionar
                          </p>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => portadaInputRef.current?.click()}
                          >
                            Seleccionar Imagen
                          </button>
                        </div>
                      )}
                      <input
                        ref={portadaInputRef}
                        type="file"
                        className="d-none"
                        accept="image/*"
                        onChange={handlePortadaChange}
                      />
                    </div>
                    <div className="form-text">
                      Formato recomendado: 16:9 (1920x1080px). Máximo 5MB.
                    </div>
                  </div>
                )}

                {/* Imágenes adicionales */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Imágenes Adicionales (Opcional)</label>
                  <div className="border-2 border-dashed border-secondary rounded-3 p-3 text-center">
                    <Upload className="text-secondary mb-2" size={32} />
                    <p className="mb-2">Agrega hasta 5 imágenes adicionales</p>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => imagenesInputRef.current?.click()}
                    >
                      Seleccionar Imágenes
                    </button>
                    <input
                      ref={imagenesInputRef}
                      type="file"
                      className="d-none"
                      accept="image/*"
                      multiple
                      onChange={handleImagenesAdicionalesChange}
                    />
                  </div>

                  {/* Previews de imágenes adicionales */}
                  {previewsAdicionales.length > 0 && (
                    <div className="row g-2 mt-2">
                      {previewsAdicionales.map((preview, index) => (
                        <div key={index} className="col-6 col-md-3">
                          <div className="position-relative">
                            <img
                              src={preview}
                              alt={`Preview ${index}`}
                              className="img-fluid rounded shadow-sm w-100"
                              style={{ height: '100px', objectFit: 'cover' }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle p-1 m-1"
                              onClick={() => quitarImagenAdicional(index)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Configuración de privacidad */}
                <div className="col-12">
                  <ConfiguracionPrivacidad
                    evento={{ configuracionPrivacidad }}
                    onChange={setConfiguracionPrivacidad}
                    usuarios={contactos}
                    loading={loadingContactos}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer del modal */}
          <div className="modal-footer bg-light border-0 d-flex justify-content-between">
            <div>
              {paso > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setPaso(prev => prev - 1)}
                >
                  Anterior
                </button>
              )}
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-light"
                onClick={onHide}
              >
                Cancelar
              </button>

              {paso < 3 ? (
                <button
                  type="button"
                  className="btn btn-primary px-4"
                  onClick={() => setPaso(prev => prev + 1)}
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success px-4 d-flex align-items-center gap-2"
                  onClick={handleCrearEvento}
                  disabled={creando}
                >
                  {creando ? (
                    <>
                      <div className="spinner-border spinner-border-sm" role="status" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Crear Evento
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearEventoModal;
