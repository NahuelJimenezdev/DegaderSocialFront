import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const LoginForm = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    correo: '',
    contrasenia: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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

    if (!formData.correo) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido';
    }

    if (!formData.contrasenia) {
      newErrors.contrasenia = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    const result = await login(formData.correo, formData.contrasenia);

    if (!result.success) {
      setErrors({ general: result.error });
    }
    setLoading(false);
  }; return (
    <div className="login-form">
      <div className="text-center mb-4">
        <h2 className="auth-title">Iniciar Sesión</h2>
        <p className="auth-subtitle">Bienvenido de vuelta a Degader Social</p>
      </div>

      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="alert alert-danger mb-3">
            {errors.general}
          </div>
        )}

        <div className="form-group mb-3">
          <label htmlFor="correo" className="form-label">
            <Mail className="me-2" size={16} />
            Correo Electrónico
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

        <div className="form-group mb-4">
          <label htmlFor="contrasenia" className="form-label">
            <Lock className="me-2" size={16} />
            Contraseña
          </label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`form-control ${errors.contrasenia ? 'is-invalid' : ''}`}
              id="contrasenia"
              name="contrasenia"
              value={formData.contrasenia}
              onChange={handleChange}
              placeholder="Tu contraseña"
              autoComplete="current-password"
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

        <button
          type="submit"
          className="btn btn-primary w-100 auth-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="mb-0">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            className="btn-link"
            onClick={onSwitchToRegister}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
