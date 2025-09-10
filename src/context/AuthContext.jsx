// context/AuthContext.jsx - Contexto unificado
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// También exportamos useProfile para compatibilidad
export const useProfile = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useProfile debe usarse dentro de AuthProvider');
  }
  return {
    profile: context.user,
    loading: context.loading,
    error: context.error,
    setProfile: context.setUser,
    updateProfile: context.updateUser,
    clearProfile: context.logout,
    reloadProfile: context.reloadUser
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setLoading(false);
      setUser(null);
    }
  }, [token]);

  const validateToken = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔑 Token encontrado:', token ? 'SÍ' : 'NO');
      console.log('📡 Haciendo petición a:', 'http://localhost:3001/api/me');
      console.log('🔒 Con token:', token.substring(0, 20) + '...');

      const response = await fetch('http://localhost:3001/api/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Datos recibidos:', data);
        setUser(data.usuario || data);
      } else {
        console.error('❌ Error del servidor:', response.status);

        if (response.status === 401) {
          console.log('🔒 Token inválido, limpiando y redirigiendo');
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          return;
        }

        const errorData = await response.text();
        throw new Error(`Error ${response.status}: ${errorData}`);
      }
    } catch (error) {
      console.error('❌ Error en validateToken:', error);
      setError(error.message);

      if (error.message.includes('401') || error.message.includes('Token')) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (correo, contrasenia) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correoUsuario: correo,
          contraseniaUsuario: contrasenia
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.usuario);
        navigate('/feed');
        return { success: true };
      } else {
        return { success: false, error: data.error || data.message || 'Error en el login' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/usuarios/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          primernombreUsuario: userData.nombre,
          primerapellidoUsuario: userData.apellido,
          correoUsuario: userData.correo,
          contraseniaUsuario: userData.contrasenia,
          fechaNacimientoUsuario: userData.fechaNacimiento,
          paisUsuario: userData.pais,
          ciudadUsuario: userData.ciudad
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: 'Usuario registrado exitosamente' };
      } else {
        return { success: false, error: data.message || 'Error en el registro' };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const updateUser = (newUserData) => {
    setUser(prev => ({ ...prev, ...newUserData }));
  };

  const reloadUser = async () => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      setToken(currentToken);
    }
  };

  const value = {
    // AuthContext props
    user,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated: !!user,

    // ProfileContext props (para compatibilidad)
    profile: user,
    setUser,
    updateUser,
    reloadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
