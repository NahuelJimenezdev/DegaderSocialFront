# Solución para Problemas de Carga de Imágenes

## Problema Identificado

El problema principal estaba en el archivo `src/lib/api.js` donde la función `apiFetch` estaba forzando el `Content-Type` a `application/json` incluso cuando se enviaban archivos (FormData). Esto impedía que la carga de imágenes funcionara correctamente.

**PROBLEMA ADICIONAL RESUELTO**: Error de importación de `buildApiUrl` - la función ahora se importa desde `config.js`.

## Cambios Realizados

### 1. Archivo `src/lib/api.js`

- **Problema**: Se forzaba `Content-Type: application/json` para todas las peticiones
- **Solución**: Solo se establece `Content-Type: application/json` cuando NO se envía FormData
- **Mejora**: Mejor manejo de errores y respuestas no-JSON

### 2. Archivo `src/lib/config.js` (NUEVO)

- **Propósito**: Centralizar la configuración del backend
- **Beneficios**:
  - URLs configurables en un solo lugar
  - Constantes para tipos de archivo permitidos
  - Límites de tamaño configurables
  - Fácil cambio de servidor de desarrollo a producción
  - **Función `buildApiUrl` exportada desde aquí**

### 3. Componente `src/components/profile/EditAvatar.jsx`

- **Mejora**: Uso de configuración centralizada
- **Mejora**: Mejor manejo de errores con mensajes específicos
- **Mejora**: Logs de debug para diagnóstico
- **Corrección**: Importación de `buildApiUrl` desde `config.js`

### 4. Componente `src/components/profile/ImageUploadTest.jsx` (NUEVO)

- **Propósito**: Componente de prueba para diagnosticar problemas
- **Funcionalidades**:
  - Prueba de conexión al servidor
  - Prueba de carga de imágenes
  - Información de debug
  - Visualización de errores detallados

## Cómo Usar

### 1. Verificar la Configuración

El archivo `src/lib/config.js` contiene todas las configuraciones:

```javascript
export const API_CONFIG = {
  BASE_URL: "http://localhost:3001", // Cambiar aquí si es necesario
  UPLOAD: {
    MAX_SIZE_MB: 10, // Tamaño máximo de archivo
    ALLOWED_TYPES: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ],
  },
};

// Función helper para construir URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
```

### 2. Probar la Funcionalidad

1. Ve a tu perfil de usuario (`/perfilUser`)
2. Al final de la página verás el componente "Prueba de Carga de Imágenes"
3. Usa "Probar Conexión" para verificar que el servidor esté funcionando
4. Selecciona una imagen y usa "Subir Imagen" para probar la carga

### 3. Verificar en la Consola del Navegador

- Abre las herramientas de desarrollador (F12)
- Ve a la pestaña "Console"
- Los logs mostrarán información detallada sobre la carga

## Posibles Problemas y Soluciones

### Error 413 (Payload Too Large)

- **Causa**: La imagen es demasiado grande
- **Solución**: El componente automáticamente comprime la imagen a WebP
- **Configuración**: Ajusta `MAX_SIZE_MB` en `config.js` si es necesario

### Error 401 (Unauthorized)

- **Causa**: Token de autenticación expirado o inválido
- **Solución**: Cierra sesión y vuelve a iniciar sesión

### Error de Conexión

- **Causa**: El servidor backend no está funcionando
- **Solución**: Verifica que el servidor en `localhost:3001` esté ejecutándose

### Error 500 (Internal Server Error)

- **Causa**: Error en el servidor backend
- **Solución**: Revisa los logs del servidor backend

### Error de Importación (buildApiUrl)

- **Causa**: Función no exportada correctamente
- **Solución**: ✅ **RESUELTO** - La función ahora se importa desde `config.js`

## Verificación del Backend

Asegúrate de que tu servidor backend tenga:

1. **Endpoint configurado**: `/api/me/avatar`
2. **Middleware de archivos**: Como `multer` para Node.js
3. **CORS configurado**: Para permitir peticiones desde el frontend
4. **Límite de tamaño**: Configurado para aceptar archivos de hasta 10MB

## Ejemplo de Endpoint Backend (Node.js + Express)

```javascript
const multer = require("multer");
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"));
    }
  },
});

app.post("/api/me/avatar", upload.single("avatar"), (req, res) => {
  // Procesar la imagen subida
  // Guardar en el sistema de archivos o base de datos
  // Devolver respuesta con datos del usuario actualizado
});
```

## Estructura de Archivos Corregida

```
src/
├── lib/
│   ├── api.js          # Solo exporta apiFetch
│   └── config.js       # Exporta API_CONFIG y buildApiUrl
├── components/
│   └── profile/
│       ├── EditAvatar.jsx      # Importa buildApiUrl desde config.js
│       └── ImageUploadTest.jsx # Importa buildApiUrl desde config.js
└── pages/
    └── PerfilUser.jsx  # Usa los componentes corregidos
```

## Próximos Pasos

1. **Prueba la funcionalidad** usando el componente de prueba
2. **Verifica los logs** en la consola del navegador
3. **Revisa el backend** si persisten los errores
4. **Ajusta la configuración** según tus necesidades

## Contacto

Si persisten los problemas, revisa:

- Logs del servidor backend
- Consola del navegador
- Network tab en las herramientas de desarrollador
- Configuración de CORS en el backend
- **Verifica que no haya errores de importación en la consola**
