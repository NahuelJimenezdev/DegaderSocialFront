# Configuración del Backend para Mensajes

## Estado Actual

El servicio de mensajes (`src/services/mensajes.service.js`) está configurado con **datos simulados** para desarrollo. Esto permite que la aplicación funcione sin un servidor backend.

## Para Conectar con Backend Real

### 1. Configurar Proxy en Vite

Agrega esto a tu `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Cambia al puerto de tu backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

### 2. Activar Código Real

En `src/services/mensajes.service.js`, descomenta todas las secciones marcadas con:

```javascript
/* Código original comentado - descomentar cuando el backend esté disponible
...
*/
```

### 3. Endpoints Requeridos

El backend debe tener estos endpoints:

#### GET `/api/mensajes/conversaciones`

- Headers: `Authorization: Bearer {token}`
- Response: `{ success: true, conversaciones: [...] }`

#### GET `/api/mensajes/{usuarioId}`

- Headers: `Authorization: Bearer {token}`
- Response: `{ success: true, mensajes: [...] }`

#### POST `/api/mensajes/{destinatarioId}`

- Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`
- Body: `{ contenido, tipo, archivoAdjunto? }`
- Response: `{ success: true, mensaje: {...} }`

#### PUT `/api/mensajes/{usuarioId}/leido`

- Headers: `Authorization: Bearer {token}`
- Response: `{ success: true }`

#### DELETE `/api/mensajes/{mensajeId}`

- Headers: `Authorization: Bearer {token}`
- Response: `{ success: true }`

#### GET `/api/usuarios/buscar?q={query}`

- Headers: `Authorization: Bearer {token}`
- Response: `{ success: true, usuarios: [...] }`

## Estructura de Datos

### Conversación

```javascript
{
  usuario: {
    _id: String,
    primernombreUsuario: String,
    primerapellidoUsuario: String,
    fotoPerfil: String,
    estadoUsuario: String
  },
  ultimoMensaje: {
    contenido: String,
    fechaEnvio: Date,
    estado: String
  },
  mensajesNoLeidos: Number
}
```

### Mensaje

```javascript
{
  _id: String,
  remitente: { _id, primernombreUsuario, primerapellidoUsuario, fotoPerfil },
  contenido: String,
  fechaEnvio: Date,
  estado: String,
  reacciones: [{ usuario, emoji, fecha }]
}
```

## Desarrollo Actual

- ✅ Funciona con datos simulados
- ✅ Incluye delays simulados de red
- ✅ Manejo de errores básico
- ✅ Preparado para WebSocket (socket.service.js)
- ✅ Reacciones y archivos preparados

## Próximos Pasos

1. Implementar servidor backend
2. Configurar base de datos MongoDB
3. Implementar autenticación JWT
4. Configurar WebSocket para tiempo real
5. Implementar subida de archivos</content>
   <parameter name="filePath">c:\Users\Nahuel Jiménez\Downloads\Degader\Degader_Social\BACKEND_SETUP.md
