# Sistema de Notificaciones - Degader Social

## 📋 Descripción

Sistema completo de notificaciones para la plataforma social de la Fundación Humanitaria Sol y Luna, con enfoque especial en solicitudes de amistad y gestión de notificaciones.

## 🚀 Características

### 🔔 Campana de Notificaciones (NotificacionesBell)

- **Contador en tiempo real** de notificaciones no leídas
- **Dropdown interactivo** con las últimas 5 notificaciones
- **Marca automática** como leídas al hacer clic
- **Animaciones y efectos visuales** profesionales
- **Responsive** para móviles y escritorio

### 👥 Solicitudes de Amistad

- **Botones de aceptar/rechazar** directamente en las notificaciones
- **Vista previa del perfil** del remitente
- **Información contextual** (cargo, ubicación)
- **Manejo de estados** (pendiente, aceptada, rechazada)

### 📊 Página de Historial (SolicitudesPendientes)

- **Vista completa** de todas las solicitudes de amistad
- **Filtros por estado** (todas, pendientes, aceptadas, rechazadas)
- **Búsqueda por nombre** de usuario
- **Tabla organizada** con información detallada
- **Acciones en lote** para gestión eficiente

### 🔍 Modal de Notificaciones Completas

- **Vista ampliada** de todas las notificaciones
- **Filtros avanzados** por tipo y estado
- **Búsqueda en tiempo real**
- **Gestión de solicitudes** dentro del modal
- **Diseño modal responsivo**

### 📈 Resumen de Actividades

- **Dashboard de actividades** pendientes
- **Contadores por categoría** (solicitudes, mensajes, reuniones)
- **Navegación rápida** a cada sección
- **Vista de resumen** para administradores

## 🛠️ Tecnologías Utilizadas

- **React 18** con Hooks
- **Bootstrap 5** para estilos
- **Lucide React** para iconos
- **React Router** para navegación
- **CSS personalizado** para animaciones

## 📁 Estructura de Archivos

```
src/
├── components/
│   ├── notificacionesBell/
│   │   ├── NotificacionesBell.jsx           # Componente principal de la campana
│   │   ├── SolicitudAmistad.jsx             # Componente para solicitudes individuales
│   │   ├── NotificacionSolicitudAmistad.jsx # Versión extendida de solicitudes
│   │   ├── ModalNotificaciones.jsx          # Modal completo de notificaciones
│   │   └── ResumenNotificaciones.jsx        # Widget de resumen
│   ├── solicitudesPendientes/
│   │   └── SolicitudesPendientes.jsx        # Página de historial completo
│   └── layout/
│       ├── Navbar.jsx                       # Barra de navegación integrada
│       └── Sidebar.jsx                      # Menú lateral con enlace
├── pages/
│   └── [otras páginas...]
├── App.jsx                                  # Rutas principales
├── App.css                                  # Estilos personalizados
└── main.jsx                                 # Punto de entrada
```

## 🎨 Diseño y UX

### Principios de Diseño

- **Consistencia visual** con el resto de la plataforma
- **Accesibilidad** con contraste adecuado y navegación por teclado
- **Feedback inmediato** para todas las acciones del usuario
- **Diseño responsive** que funciona en todos los dispositivos

### Colores y Estados

- 🔵 **Azul** - Notificaciones no leídas y enlaces principales
- 🟢 **Verde** - Acciones positivas (aceptar)
- 🔴 **Rojo** - Acciones negativas (rechazar)
- 🟡 **Amarillo** - Estados pendientes
- ⚪ **Gris** - Estados neutros e información secundaria

## 🔧 Configuración e Instalación

### Prerrequisitos

- Node.js 16+
- React 18+
- Bootstrap 5

### Instalación

```bash
# Ya está integrado en el proyecto existente
# Solo asegúrate de que las dependencias estén instaladas
npm install
```

### Uso

```jsx
// En tu Navbar.jsx
import NotificacionesBell from "./NotificacionesBell";

// En tu App.jsx
import SolicitudesPendientes from "./components/solicitudesPendientes/SolicitudesPendientes";
```

## 🔗 Integración con Backend

### Endpoints Requeridos

```javascript
// Notificaciones
GET    /api/notificaciones/contador      // Obtener contador de no leídas
GET    /api/notificaciones               // Obtener todas las notificaciones
PATCH  /api/notificaciones/:id/leer      // Marcar como leída
PATCH  /api/notificaciones/leer-todas    // Marcar todas como leídas

// Solicitudes de amistad
GET    /api/amigos/solicitudes           // Obtener solicitudes pendientes
POST   /api/amigos/aceptar/:id           // Aceptar solicitud
POST   /api/amigos/rechazar/:id          // Rechazar solicitud
```

### Estructura de Datos

```javascript
// Notificación
{
  _id: string,
  mensaje: string,
  leida: boolean,
  createdAt: string,
  tipo: 'solicitud_amistad' | 'amistad_aceptada' | 'comentario' | 'mensaje' | 'reunion',
  remitenteId?: string,
  remitente?: {
    primernombreUsuario: string,
    primerapellidoUsuario: string,
    fotoPerfil: string,
    cargoFundacion: string,
    pais?: string,
    ciudad?: string
  }
}
```

## 🧪 Datos de Prueba

El sistema incluye datos de prueba realistas para desarrollo y testing:

- Solicitudes de amistad de diferentes usuarios
- Notificaciones de varios tipos
- Estados variados (leída/no leída, pendiente/aceptada/rechazada)

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px - Dropdown de ancho completo
- **Tablet**: 768px - 1024px - Dropdown optimizado
- **Desktop**: > 1024px - Experiencia completa

### Adaptaciones Móviles

- Dropdowns de ancho completo en móviles
- Botones más grandes para touch
- Texto legible en pantallas pequeñas
- Modal optimizado para móviles

## ⚡ Optimizaciones

### Performance

- **Polling inteligente** cada 30 segundos para nuevas notificaciones
- **Lazy loading** del modal de notificaciones
- **Gestión eficiente del estado** con React Hooks
- **Minimización de re-renders** innecesarios

### UX

- **Cierre automático** del dropdown al hacer clic fuera
- **Animaciones suaves** para transiciones
- **Feedback visual** inmediato para todas las acciones
- **Estados de carga** para operaciones asíncronas

## 🔮 Futuras Mejoras

- [ ] **Push notifications** del navegador
- [ ] **WebSocket** para notificaciones en tiempo real
- [ ] **Filtros avanzados** por fecha y usuario
- [ ] **Archivado** de notificaciones antiguas
- [ ] **Configuración de preferencias** de notificaciones
- [ ] **Notificaciones por email** opcionales
- [ ] **Analytics** de interacción con notificaciones

## 🤝 Contribución

Para contribuir al sistema de notificaciones:

1. Mantén la consistencia con el diseño existente
2. Incluye tests para nuevas funcionalidades
3. Documenta los cambios realizados
4. Sigue las convenciones de naming establecidas

## 📧 Soporte

Para dudas o problemas con el sistema de notificaciones, contacta al equipo de desarrollo.

---

_Sistema desarrollado para la Fundación Humanitaria Sol y Luna - Degader Social Platform_
