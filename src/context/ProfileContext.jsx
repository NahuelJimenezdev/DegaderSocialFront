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
      if (!token) {
        setLoading(false);
        navigate('/login'); // ✅ Redirigir a login si no hay token
        return;
      }

      const response = await fetch('http://localhost:3001/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.usuario || data);
      } else {
        throw new Error('Error al cargar el perfil');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError(error.message);
      navigate('/login'); // ✅ Redirigir a login en caso de error
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