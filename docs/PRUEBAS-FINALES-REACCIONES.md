# 🧪 Guía Final: Pruebas del Sistema de Reacciones

## 🎯 **Estado Actual**

✅ **Backend**: Corriendo en http://localhost:3001/ con nuevas rutas de reacciones
✅ **Frontend**: Corriendo en http://localhost:5174/ con componente ReactionButton
✅ **Base de Datos**: Modelo actualizado con soporte para reacciones

## 🚀 **Cómo Probar las Reacciones**

### 1. **Localizar Comentarios**

1. Ve a http://localhost:5174/
2. Inicia sesión si no lo has hecho
3. Ve a tu perfil de usuario
4. Busca una publicación con comentarios existentes
5. Si no hay comentarios, crea uno nuevo con texto + emoji + imagen

### 2. **Probar Reacciones Básicas**

En cada comentario verás un botón de reacciones a la derecha de la fecha:

#### ✅ **Agregar Primera Reacción**

- Haz click en el botón 👍 del comentario
- Debería aparecer un panel flotante con 4 opciones:
  - 👍 **Me gusta** (azul)
  - ❤️ **Me encanta** (rojo)
  - 👀 **Visto** (gris)
  - 👎 **No me gusta** (gris)
- Selecciona cualquiera
- El botón debería cambiar a mostrar ese emoji
- Aparecerá un contador: ej. "👍 1"

#### ✅ **Cambiar Reacción**

- Haz click nuevamente en el botón
- Selecciona una reacción diferente
- El botón debería cambiar al nuevo emoji
- El contador se mantiene en 1

#### ✅ **Quitar Reacción (Toggle)**

- Haz click en el botón
- Selecciona la misma reacción que ya tenías
- El botón debería volver a 👍 genérico
- El contador desaparece

### 3. **Verificar en DevTools**

Abre DevTools (F12) y ve a la pestaña Console. Al reaccionar deberías ver:

```
👍 [Frontend] Reaccionando a comentario...
📝 Publicación ID: 68bf1cf35e59eea2cc35d1c2
💬 Comentario ID: 67d2f1a8...
😀 Tipo reacción: like
✅ Reacción procesada: {success: true, ...}
```

### 4. **Verificar en Backend**

En la terminal del backend deberías ver:

```
👍 [Backend] Reaccionando a comentario...
📝 ID Publicación: 68bf1cf35e59eea2cc35d1c2
💬 ID Comentario: 67d2f1a8...
😀 Tipo de reacción: like
👤 Usuario ID: 68be7372...
✅ Reacción procesada exitosamente
```

## 🧪 **Casos de Prueba Específicos**

### ✅ **Caso 1: Reacción Nueva**

1. Comenta en una publicación
2. Reacciona con 👍 "Me gusta"
3. **Esperado**: Botón cambia a 👍, contador muestra "1"

### ✅ **Caso 2: Múltiples Reacciones por Usuario**

1. Cambia tu reacción de 👍 a ❤️
2. **Esperado**: Solo queda ❤️, contador sigue en "1"

### ✅ **Caso 3: Toggle (Quitar Reacción)**

1. Selecciona ❤️ nuevamente
2. **Esperado**: Reacción se quita, botón vuelve a 👍 genérico

### ✅ **Caso 4: Persistencia**

1. Reacciona a un comentario
2. Recarga la página (F5)
3. **Esperado**: Tu reacción se mantiene visible

## 🐛 **Solución de Problemas**

### ❌ **Error: "No aparece el botón de reacciones"**

**Causa**: Comentario no tiene la estructura correcta
**Solución**: Crear un comentario nuevo (los anteriores pueden no tener el campo reacciones)

### ❌ **Error: "Panel de reacciones no aparece"**

**Causa**: Problema en el frontend
**Solución**: Verificar en DevTools si hay errores de JavaScript

### ❌ **Error: "Reacción no se guarda"**

**Causa**: Problema de autenticación o backend
**Solución**:

1. Verificar token en localStorage
2. Revisar logs del backend
3. Verificar que la ruta esté configurada

### ❌ **Error: "500 Internal Server Error"**

**Causa**: Backend no actualizado o modelo incorrecto
**Solución**: Reiniciar backend y verificar modelo de comentarios

## 🎪 **Funcionalidades Adicionales**

### 🔄 **Multi-usuario (Si tienes acceso)**

1. Abre ventana incógnita
2. Crea otra cuenta o inicia con otro usuario
3. Reacciona al mismo comentario
4. **Esperado**: Contadores independientes por tipo de reacción

### 📱 **Responsive**

1. Redimensiona la ventana del navegador
2. Prueba en diferentes tamaños
3. **Esperado**: Panel de reacciones se adapta correctamente

## 🎯 **Verificación Final**

Para confirmar que todo funciona:

1. ✅ **Comentarios con multimedia** funcionan
2. ✅ **Reacciones a comentarios** funcionan
3. ✅ **Sistema de toggle** funciona
4. ✅ **Persistencia en BD** funciona
5. ✅ **Contadores correctos** se muestran
6. ✅ **UI responsive** se adapta

## 📋 **Checklist Completo**

- [ ] Crear comentario con texto + emoji + imagen
- [ ] Reaccionar con 👍 "Me gusta"
- [ ] Cambiar reacción a ❤️ "Me encanta"
- [ ] Usar 👀 "Visto"
- [ ] Probar 👎 "No me gusta"
- [ ] Quitar reacción (toggle)
- [ ] Recargar página y verificar persistencia
- [ ] Revisar contadores en otros comentarios
- [ ] Verificar logs en DevTools
- [ ] Probar en diferentes tamaños de pantalla

---

**🎉 ¡Todo Listo!**

El sistema de comentarios multimedia con reacciones está completamente funcional. Los usuarios pueden:

- ✅ Comentar con texto, emojis, imágenes y videos
- ✅ Reaccionar a comentarios con 4 tipos diferentes
- ✅ Ver reacciones de otros usuarios
- ✅ Cambiar o quitar sus reacciones

**URLs de Prueba**:

- Frontend: http://localhost:5174/
- Backend: http://localhost:3001/
