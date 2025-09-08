// context/ProfileContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Para redirección automática

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile debe usarse dentro de ProfileProvider');
  }
  return context;
};

function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ Obtener navigate

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      console.log('🔑 Token encontrado:', token ? 'SÍ' : 'NO');

      if (!token) {
        console.log('❌ No hay token, redirigiendo a login');
        setLoading(false);
        navigate('/login');
        return;
      }

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
        setProfile(data.usuario || data);
      } else {
        const errorData = await response.text();
        console.error('❌ Error del servidor:', response.status, errorData);

        if (response.status === 401) {
          console.log('🔒 Token inválido, limpiando y redirigiendo');
          localStorage.removeItem("token");
          navigate('/login');
          return;
        }

        throw new Error(`Error ${response.status}: ${errorData}`);
      }
    } catch (error) {
      console.error('❌ Error en loadProfile:', error);
      setError(error.message);

      // Solo redirigir si es un error de autenticación
      if (error.message.includes('401') || error.message.includes('Token')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (newProfileData) => {
    setProfile(prev => ({ ...prev, ...newProfileData }));
  };

  const clearProfile = () => {
    setProfile(null);
    setLoading(false);
    localStorage.removeItem("token");
    navigate('/login'); // ✅ Redirigir a login al limpiar perfil
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{
      profile,
      loading,
      error,
      setProfile,
      updateProfile,
      clearProfile,
      reloadProfile: loadProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export default ProfileProvider;