import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, User, Mail, Lock, Calendar, MapPin, Globe } from 'lucide-react';

const RegisterForm = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasenia: '',
    confirmarContrasenia: '',
    fechaNacimiento: '',
    pais: '',
    ciudad: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Listas de países y ciudades
  const paises = [
    'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Ecuador',
    'Paraguay', 'Perú', 'Uruguay', 'Venezuela', 'México', 'España', 'Estados Unidos'
  ];

  const ciudadesPorPais = {
    'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata', 'Salta', 'Tucumán'],
    'Chile': ['Santiago', 'Valparaíso', 'Concepción', 'Antofagasta', 'Temuco', 'Valdivia'],
    'Colombia': ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga'],
    'México': ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Cancún'],
    'España': ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si cambia el país, resetear la ciudad
    if (name === 'pais') {
      setFormData(prev => ({
        ...prev,
        ciudad: ''
      }));
    }

    // Limpiar error del campo actual
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    // Validar correo
    if (!formData.correo) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido';
    }

    // Validar contraseña
    if (!formData.contrasenia) {
      newErrors.contrasenia = 'La contraseña es requerida';
    } else if (formData.contrasenia.length < 6) {
      newErrors.contrasenia = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmarContrasenia) {
      newErrors.confirmarContrasenia = 'Confirma tu contraseña';
    } else if (formData.contrasenia !== formData.confirmarContrasenia) {
      newErrors.confirmarContrasenia = 'Las contraseñas no coinciden';
    }

    // Validar fecha de nacimiento
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    } else {
      const fechaNac = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      if (edad < 13) {
        newErrors.fechaNacimiento = 'Debes tener al menos 13 años';
      }
    }

    // Validar país
    if (!formData.pais) {
      newErrors.pais = 'El país es requerido';
    }

    // Validar ciudad
    if (!formData.ciudad) {
      newErrors.ciudad = 'La ciudad es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const result = await register(formData);

    if (result.success) {
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      onSwitchToLogin();
    } else {
      setErrors({ general: result.error });
    }
    setLoading(false);
  };

  return (
    <div className="register-form">
      <div className="text-center mb-4">
        <h2 className="auth-title">Crear Cuenta</h2>
        <p className="auth-subtitle">Únete a la comunidad Degader Social</p>
      </div>

      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="alert alert-danger mb-3">
            {errors.general}
          </div>
        )}

        {/* Nombre y Apellido */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="nombre" className="form-label">
              <User className="me-2" size={16} />
              Nombre *
            </label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              autoComplete="given-name"
            />
            {errors.nombre && (
              <div className="invalid-feedback">{errors.nombre}</div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="apellido" className="form-label">
              <User className="me-2" size={16} />
              Apellido *
            </label>
            <input
              type="text"
              className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Tu apellido"
              autoComplete="family-name"
            />
            {errors.apellido && (
              <div className="invalid-feedback">{errors.apellido}</div>
            )}
          </div>
        </div>

        {/* Correo */}
        <div className="form-group mb-3">
          <label htmlFor="correo" className="form-label">
            <Mail className="me-2" size={16} />
            Correo Electrónico *
          </label>
          <input
            type="email"
            className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="tu@correo.com"
            autoComplete="email"
          />
          {errors.correo && (
            <div className="invalid-feedback">{errors.correo}</div>
          )}
        </div>

        {/* Contraseñas */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="contrasenia" className="form-label">
              <Lock className="me-2" size={16} />
              Contraseña *
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.contrasenia ? 'is-invalid' : ''}`}
                id="contrasenia"
                name="contrasenia"
                value={formData.contrasenia}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.contrasenia && (
                <div className="invalid-feedback">{errors.contrasenia}</div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <label htmlFor="confirmarContrasenia" className="form-label">
              <Lock className="me-2" size={16} />
              Confirmar Contraseña *
            </label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-control ${errors.confirmarContrasenia ? 'is-invalid' : ''}`}
                id="confirmarContrasenia"
                name="confirmarContrasenia"
                value={formData.confirmarContrasenia}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmarContrasenia && (
                <div className="invalid-feedback">{errors.confirmarContrasenia}</div>
              )}
            </div>
          </div>
        </div>

        {/* Fecha de Nacimiento */}
        <div className="form-group mb-3">
          <label htmlFor="fechaNacimiento" className="form-label">
            <Calendar className="me-2" size={16} />
            Fecha de Nacimiento *
          </label>
          <input
            type="date"
            className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : ''}`}
            id="fechaNacimiento"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.fechaNacimiento && (
            <div className="invalid-feedback">{errors.fechaNacimiento}</div>
          )}
        </div>

        {/* País y Ciudad */}
        <div className="row mb-4">
          <div className="col-md-6">
            <label htmlFor="pais" className="form-label">
              <Globe className="me-2" size={16} />
              País *
            </label>
            <select
              className={`form-select ${errors.pais ? 'is-invalid' : ''}`}
              id="pais"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
            >
              <option value="">Selecciona tu país</option>
              {paises.map(pais => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
            </select>
            {errors.pais && (
              <div className="invalid-feedback">{errors.pais}</div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="ciudad" className="form-label">
              <MapPin className="me-2" size={16} />
              Ciudad *
            </label>
            <select
              className={`form-select ${errors.ciudad ? 'is-invalid' : ''}`}
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              disabled={!formData.pais}
            >
              <option value="">Selecciona tu ciudad</option>
              {formData.pais && ciudadesPorPais[formData.pais] &&
                ciudadesPorPais[formData.pais].map(ciudad => (
                  <option key={ciudad} value={ciudad}>{ciudad}</option>
                ))
              }
            </select>
            {errors.ciudad && (
              <div className="invalid-feedback">{errors.ciudad}</div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 auth-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Creando cuenta...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="mb-0">
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            className="btn-link"
            onClick={onSwitchToLogin}
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
