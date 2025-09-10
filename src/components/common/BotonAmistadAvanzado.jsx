import React, { useState, useRef, useEffect } from 'react';
import {
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  Loader2,
  ChevronDown,
  Heart,
  MessageCircle
} from 'lucide-react';
import { useEstadoAmistad } from '../../hooks/useEstadoAmistad';

const BotonAmistadAvanzado = ({
  usuarioId,
  className = "",
  style = {},
  mostrarTexto = true
}) => {
  const {
    estado,
    cargando,
    error,
    enviarSolicitud,
    aceptarSolicitud,
    rechazarSolicitud,
    eliminarAmigo,
    recargar
  } = useEstadoAmistad(usuarioId);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debug: Log del estado actual
  console.log(`🔍 BotonAmistadAvanzado - Usuario: ${usuarioId}, Estado: ${estado}, Cargando: ${cargando}, Error: ${error}`);

  // Función para manejar dejar de seguir
  const handleDejarDeSeguir = async () => {
    console.log('Dejando de seguir a usuario:', usuarioId);
    setShowDropdown(false);
    // TODO: Implementar lógica de dejar de seguir
    // Por ahora usamos eliminarAmigo ya que es la funcionalidad disponible
    await eliminarAmigo();
  };

  // Función para manejar eliminar amistad
  const handleEliminarAmistad = async () => {
    console.log('Eliminando amistad con usuario:', usuarioId);
    setShowDropdown(false);
    await eliminarAmigo();
  };

  // Renderizar según el estado
  const renderBoton = () => {
    // Determinar si necesita fondo blanco semitransparente (solo para móvil sin texto)
    const needsTransparentBg = !mostrarTexto && (estado === 'ninguna' || estado === 'cargando');

    // Base style que se aplicará a todos los botones
    const baseStyle = needsTransparentBg ? {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      ...style
    } : style;

    // Estado de error
    if (error) {
      return (
        <button
          className={`btn btn-danger rounded-pill d-flex align-items-center gap-2 ${className}`}
          style={baseStyle}
          onClick={recargar}
          title="Error - Haz clic para recargar estado"
        >
          <UserX size={16} />
          {mostrarTexto && <span>Recargar</span>}
        </button>
      );
    }

    // Estado de carga
    if (cargando || estado === 'cargando') {
      return (
        <button
          className={`btn btn-secondary rounded-pill d-flex align-items-center gap-2 ${className}`}
          style={baseStyle}
          disabled
        >
          <Loader2 size={16} className="animate-spin" />
          {mostrarTexto && <span>Cargando...</span>}
        </button>
      );
    }

    // Log para debug
    console.log(`🎯 Renderizando botón con estado: ${estado}`);

    switch (estado) {
      case 'amigos':
        // BOTÓN CIRCULAR para "son amigos" con dropdown
        console.log('🟢 Renderizando botón de amigos (circular)');
        return (
          <div className="position-relative" ref={dropdownRef}>
            <button
              className={`btn btn-success rounded-circle d-flex align-items-center justify-content-center position-relative ${className}`}
              style={{
                width: mostrarTexto ? 44 : 40,
                height: mostrarTexto ? 44 : 40,
                padding: 0,
                border: 'none',
                backgroundColor: '#10b981',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                ...baseStyle,
                // Asegurar que mantenga su color verde
                backgroundColor: '#10b981',
                color: 'white'
              }}
              onClick={() => setShowDropdown(!showDropdown)}
              title="Son amigos - Ver opciones"
            >
              <UserCheck size={mostrarTexto ? 18 : 16} color="white" />
              {/* Indicador de dropdown - siempre visible cuando son amigos */}
              <div
                className="position-absolute"
                style={{
                  bottom: -2,
                  right: -2,
                  width: mostrarTexto ? 16 : 14,
                  height: mostrarTexto ? 16 : 14,
                  backgroundColor: '#059669',
                  borderRadius: '50%',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronDown size={mostrarTexto ? 8 : 6} color="white" />
              </div>
            </button>

            {/* Dropdown menu - disponible siempre cuando son amigos */}
            {showDropdown && (
              <div
                className="position-absolute"
                style={{
                  top: '100%',
                  right: mostrarTexto ? 0 : '50%',
                  transform: mostrarTexto ? 'none' : 'translateX(50%)',
                  marginTop: 8,
                  backgroundColor: 'white',
                  borderRadius: 12,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #e5e7eb',
                  minWidth: mostrarTexto ? 200 : 180, // Más estrecho en móvil
                  zIndex: 1000,
                  overflow: 'hidden'
                }}
              >
                {/* Opción: Dejar de seguir */}
                <button
                  className={`w-100 btn btn-light border-0 text-start d-flex align-items-center gap-${mostrarTexto ? '3' : '2'} ${mostrarTexto ? 'p-3' : 'p-2'}`}
                  onClick={handleDejarDeSeguir}
                  style={{
                    borderRadius: 0,
                    transition: 'all 0.2s ease',
                    fontSize: mostrarTexto ? '14px' : '13px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#fef3c7';
                    e.target.style.color = '#d97706';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#374151';
                  }}
                >
                  <Heart size={mostrarTexto ? 16 : 14} />
                  <span>Dejar de seguir</span>
                </button>

                {/* Separador */}
                <hr className="m-0" style={{ borderColor: '#f3f4f6' }} />

                {/* Opción: Eliminar amistad */}
                <button
                  className={`w-100 btn btn-light border-0 text-start d-flex align-items-center gap-${mostrarTexto ? '3' : '2'} ${mostrarTexto ? 'p-3' : 'p-2'}`}
                  onClick={handleEliminarAmistad}
                  style={{
                    borderRadius: 0,
                    transition: 'all 0.2s ease',
                    fontSize: mostrarTexto ? '14px' : '13px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#fee2e2';
                    e.target.style.color = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#374151';
                  }}
                >
                  <UserX size={mostrarTexto ? 16 : 14} />
                  <span>Eliminar amistad</span>
                </button>
              </div>
            )}
          </div>
        );

      case 'solicitud_enviada':
        // BOTÓN RECTANGULAR para solicitud enviada
        console.log('🟡 Renderizando botón de solicitud enviada (rectangular)');

        // Crear style combinado pero manteniendo colores importantes
        const solicitudEnviadaStyle = {
          borderRadius: 8,
          padding: mostrarTexto ? '8px 16px' : '8px 12px',
          border: 'none',
          minWidth: mostrarTexto ? 'auto' : '40px',
          height: mostrarTexto ? 'auto' : '40px',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
          ...baseStyle, // Aplicar baseStyle (que NO incluirá backgroundColor para este estado)
          // Luego forzar los colores importantes para solicitud enviada
          backgroundColor: '#f59e0b',
          color: 'white'
        };

        return (
          <button
            className={`btn d-flex align-items-center gap-2 ${className}`}
            style={solicitudEnviadaStyle}
            disabled
            title="Solicitud enviada"
          >
            <Clock size={16} color="white" />
            {mostrarTexto && <span>Pendiente</span>}
          </button>
        );

      case 'solicitud_recibida':
        // Botones rectangulares para aceptar/rechazar
        console.log('🔵 Renderizando botones de solicitud recibida');
        return (
          <div className="d-flex gap-2">
            <button
              className={`btn btn-success d-flex align-items-center gap-2`}
              style={{
                borderRadius: 8,
                padding: mostrarTexto ? '8px 16px' : '8px 12px',
                border: 'none',
                minWidth: mostrarTexto ? 'auto' : '40px',
                height: mostrarTexto ? 'auto' : '40px',
                justifyContent: 'center',
                ...baseStyle,
                // Forzar color verde
                backgroundColor: '#10b981',
                color: 'white'
              }}
              onClick={aceptarSolicitud}
              title="Aceptar solicitud"
            >
              <UserCheck size={16} color="white" />
              {mostrarTexto && <span>Aceptar</span>}
            </button>
            <button
              className={`btn btn-danger d-flex align-items-center gap-2`}
              style={{
                borderRadius: 8,
                padding: mostrarTexto ? '8px 12px' : '8px 8px',
                border: 'none',
                minWidth: mostrarTexto ? 'auto' : '40px',
                height: mostrarTexto ? 'auto' : '40px',
                justifyContent: 'center',
                ...baseStyle,
                // Forzar color rojo
                backgroundColor: '#dc2626',
                color: 'white'
              }}
              onClick={rechazarSolicitud}
              title="Rechazar solicitud"
            >
              <UserX size={16} color="white" />
              {mostrarTexto && <span>Rechazar</span>}
            </button>
          </div>
        );

      case 'ninguna':
      default:
        // BOTÓN RECTANGULAR para "agregar amigo"
        console.log('🔵 Renderizando botón agregar amigo (rectangular)');
        return (
          <button
            className={`btn btn-primary d-flex align-items-center gap-2 ${className}`}
            style={{
              borderRadius: 8,
              padding: mostrarTexto ? '8px 16px' : '8px 12px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
              transition: 'all 0.2s ease',
              minWidth: mostrarTexto ? 'auto' : '40px',
              height: mostrarTexto ? 'auto' : '40px',
              justifyContent: 'center',
              ...baseStyle,
              // Para "ninguna" mantener el azul o aplicar fondo blanco según corresponda
              backgroundColor: needsTransparentBg ? 'rgba(255, 255, 255, 0.95)' : '#3b82f6',
              color: needsTransparentBg ? '#3b82f6' : 'white'
            }}
            onClick={enviarSolicitud}
            title="Enviar solicitud de amistad"
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.35)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.25)';
            }}
          >
            <UserPlus size={16} color={needsTransparentBg ? '#3b82f6' : 'white'} />
            {mostrarTexto && <span>Agregar amigo</span>}
          </button>
        );
    }
  };

  // Si por alguna razón no se renderiza nada, mostrar botón de debug
  const botonRenderizado = renderBoton();

  if (!botonRenderizado) {
    console.error(`❌ No se pudo renderizar botón para estado: ${estado}, cargando: ${cargando}, error: ${error}`);
    return (
      <button
        className={`btn btn-secondary d-flex align-items-center gap-2 ${className}`}
        style={style}
        onClick={() => console.log('Debug: Estado actual:', { estado, cargando, error, usuarioId })}
        title={`Debug: Estado ${estado}`}
      >
        <UserX size={16} />
        {mostrarTexto && <span>Debug: {estado}</span>}
      </button>
    );
  }

  return botonRenderizado;
};

export default BotonAmistadAvanzado;
