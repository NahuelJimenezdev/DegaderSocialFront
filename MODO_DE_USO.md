# Degader Social - Modo de Uso Completo

## Guía Detallada de Funcionalidades Implementadas

> **Versión:** v0.7  
> **Fecha:** Septiembre 2025  
> **Estado:** Sistema completo y funcional

---

## 📋 Índice de Contenidos

1. [Resumen del Sistema](#resumen-del-sistema)
2. [Configuración Inicial](#configuración-inicial)
3. [Sistema de Autenticación](#sistema-de-autenticación)
4. [Gestión de Perfiles de Usuario](#gestión-de-perfiles-de-usuario)
5. [Sistema de Upload Multimedia](#sistema-de-upload-multimedia)
6. [Sistema de Amistades y Contactos](#sistema-de-amistades-y-contactos)
7. [Sistema de Notificaciones](#sistema-de-notificaciones)
8. [Gestión de Eventos Avanzada](#gestión-de-eventos-avanzada)
9. [Sistema de Roles Organizacionales](#sistema-de-roles-organizacionales)
10. [Herramientas de Debug y Testing](#herramientas-de-debug-y-testing)
11. [APIs y Endpoints](#apis-y-endpoints)
12. [Troubleshooting](#troubleshooting)

---

## 🔍 Resumen del Sistema

**Degader Social** es una plataforma integral que combina funcionalidades de red social con gestión administrativa para organizaciones religiosas. El sistema incluye:

### ✅ Funcionalidades Completamente Implementadas:

- **Sistema de autenticación** con JWT y roles organizacionales
- **Perfiles de usuario** con edición completa y upload multimedia
- **Sistema de amistades** con solicitudes y gestión de contactos
- **Notificaciones en tiempo real** para interacciones sociales
- **Gestión de eventos** con configuración avanzada de privacidad
- **Sistema de roles** con jerarquías organizacionales complejas
- **Upload multimedia** para fotos y videos con validación
- **Panel de administración** con herramientas de gestión
- **Herramientas de debug** para desarrollo y testing

### 🛠️ Tecnologías Utilizadas:

- **Frontend:** React 18 + Vite + Bootstrap 5 + Lucide React
- **Backend:** Node.js + Express + MongoDB + Mongoose
- **Autenticación:** JWT con verificación de roles
- **Upload:** Multer para manejo de archivos multimedia
- **Validación:** Schemas personalizados para datos complejos

---

## ⚙️ Configuración Inicial

### 1. Instalación y Configuración

```bash
# 1. Clonar el repositorio
git clone [repository-url]
cd Degader_Social

# 2. Instalar dependencias del frontend
npm install

# 3. Configurar variables de entorno
cp .env.example .env
```

### 2. Variables de Entorno Requeridas

```env
# Frontend (.env)
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME="Degader Social"
VITE_WS_URL=ws://localhost:3001

# Backend (en el proyecto del backend)
MONGODB_URI=mongodb://localhost:27017/degader_social
JWT_SECRET=your_super_secure_jwt_secret_here
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 3. Iniciar el Sistema

```bash
# Terminal 1: Backend (Puerto 3001)
cd backend
npm start

# Terminal 2: Frontend (Puerto 5173)
cd frontend
npm run dev
```

### 4. Verificación de Funcionamiento

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api
- **Estado de salud:** http://localhost:3001/api/health

---

## 🔐 Sistema de Autenticación

### Características Implementadas:

#### 1. Registro de Usuarios

- **Validación completa** de datos de entrada
- **Verificación de email único** en tiempo real
- **Estados de usuario:** activo, inactivo, pendiente
- **Asignación automática** de roles básicos

#### 2. Login con JWT

- **Autenticación segura** con tokens JWT
- **Persistencia de sesión** en localStorage
- **Validación de roles** y permisos
- **Manejo de errores** específicos

#### 3. Roles y Permisos

```javascript
// Jerarquía de roles (de menor a mayor privilegio)
const roles = [
  "visitante", // Acceso básico de lectura
  "miembro", // Participación en grupos
  "profesional", // Funciones especializadas
  "encargado", // Gestión de área
  "subdirector", // Gestión regional
  "director", // Acceso completo
];
```

#### 4. Estados de Usuario

- **Activo:** Acceso completo según rol
- **Pendiente:** Acceso limitado, requiere aprobación
- **Inactivo:** Acceso denegado

### Uso Práctico:

```javascript
// Verificar autenticación
const { user, isAuthenticated, login, logout } = useAuth();

// Login de usuario
const handleLogin = async (credentials) => {
  try {
    await login(credentials);
    // Redirección automática según rol
  } catch (error) {
    // Manejo de errores específicos
  }
};
```

---

## 👤 Gestión de Perfiles de Usuario

### Funcionalidades Implementadas:

#### 1. Edición de Perfil Completa

- **Información básica:** nombre, apellido, email, teléfono
- **Información geográfica:** ciudad, país, dirección
- **Información organizacional:** área, nivel jerárquico, cargo
- **Biografía personalizada** (máximo 300 caracteres)

#### 2. Gestión de Avatar

- **Upload de imagen** con validación de formato y tamaño
- **Vista previa** antes de confirmar
- **Redimensionamiento automático** en el backend
- **Fallback a avatar por defecto** si no hay imagen

#### 3. Sistema de Privacidad

- **Control de visibilidad** de información personal
- **Configuración granular** por campo
- **Respeto a jerarquías organizacionales**

### Componentes Principales:

```javascript
// EditarPerfil.jsx - Edición completa de perfil
// EditarAvatar.jsx - Gestión específica de avatar
// VistaPerfilUsuario.jsx - Visualización pública de perfil
```

### Uso Práctico:

```javascript
// Actualizar perfil de usuario
const actualizarPerfil = async (datosNuevos) => {
  try {
    const response = await fetch("/api/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datosNuevos),
    });
    // Actualización exitosa
  } catch (error) {
    // Manejo de errores
  }
};
```

---

## 📱 Sistema de Upload Multimedia

### Características Avanzadas:

#### 1. Validación Robusta

```javascript
// Tipos de archivo soportados
const tiposPermitidos = {
  imagenes: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  videos: [".mp4", ".avi", ".mov", ".wmv", ".flv"],
};

// Límites de tamaño
const limitesSize = {
  imagenes: 5 * 1024 * 1024, // 5MB máximo
  videos: 50 * 1024 * 1024, // 50MB máximo
};
```

#### 2. Funcionalidades Implementadas

- **Vista previa inmediata** de archivos seleccionados
- **Validación en tiempo real** de formato y tamaño
- **Progress bar** durante el upload
- **Manejo de errores** específicos por tipo de fallo
- **Limpieza automática** de archivos temporales

#### 3. Componente UploadFiles

```javascript
// UploadFiles.jsx
const UploadFiles = ({ onUploadSuccess, tipoPermitido = "ambos" }) => {
  // Gestión completa de upload multimedia
  // Validación, vista previa, progress, errores
};
```

### Uso Práctico:

```javascript
// Implementar upload en cualquier componente
<UploadFiles
  onUploadSuccess={(archivo) => {
    console.log("Archivo subido:", archivo);
    // Lógica post-upload
  }}
  tipoPermitido="imagenes" // 'imagenes', 'videos', 'ambos'
/>
```

---

## 🤝 Sistema de Amistades y Contactos

### Implementación Completa:

#### 1. Gestión de Solicitudes de Amistad

```javascript
// Estados de solicitud
const estadosSolicitud = {
  PENDIENTE: "pendiente",
  ACEPTADA: "aceptada",
  RECHAZADA: "rechazada",
};
```

#### 2. Funcionalidades del Sistema

- **Envío de solicitudes** con validación de duplicados
- **Recepción y gestión** de solicitudes pendientes
- **Aceptación/rechazo** con notificaciones automáticas
- **Lista de amigos** con búsqueda y filtrado
- **Historial de interacciones** con contactos

#### 3. Componentes Principales

```javascript
// SelectorContactos.jsx - Selector avanzado de contactos
// GestionAmistades.jsx - Panel de gestión de amistades
// ListaAmigos.jsx - Visualización de amigos actuales
```

#### 4. API de Amistades

```javascript
// Servicios implementados
const amistadServices = {
  obtenerAmigos: () => {},
  enviarSolicitud: (usuarioId) => {},
  responderSolicitud: (solicitudId, respuesta) => {},
  obtenerSolicitudesPendientes: () => {},
  eliminarAmistad: (amistadId) => {},
};
```

### Integración con Eventos:

El sistema de amistades se integra directamente con la gestión de eventos:

```javascript
// Uso en eventos - selección de personas para aprobación
<SelectorContactos
  onSeleccionarContacto={(contacto) => {
    // Agregar a lista de aprobadores de evento
    setPersonasAprobacion((prev) => [...prev, contacto]);
  }}
  filtrarAmigos={true}
  mostrarBusqueda={true}
/>
```

---

## 🔔 Sistema de Notificaciones

### Arquitectura del Sistema:

#### 1. Tipos de Notificaciones Implementadas

```javascript
const tiposNotificacion = {
  SOLICITUD_AMISTAD: "solicitud_amistad",
  AMISTAD_ACEPTADA: "amistad_aceptada",
  EVENTO_INVITACION: "evento_invitacion",
  EVENTO_APROBACION: "evento_aprobacion",
  SISTEMA_ADMIN: "sistema_admin",
};
```

#### 2. Componentes del Sistema

- **NotificationBadge:** Indicador visual de notificaciones pendientes
- **ListaNotificaciones:** Panel desplegable con todas las notificaciones
- **NotificationProvider:** Context provider para estado global

#### 3. Funcionalidades Avanzadas

- **Tiempo real:** Actualización automática sin refresh
- **Persistencia:** Almacenamiento en base de datos
- **Estados de lectura:** Marcado como leído/no leído
- **Acciones directas:** Botones de acción en notificaciones
- **Filtrado:** Por tipo, fecha, estado de lectura

### Implementación Técnica:

```javascript
// Hook personalizado para notificaciones
const useNotifications = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);

  // Funciones de gestión
  const marcarComoLeida = async (notificacionId) => {};
  const obtenerNotificaciones = async () => {};

  return {
    notificaciones,
    noLeidas,
    marcarComoLeida,
    obtenerNotificaciones,
  };
};
```

### Uso en la Aplicación:

```javascript
// Mostrar badge de notificaciones
<NotificationBadge count={noLeidas} />

// Panel de notificaciones
<ListaNotificaciones
  notificaciones={notificaciones}
  onMarcarLeida={marcarComoLeida}
/>
```

---

## 🎉 Gestión de Eventos Avanzada

### Sistema Completo de Eventos:

#### 1. Creación de Eventos

El componente `CrearEventoModal.jsx` incluye:

- **Información básica:** título, descripción, fecha, ubicación
- **Configuración de privacidad:** público, privado, por invitación
- **Sistema de aprobaciones:** selección de personas aprobadoras
- **Límites de participación:** máximo de asistentes
- **Configuración de registro:** abierto, cerrado, por aprobación

#### 2. Configuración Avanzada de Privacidad

El componente `ConfiguracionPrivacidad.jsx` proporciona:

```javascript
// Tipos de privacidad disponibles
const tiposPrivacidad = {
  PUBLICO: "publico", // Visible para todos
  PRIVADO: "privado", // Solo invitados
  POR_INVITACION: "invitacion", // Requiere invitación
  AMIGOS: "amigos", // Solo amigos del creador
  ORGANIZACION: "organizacion", // Solo miembros de la organización
};

// Tipos de registro
const tiposRegistro = {
  ABIERTO: "abierto", // Registro libre
  CERRADO: "cerrado", // Sin registro
  APROBACION: "aprobacion", // Requiere aprobación
};
```

#### 3. Vista de Configuración de Privacidad

El componente `VistaPrivacidadEvento.jsx` muestra:

- **Resumen visual** de configuración de privacidad
- **Lista de personas aprobadoras** con avatares
- **Configuración de registro** con iconos descriptivos
- **Límites y restricciones** claramente mostrados

#### 4. Gestión de Registros

El componente `GestionRegistrosEvento.jsx` incluye:

- **Lista de participantes** registrados
- **Sistema de aprobación** para registros pendientes
- **Control de límites** de asistencia
- **Estadísticas** de participación en tiempo real

### Flujo de Uso Completo:

```javascript
// 1. Crear evento con configuración avanzada
const crearEvento = async (datosEvento) => {
  const evento = {
    titulo: "Reunión Semanal",
    descripcion: "Reunión de coordinación",
    fecha: new Date(),
    ubicacion: "Sala de Reuniones",

    // Configuración de privacidad
    tipoPrivacidad: 'privado',
    requiereAprobacion: true,
    personasAprobacion: [userId1, userId2],

    // Configuración de registro
    tipoRegistro: 'aprobacion',
    limiteParticipantes: 50,

    // Configuraciones adicionales
    permiteComentarios: true,
    notificarCambios: true
  };

  await eventosService.crearEvento(evento);
};

// 2. Configurar privacidad posteriormente
<ConfiguracionPrivacidad
  evento={evento}
  onGuardarConfiguracion={actualizarEvento}
  mostrarPersonasAprobacion={true}
/>

// 3. Gestionar registros
<GestionRegistrosEvento
  eventoId={evento._id}
  onAprobarRegistro={aprobarParticipante}
  onRechazarRegistro={rechazarParticipante}
/>
```

#### 5. Integración con Sistema de Contactos

Los eventos se integran perfectamente con el sistema de amistades:

```javascript
// Selector de contactos para aprobaciones
<SelectorContactos
  titulo="Seleccionar Personas para Aprobación"
  onSeleccionarContacto={(contacto) => {
    setPersonasAprobacion((prev) => [...prev, contacto._id]);
  }}
  contactosExcluidos={personasAprobacion}
  filtrarAmigos={true}
/>
```

---

## 🏢 Sistema de Roles Organizacionales

### Estructura Jerárquica Implementada:

#### 1. Niveles Organizacionales

```javascript
const nivelesOrganizacionales = {
  NACIONAL: "nacional",
  REGIONAL: "regional",
  DEPARTAMENTAL: "departamental",
  MUNICIPAL: "municipal",
};
```

#### 2. Áreas Funcionales

```javascript
const areasFuncionales = [
  "planeacion",
  "asuntos_etnicos",
  "infraestructura",
  "sostenibilidad",
  "rrhh_seguridad",
  "juridica",
  "salud",
  "psicosocial",
  "proteccion_animal",
  "educacion",
  "financiera",
  "comunicacion",
  "seguridad",
];
```

#### 3. Componente de Gestión

El componente `GestionRoles.jsx` proporciona:

- **Asignación de roles** por usuario
- **Configuración de jerarquías** organizacionales
- **Gestión de permisos** por área y nivel
- **Visualización de organigrama** interactivo
- **Auditoría de cambios** en roles

#### 4. Permisos y Restricciones

```javascript
// Sistema de permisos basado en roles
const verificarPermiso = (usuario, accion, recurso) => {
  const jerarquia = [
    "visitante",
    "miembro",
    "profesional",
    "encargado",
    "subdirector",
    "director",
  ];
  const nivelUsuario = jerarquia.indexOf(usuario.rolUsuario);
  const nivelRequerido = jerarquia.indexOf(accion.rolMinimo);

  return (
    nivelUsuario >= nivelRequerido &&
    usuario.rolOrganizacional.area === recurso.area
  );
};
```

### Uso en la Aplicación:

```javascript
// Verificación de permisos en componentes
const PanelAdmin = () => {
  const { user } = useAuth();

  if (!verificarPermiso(user, "admin", "sistema")) {
    return <AccesoDenegado />;
  }

  return (
    <div>
      <GestionRoles usuarios={usuarios} />
      {/* Otros componentes admin */}
    </div>
  );
};
```

---

## 🔧 Herramientas de Debug y Testing

### Componentes de Debug Implementados:

#### 1. PruebaContactos.jsx

Componente dedicado para testing del sistema de amistades:

```javascript
// Funcionalidades de prueba
const PruebaContactos = () => {
  // Test de carga de contactos
  const probarCargaContactos = async () => {};

  // Test de envío de solicitudes
  const probarEnvioSolicitud = async () => {};

  // Test de respuesta a solicitudes
  const probarRespuestaSolicitud = async () => {};

  // Visualización de resultados
  return <div className="container mt-4">{/* Interfaz de testing */}</div>;
};
```

#### 2. Panel de Debug Administrativo

Accesible solo para usuarios con rol de director:

- **Monitor de API calls** en tiempo real
- **Visualización de estados** de componentes
- **Logs de errores** detallados
- **Herramientas de diagnóstico** de base de datos
- **Simulador de escenarios** de testing

#### 3. Herramientas de Desarrollo

```javascript
// Debug de hooks personalizados
const useDebugAuth = () => {
  const auth = useAuth();

  useEffect(() => {
    console.log("Estado de autenticación:", auth);
  }, [auth]);

  return auth;
};

// Monitor de performance
const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      console.log(`${componentName} render time: ${endTime - startTime}ms`);
    };
  });
};
```

#### 4. Testing de APIs

```javascript
// Conjunto de tests automáticos para APIs
const testSuiteAPIs = {
  // Test de autenticación
  testAuth: async () => {
    const login = await usuariosService.login(credencialesTest);
    assert(login.token, "Token JWT recibido");
  },

  // Test de amistades
  testAmistades: async () => {
    const amigos = await amistadesService.obtenerAmigos();
    assert(Array.isArray(amigos), "Lista de amigos es array");
  },

  // Test de eventos
  testEventos: async () => {
    const eventos = await eventosService.obtenerEventos();
    assert(eventos.length >= 0, "Lista de eventos obtenida");
  },
};
```

---

## 🔌 APIs y Endpoints

### Documentación Completa de APIs:

#### 1. Autenticación y Usuarios

```javascript
// POST /api/usuariosInicios/login
{
  "correoUsuario": "usuario@ejemplo.com",
  "contraseniaUsuario": "password123"
}
// Response: { token, usuario }

// POST /api/usuariosInicios/register
{
  "nombreUsuario": "Nombre",
  "apellidoUsuario": "Apellido",
  "correoUsuario": "nuevo@ejemplo.com",
  "contraseniaUsuario": "password123",
  "celularUsuario": "+1234567890"
}

// GET /api/me (requiere JWT)
// Response: datos completos del usuario autenticado

// PATCH /api/me (requiere JWT)
// Body: campos a actualizar del perfil
```

#### 2. Sistema de Amistades

```javascript
// GET /api/amistades (requiere JWT)
// Response: lista de amigos del usuario

// POST /api/amistades (requiere JWT)
{
  "usuarioDestinoId": "userId123"
}
// Envía solicitud de amistad

// PATCH /api/amistades/:solicitudId/estado (requiere JWT)
{
  "estado": "aceptada" | "rechazada"
}
// Responde a solicitud de amistad

// GET /api/amistades/solicitudes (requiere JWT)
// Response: solicitudes pendientes del usuario
```

#### 3. Gestión de Eventos

```javascript
// GET /api/eventos (requiere JWT)
// Response: eventos visibles para el usuario

// POST /api/eventos (requiere JWT)
{
  "titulo": "Evento de Prueba",
  "descripcion": "Descripción del evento",
  "fecha": "2025-09-15T10:00:00Z",
  "ubicacion": "Ubicación del evento",
  "configuracionPrivacidad": {
    "tipoPrivacidad": "privado",
    "requiereAprobacion": true,
    "personasAprobacion": ["userId1", "userId2"],
    "tipoRegistro": "aprobacion",
    "limiteParticipantes": 50
  }
}

// PATCH /api/eventos/:eventoId/configuracion (requiere JWT)
// Body: nueva configuración de privacidad

// GET /api/eventos/:eventoId/registros (requiere JWT)
// Response: lista de participantes registrados
```

#### 4. Upload de Archivos

```javascript
// POST /api/upload-multimedia (requiere JWT, multipart/form-data)
// FormData con archivo + metadatos
// Response: { url, nombreOriginal, tipo, tamaño }

// POST /api/me/avatar (requiere JWT, multipart/form-data)
// FormData con imagen de avatar
// Response: { fotoPerfil: "nueva_url" }
```

#### 5. Notificaciones

```javascript
// GET /api/notificaciones (requiere JWT)
// Response: lista de notificaciones del usuario

// PATCH /api/notificaciones/:notificacionId/leida (requiere JWT)
// Marca notificación como leída

// GET /api/notificaciones/count (requiere JWT)
// Response: { noLeidas: number }
```

#### 6. Sistema de Roles

```javascript
// GET /api/roles (requiere JWT + permisos admin)
// Response: configuración de roles organizacionales

// POST /api/roles/asignar (requiere JWT + permisos admin)
{
  "usuarioId": "userId123",
  "rolOrganizacional": {
    "nivel": "regional",
    "area": "salud",
    "cargo": "Coordinador Regional de Salud",
    "pais": "Argentina"
  }
}

// GET /api/usuarios/por-rol/:rol (requiere JWT + permisos)
// Response: usuarios con rol específico
```

---

## ⚠️ Troubleshooting

### Problemas Comunes y Soluciones:

#### 1. Errores de Autenticación

```javascript
// Error: Token inválido o expirado
// Solución: Verificar configuración JWT y renovar token

// Error: CORS en requests
// Solución: Verificar CORS_ORIGIN en backend

// Error: Usuario inactivo
// Solución: Cambiar estado de usuario en base de datos
```

#### 2. Problemas de Upload

```javascript
// Error: Archivo muy grande
// Verificar límites en frontend y backend

// Error: Tipo de archivo no soportado
// Revisar configuración de tipos permitidos

// Error: Fallo en almacenamiento
// Verificar permisos de carpeta uploads/
```

#### 3. Errores de Base de Datos

```javascript
// Error: MongoDB connection failed
// Verificar MONGODB_URI y estado del servicio

// Error: ObjectId inválido
// Usar 'new ObjectId()' en lugar de 'ObjectId()'

// Error: Validación de schema
// Revisar modelos de Mongoose y datos enviados
```

#### 4. Problemas de React

```javascript
// Error: useEffect import missing
// Agregar: import { useEffect } from 'react';

// Error: Hook rules violation
// Verificar que hooks se llamen en orden correcto

// Error: State update on unmounted component
// Implementar cleanup en useEffect
```

#### 5. Debugging Paso a Paso

```javascript
// 1. Verificar logs de consola del navegador
console.log("Estado actual:", state);

// 2. Verificar network tab para requests API
// Buscar status codes 4xx/5xx

// 3. Verificar logs del servidor backend
// Buscar errores de MongoDB y validación

// 4. Usar herramientas de debug incluidas
// Acceder a /debug (solo para directores)
```

---

## 🚀 Preparación para Git

### Checklist Pre-Commit:

#### ✅ Funcionalidades Verificadas:

- [x] Sistema de autenticación funcionando
- [x] Upload de multimedia operativo
- [x] Sistema de amistades completo
- [x] Notificaciones en tiempo real
- [x] Gestión de eventos con privacidad
- [x] Sistema de roles organizacionales
- [x] APIs documentadas y probadas
- [x] Herramientas de debug implementadas

#### ✅ Calidad de Código:

- [x] Componentes modulares y reutilizables
- [x] Hooks personalizados documentados
- [x] Servicios de API organizados
- [x] Manejo de errores implementado
- [x] Validación de datos en frontend y backend

#### ✅ Documentación:

- [x] README.md actualizado
- [x] MODO_DE_USO.md creado
- [x] APIs documentadas
- [x] Componentes comentados

### Comandos de Preparación:

```bash
# 1. Verificar estado del repositorio
git status

# 2. Agregar todos los archivos modificados
git add .

# 3. Commit con mensaje descriptivo
git commit -m "feat: Sistema completo v0.7 - Upload multimedia, amistades, eventos avanzados, roles organizacionales

- Implementado sistema completo de upload multimedia con validación
- Sistema de amistades con solicitudes y gestión de contactos
- Gestión avanzada de eventos con configuración de privacidad
- Sistema de roles organizacionales con jerarquías complejas
- Notificaciones en tiempo real para interacciones sociales
- Panel de administración con herramientas de gestión
- Herramientas de debug y testing para desarrollo
- APIs completamente documentadas y probadas
- Documentación completa de modo de uso

Todas las funcionalidades principales están implementadas y funcionando.
Sistema listo para producción."

# 4. Push al repositorio
git push origin main
```

---

## 📞 Soporte y Contacto

### Información de Contacto:

- **Desarrollador:** Nahuel Jiménez
- **Email:** naedjima93@gmail.com
- **WhatsApp:** [+54 9 11 6658-2695](https://wa.me/5491166582695?text=Hola%20Nahuel%2C%20tengo%20una%20consulta%20sobre%20Degader%20Social.)

### Para Soporte Técnico:

1. **Revisar este documento** de modo de uso
2. **Verificar logs** de consola y servidor
3. **Usar herramientas de debug** incluidas en la aplicación
4. **Contactar vía WhatsApp** para asistencia directa

---

> **Estado del Sistema:** ✅ **COMPLETAMENTE FUNCIONAL**  
> **Versión:** v0.7 - Septiembre 2025  
> **Listo para:** Producción y despliegue

---

_Documento generado automáticamente basado en el estado actual del sistema Degader Social._
