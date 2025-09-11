# 🧪 Guía de Pruebas: Comentarios Multimedia

## 🎯 Objetivo

Probar la nueva funcionalidad de comentarios enriquecidos con emojis, imágenes y videos.

## 🔧 Configuración de Prueba

### ✅ Servidores Activos

- **Frontend**: http://localhost:5174/
- **Backend**: http://localhost:3001/

### 📝 Pasos de Preparación

1. Iniciar sesión en la aplicación
2. Ir a tu perfil de usuario
3. Buscar una publicación existente o crear una nueva
4. Expandir la sección de comentarios haciendo clic en "💬 Comentar"

## 🧪 Casos de Prueba

### 1. **Comentario Solo Texto + Emoji**

**Objetivo**: Verificar que el selector de emojis funciona correctamente

**Pasos**:

1. Hacer clic en el botón 😊 (emoji)
2. Seleccionar una categoría (caras, gestos, etc.)
3. Hacer clic en un emoji
4. Escribir texto adicional
5. Enviar comentario

**Resultado Esperado**:

- ✅ Emoji se inserta en el cursor
- ✅ Selector de emojis se cierra
- ✅ Comentario se envía correctamente
- ✅ Emoji se visualiza en el comentario publicado

### 2. **Comentario con Imagen**

**Objetivo**: Probar upload de imágenes

**Pasos**:

1. Hacer clic en el botón 📷 (imagen)
2. **Opción A**: Hacer clic en "Imagen" y seleccionar archivo
3. **Opción B**: Arrastrar imagen al área de drop
4. Verificar preview de imagen
5. Escribir texto opcional
6. Enviar comentario

**Resultado Esperado**:

- ✅ Preview de imagen aparece inmediatamente
- ✅ Se muestra el tamaño del archivo
- ✅ Botón de eliminar (X) funciona
- ✅ Comentario se envía con imagen
- ✅ Imagen se visualiza en el comentario publicado
- ✅ Modal de imagen funciona al hacer clic

**Formatos a Probar**:

- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF animado
- ✅ WEBP

### 3. **Comentario con Video**

**Objetivo**: Probar upload de videos

**Pasos**:

1. Hacer clic en el botón 🎬 (video)
2. Seleccionar o arrastrar un video
3. Esperar procesamiento del thumbnail
4. Verificar duración mostrada
5. Agregar texto opcional
6. Enviar comentario

**Resultado Esperado**:

- ✅ Thumbnail se genera automáticamente
- ✅ Duración del video se muestra
- ✅ Tamaño del archivo se indica
- ✅ Preview con botón de play
- ✅ Video se reproduce en el comentario final

**Formatos a Probar**:

- ✅ MP4
- ✅ WEBM
- ✅ OGG

### 4. **Comentario Multimedia Completo**

**Objetivo**: Probar combinación de todo

**Pasos**:

1. Escribir texto con emojis
2. Agregar 2-3 imágenes
3. Agregar 1 video
4. Verificar resumen de archivos adjuntos
5. Enviar comentario

**Resultado Esperado**:

- ✅ Resumen muestra "📎 Adjuntos: X imagen(es), Y video(s)"
- ✅ Todos los elementos se envían correctamente
- ✅ Comentario se visualiza con todo el contenido
- ✅ Interacciones (click imagen, play video) funcionan

### 5. **Validaciones y Límites**

**Objetivo**: Probar límites y validaciones

**Casos a Probar**:

#### 5.1 Comentario Vacío

- Intentar enviar sin texto, imágenes o videos
- **Esperado**: Mensaje "Agrega texto, una imagen o un video"

#### 5.2 Archivo Demasiado Grande

- Subir imagen > 5MB
- Subir video > 50MB
- **Esperado**: Alert con mensaje de error

#### 5.3 Formato No Soportado

- Intentar subir .txt como imagen
- Intentar subir .exe como video
- **Esperado**: Alert con "Tipo de archivo no permitido"

#### 5.4 Múltiples Archivos

- Subir varias imágenes a la vez
- **Esperado**: Todos se procesan y muestran

### 6. **Interfaz de Usuario**

**Objetivo**: Verificar UX/UI

**Elementos a Verificar**:

- ✅ Botones cambian de color al activarse
- ✅ Contadores de archivos aparecen (📷 (2), 🎬 (1))
- ✅ Loading spinners durante envío
- ✅ Botones se deshabilitan durante envío
- ✅ Área de drop cambia color al arrastrar
- ✅ Previews tienen botón eliminar funcional

### 7. **Estados de Error**

**Objetivo**: Verificar manejo de errores

**Casos**:

1. **Sin conexión**: Desconectar internet, intentar comentar
2. **Backend down**: Detener backend, intentar comentar
3. **Token expirado**: Comentar con sesión vencida

**Esperado**: Mensajes de error apropiados sin crashes

## 📋 Checklist de Funcionalidades

### ✅ Editor de Comentarios

- [ ] Textarea responsive
- [ ] Botón emoji abre/cierra selector
- [ ] Botón imagen toggle área de upload
- [ ] Botón video toggle área de upload
- [ ] Contadores de archivos actualizan
- [ ] Botón enviar se habilita/deshabilita correctamente
- [ ] Loading state durante envío

### ✅ Selector de Emojis

- [ ] 6 categorías funcionan
- [ ] Emojis se insertan en posición cursor
- [ ] Selector se cierra al seleccionar
- [ ] Responsive en móvil

### ✅ Upload de Imágenes

- [ ] Drag & drop funciona
- [ ] Click para seleccionar funciona
- [ ] Múltiples archivos soportados
- [ ] Preview inmediato
- [ ] Eliminar imagen individual
- [ ] Validación de tipo y tamaño

### ✅ Upload de Videos

- [ ] Thumbnail se genera
- [ ] Duración se calcula
- [ ] Preview con ícono de play
- [ ] Eliminar video individual
- [ ] Validación de tipo y tamaño

### ✅ Visualización de Comentarios

- [ ] Texto con emojis se muestra
- [ ] Imágenes en grid responsive
- [ ] Modal de imagen funciona
- [ ] Videos con controles nativos
- [ ] Información del autor
- [ ] Fecha formateada

## 🐛 Problemas Comunes y Soluciones

### Problema: "Emoji no se inserta"

**Solución**: Verificar que el textarea tenga focus

### Problema: "Preview de imagen no aparece"

**Solución**: Verificar FileReader API en navegador

### Problema: "Video no reproduce"

**Solución**: Verificar formato soportado por navegador

### Problema: "Error al enviar"

**Solución**: Verificar backend, token, tamaño de archivos

## 📱 Pruebas Adicionales

### Responsive Design

- [ ] Tablet (768px)
- [ ] Mobile (480px)
- [ ] Desktop (1200px+)

### Navegadores

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Rendimiento

- [ ] Upload de múltiples archivos grandes
- [ ] Comentarios con muchas imágenes
- [ ] Scroll en comentarios largos

---

## 🎉 Resultado Esperado Final

Al completar todas las pruebas, deberías tener:

- ✅ Comentarios ricos con multimedia funcionales
- ✅ UX intuitiva y responsive
- ✅ Validaciones robustas
- ✅ Manejo de errores apropiado
- ✅ Rendimiento aceptable

**URL de Prueba**: http://localhost:5174/
