// Configuración del backend
export const API_CONFIG = {
  // URL base del backend
  BASE_URL: "http://localhost:3001",

  // Endpoints de la API
  ENDPOINTS: {
    LOGIN: "/api/usuariosInicios/login",
    ME: "/api/me",
    AVATAR: "/api/me/avatar",
    USER: "/api/usuariosInicios/",
  },

  // Configuración de archivos
  UPLOAD: {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024,
    ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"],
    MAX_SIDE_PX: 1024,
  },

  // Configuración de autenticación
  AUTH: {
    TOKEN_KEY: "token",
    TOKEN_PREFIX: "Bearer",
  }
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
