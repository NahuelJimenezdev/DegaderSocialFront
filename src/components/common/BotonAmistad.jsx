// src/components/common/BotonAmistad.jsx
import React from 'react';
import { UserPlus, UserCheck, Clock, UserX, Loader2 } from 'lucide-react';
import { useEstadoAmistad } from '../../hooks/useEstadoAmistad';

/**
 * Componente reutilizable para mostrar el estado de amistad y permitir acciones
 * @param {string} usuarioId - ID del usuario
 * @param {string} className - Clases CSS adicionales
 * @param {string} size - Tamaño del botón ('sm', 'md', 'lg')
 * @param {boolean} mostrarTexto - Si mostrar texto junto al ícono
 */
const BotonAmistad = ({
  usuarioId,
  className = '',
  size = 'md',
  mostrarTexto = true,
  variant = 'default' // 'default', 'outline', 'minimal'
}) => {
  const {
    estado,
    cargando,
    error,
    enviarSolicitud,
    aceptarSolicitud,
    rechazarSolicitud,
    eliminarAmigo,
    recargar,
    esAmigo,
    tieneSolicitudEnviada,
    tieneSolicitudRecibida,
    sinRelacion
  } = useEstadoAmistad(usuarioId);

  // Configuración de tamaños
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  // Configuración de variantes
  const variantClasses = {
    default: 'btn',
    outline: 'btn btn-outline',
    minimal: 'btn btn-ghost'
  };

  const baseClasses = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  // Debug: Log del estado actual
  console.log(`🔍 BotonAmistad - Usuario: ${usuarioId}, Estado: ${estado}, Cargando: ${cargando}, Error: ${error}`);

  // Renderizar según el estado
  const renderBoton = () => {
    if (error) {
      return (
        <button
          className={`${baseClasses} btn-error`}
          onClick={recargar}
          title="Error - Haz clic para recargar estado"
        >
          <UserX size={iconSizes[size]} />
          {mostrarTexto && <span>Recargar</span>}
        </button>
      );
    }

    if (cargando) {
      return (
        <button className={`${baseClasses} btn-disabled`} disabled>
          <Loader2 size={iconSizes[size]} className="animate-spin" />
          {mostrarTexto && <span>Cargando...</span>}
        </button>
      );
    }

    switch (estado) {
      case 'amigos':
        return (
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className={`${baseClasses} btn-success`}
              title="Son amigos"
            >
              <UserCheck size={iconSizes[size]} />
              {mostrarTexto && <span>Amigos</span>}
            </button>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <button
                  onClick={eliminarAmigo}
                  className="text-error hover:bg-error hover:text-white"
                >
                  <UserX size={14} />
                  Eliminar amistad
                </button>
              </li>
            </ul>
          </div>
        );

      case 'solicitud_enviada':
        return (
          <button
            className={`${baseClasses} btn-warning`}
            disabled
            title="Solicitud enviada"
          >
            <Clock size={iconSizes[size]} />
            {mostrarTexto && <span>Solicitud enviada</span>}
          </button>
        );

      case 'solicitud_recibida':
        return (
          <div className="flex gap-2">
            <button
              className={`${baseClasses} btn-success`}
              onClick={aceptarSolicitud}
              title="Aceptar solicitud"
            >
              <UserCheck size={iconSizes[size]} />
              {mostrarTexto && <span>Aceptar</span>}
            </button>
            <button
              className={`${baseClasses} btn-error`}
              onClick={rechazarSolicitud}
              title="Rechazar solicitud"
            >
              <UserX size={iconSizes[size]} />
              {mostrarTexto && size !== 'sm' && <span>Rechazar</span>}
            </button>
          </div>
        );

      case 'ninguna':
      default:
        return (
          <button
            className={`${baseClasses} btn-primary`}
            onClick={enviarSolicitud}
            title="Enviar solicitud de amistad"
          >
            <UserPlus size={iconSizes[size]} />
            {mostrarTexto && <span>Agregar amigo</span>}
          </button>
        );
    }
  };

  return renderBoton();
};

export default BotonAmistad;
