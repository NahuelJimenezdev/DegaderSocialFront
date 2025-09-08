# 🎯 PRUEBAS COMPLETAS - Sistema de Likes y Comentarios en Frontend

## ✅ ESTADO DEL SISTEMA:

- **Backend**: http://localhost:3001 ✅ Funcionando
- **Frontend**: http://localhost:5174 ✅ Funcionando
- **Funciones implementadas**: ✅ handleToggleLike, handleEnviarComentario
- **UI implementada**: ✅ Botones interactivos, sección expandible de comentarios

## 🧪 PASOS PARA PROBAR:

### 1. Verificar que el frontend se conecte al backend

- Abrir http://localhost:5174 en el navegador
- Hacer login con tu usuario
- Ir a tu perfil

### 2. Probar LIKES:

- Crear una nueva publicación (si no tienes ninguna)
- Hacer clic en el botón "👍 Me gusta"
- Verificar que el número de likes cambie
- Hacer clic otra vez para quitar el like

### 3. Probar COMENTARIOS:

- Hacer clic en el botón "💬 Comentar"
- Debería expandirse una sección con:
  - Lista de comentarios existentes
  - Input para escribir nuevo comentario
- Escribir un comentario y presionar Enter o "Enviar"
- Verificar que aparezca en la lista

### 4. Verificar en la consola del navegador:

- Abrir DevTools (F12)
- Ver si hay logs como:
  - "✅ Like actualizado:"
  - "✅ Comentario agregado:"
- Si hay errores, revisar la pestaña Network

## 🔍 PROBLEMAS POSIBLES Y SOLUCIONES:

### ❌ Si no aparecen los botones de like/comentar:

- Verificar que el código se guardó correctamente
- Refrescar la página del navegador
- Revisar si hay errores en la consola

### ❌ Si los likes no funcionan:

- Verificar en Network que la request se haga a:
  `POST http://localhost:3001/api/publicaciones/{ID}/like`
- Verificar que el token de autorización se envíe

### ❌ Si los comentarios no funcionan:

- Verificar en Network que la request se haga a:
  `POST http://localhost:3001/api/publicaciones/{ID}/comentarios`
- Verificar que el body contenga: `{"texto": "mi comentario"}`

### ❌ Si aparece error 401/403:

- El token expiró - hacer logout y login otra vez
- Verificar que el Authorization header esté correcto

## 🎮 URLs PARA USAR EN BROWSER:

### Frontend:

http://localhost:5174

### Backend (para APIs directas):

- Likes: `POST http://localhost:3001/api/publicaciones/{ID}/like`
- Comentarios: `POST http://localhost:3001/api/publicaciones/{ID}/comentarios`
- Publicaciones: `GET http://localhost:3001/api/publicaciones`

## 📝 NOTAS TÉCNICAS:

### Funciones implementadas en PerfilUser.jsx:

1. **handleToggleLike(publicacionId)** - Da/quita like
2. **handleMostrarComentarios(publicacionId)** - Muestra/oculta comentarios
3. **handleEnviarComentario(publicacionId)** - Envía nuevo comentario

### Estados agregados:

- `mostrandoComentarios` - Controla qué publicación muestra comentarios
- `nuevoComentario` - Texto del comentario a enviar
- `enviandoComentario` - Loading state para el botón de enviar

### Backend endpoints (YA FUNCIONAN):

- ✅ `POST /api/publicaciones/:id/like`
- ✅ `POST /api/publicaciones/:id/comentarios`
- ✅ `DELETE /api/publicaciones/:id/comentarios/:comentarioId`

¡EL SISTEMA DEBERÍA ESTAR COMPLETAMENTE FUNCIONAL! 🚀
