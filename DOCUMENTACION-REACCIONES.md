# 🎭 Documentación: Sistema de Reacciones a Comentarios

## 🎯 Funcionalidades Implementadas

### ✅ **Tipos de Reacciones**

- **👍 Me gusta** - Botón azul, indica aprobación
- **❤️ Me encanta** - Botón rojo, para contenido que emociona
- **👀 Visto** - Botón gris, marca como leído/visto
- **👎 No me gusta** - Botón gris, para desaprobación

### ✅ **Componente ReactionButton**

```jsx
<ReactionButton
  reactions={{ like: 5, love: 2, seen: 1, dislike: 0 }}
  userReaction="like"
  onReact={(type, commentId, publicationId) => void}
  commentId="123"
  publicacionId="456"
  size="sm|md|lg"
  showLabels={true|false}
/>
```

## 🏗️ Arquitectura

### 📁 **Estructura de Archivos**

```
src/components/reactions/
├── index.js              # Exportaciones
└── ReactionButton.jsx    # Componente principal
```

### 🗄️ **Modelo de Datos (Backend)**

```javascript
comentarios: [
  {
    autor: ObjectId,
    texto: String,
    imagenes: [Object],
    videos: [Object],
    reacciones: {
      like: [ObjectId], // Array de IDs de usuarios
      love: [ObjectId],
      seen: [ObjectId],
      dislike: [ObjectId],
    },
    fecha: Date,
  },
];
```

### 🔗 **API Endpoints**

```
POST /api/publicaciones/:id/comentarios/:comentarioId/reacciones
Body: { reactionType: "like|love|seen|dislike" }
Headers: { Authorization: "Bearer <token>" }
```

## 🎨 **Características del UI**

### 🎭 **Estados del Botón**

1. **Sin reacción**: Muestra 👍 genérico
2. **Con reacción**: Muestra emoji específico + color
3. **Hover**: Panel flotante con todas las opciones
4. **Loading**: Spinner durante procesamiento

### 🎪 **Panel de Reacciones**

- **Flotante**: Aparece al hacer hover/click
- **Organizado**: 4 reacciones en fila horizontal
- **Contadores**: Muestra número de cada reacción
- **Responsive**: Se adapta a diferentes pantallas

### 🎨 **Colores y Estilos**

- **Me gusta**: Azul primario (#0d6efd)
- **Me encanta**: Rojo (#dc3545)
- **Visto**: Gris (#6c757d)
- **No me gusta**: Gris (#6c757d)

## 🔄 **Flujo de Funcionamiento**

### 1. **Usuario Hace Click**

```javascript
// En el componente ReactionButton
handleReaction(reactionType) → onReact(type, commentId, publicationId)
```

### 2. **Frontend Procesa**

```javascript
// En PerfilUser.jsx
handleReaccionComentario(type, commentId, publicationId) → API call
```

### 3. **Backend Procesa**

```javascript
// En publicaciones.controller.js
reaccionarComentario() → Toggle reaction → Update DB → Return data
```

### 4. **Frontend Actualiza**

```javascript
// Actualiza estado local
setPublicaciones(prev => /* nueva data */)
```

## 🧪 **Casos de Uso**

### ✅ **Reacción Nueva**

- Usuario no había reaccionado
- Se agrega su ID al array correspondiente
- Contador aumenta en 1

### ✅ **Cambio de Reacción**

- Usuario tenía reacción A, selecciona B
- Se remueve de array A, se agrega a array B
- Contadores se actualizan

### ✅ **Quitar Reacción (Toggle)**

- Usuario selecciona la misma reacción
- Se remueve su ID del array
- Contador disminuye en 1

### ✅ **Múltiples Usuarios**

- Cada usuario puede tener máximo 1 reacción por comentario
- Se muestran totales por tipo de reacción
- Interface actualiza en tiempo real

## 🎪 **Características Avanzadas**

### 🎭 **Integración Completa**

- **Multimedia**: Funciona con comentarios de texto, imagen y video
- **Reutilizable**: Se puede usar en cualquier componente
- **Escalable**: Fácil agregar nuevos tipos de reacción

### 🔒 **Validaciones**

- **Autenticación**: Requiere token válido
- **Tipos válidos**: Solo acepta reacciones permitidas
- **Permisos**: Solo usuarios autenticados pueden reaccionar

### ⚡ **Performance**

- **Optimistic UI**: Actualización inmediata en frontend
- **Error handling**: Rollback si falla la API
- **Loading states**: Feedback visual durante procesamiento

## 🧪 **Cómo Probar**

### 1. **Prueba Básica**

1. Ve a http://localhost:5174/
2. Busca un comentario
3. Haz click en el botón de reacciones
4. Selecciona una reacción
5. Verifica que el contador aumenta

### 2. **Prueba de Toggle**

1. Selecciona una reacción
2. Vuelve a hacer click en la misma
3. Verifica que se quita la reacción

### 3. **Prueba de Cambio**

1. Selecciona "Me gusta"
2. Cambia a "Me encanta"
3. Verifica que solo queda la nueva reacción

### 4. **Prueba Multi-usuario**

1. Abre otra ventana/navegador
2. Inicia con otro usuario
3. Reacciona al mismo comentario
4. Verifica contadores independientes

## 🔧 **Configuración**

### 📝 **Agregar Nuevas Reacciones**

Para agregar nuevos tipos de reacción:

1. **En ReactionButton.jsx**:

```javascript
const REACTIONS = {
  // ... existentes
  surprised: {
    icon: Surprise,
    label: "Sorprendido",
    emoji: "😮",
    color: "#ffc107",
  },
};
```

2. **En el modelo backend**:

```javascript
reacciones: {
  // ... existentes
  surprised: [{ type: Schema.Types.ObjectId, ref: "usuariosInicios" }];
}
```

3. **En el controlador**:

```javascript
const validReactions = ["like", "love", "seen", "dislike", "surprised"];
```

### 🎨 **Personalizar Estilos**

- Cambiar colores en el objeto `REACTIONS`
- Modificar tamaños con prop `size`
- Toggle labels con prop `showLabels`

## 🚀 **Extensiones Futuras**

### 🎯 **Próximas Funcionalidades**

- **Reacciones a publicaciones principales**
- **Notificaciones de reacciones**
- **Analytics de reacciones más populares**
- **Reacciones anónimas/privadas**

### 🎪 **Mejoras de UI**

- **Animaciones de transición**
- **Efectos de partículas**
- **Sonidos de feedback**
- **Temas personalizables**

---

**✅ Estado**: Completamente funcional
**🎯 Uso**: Integrado en comentarios de PerfilUser.jsx
**🔄 Escalabilidad**: Componente reutilizable para toda la app
