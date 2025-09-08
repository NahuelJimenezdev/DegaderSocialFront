import React from 'react';
import { Users, Loader, UserPlus, Mail, Check } from 'lucide-react';

const SelectorContactos = ({
  contactos = [],
  loading = false,
  valorSeleccionado = '',
  onChange,
  placeholder = 'Seleccionar persona...',
  disabled = false
}) => {

  const contactoSeleccionado = contactos.find(c => c._id === valorSeleccionado);

  return (
    <div className="selector-contactos">
      <div className="input-group">
        <span className="input-group-text">
          {loading ? (
            <Loader className="spinner-border spinner-border-sm" size={16} />
          ) : (
            <Users size={16} />
          )}
        </span>

        <select
          className="form-select"
          value={valorSeleccionado}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled || loading}
        >
          <option value="">
            {loading ? 'Cargando contactos...' : placeholder}
          </option>

          {contactos.map(contacto => (
            <option key={contacto._id} value={contacto._id}>
              {contacto.esMiPerfil ? '👤 ' : '👥 '}
              {contacto.primernombreUsuario} {contacto.primerapellidoUsuario}
              {contacto.esMiPerfil ? ' (Tú)' : ''}
              {!contacto.esMiPerfil && contacto.correoUsuario && ` - ${contacto.correoUsuario}`}
            </option>
          ))}

          {contactos.length <= 1 && !loading && (
            <option disabled>
              💡 Agrega amigos para más opciones
            </option>
          )}
        </select>

        {contactoSeleccionado && (
          <span className="input-group-text text-success">
            <Check size={16} />
          </span>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-2">
        {loading && (
          <small className="text-muted d-flex align-items-center">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Cargando lista de contactos...
          </small>
        )}

        {!loading && contactos.length <= 1 && (
          <small className="text-warning d-flex align-items-center">
            <UserPlus className="me-1" size={14} />
            Solo puedes seleccionarte a ti mismo. Agrega amigos para más opciones.
          </small>
        )}

        {!loading && contactos.length > 1 && (
          <small className="text-success d-flex align-items-center">
            <Check className="me-1" size={14} />
            {contactos.length - 1} contacto(s) disponible(s) además de ti.
          </small>
        )}

        {contactoSeleccionado && !contactoSeleccionado.esMiPerfil && (
          <small className="text-info d-flex align-items-center mt-1">
            <Mail className="me-1" size={14} />
            {contactoSeleccionado.correoUsuario || 'Sin email registrado'}
          </small>
        )}
      </div>
    </div>
  );
};

export default SelectorContactos;
