# 🐛 Guía de Debug: Error 400 en Comentarios

## 🔍 Problema Detectado

Error 400: "El comentario debe tener texto, imágenes o videos"

## ✅ Solución Implementada

1. **Backend**: Agregado middleware multer a la ruta de comentarios
2. **Frontend**: Agregados logs detallados para debug

## 🧪 Pasos para Verificar

### 1. **Verificar Backend**

El backend debe estar corriendo en `http://localhost:3001/` ✅

### 2. **Verificar Logs en Consola**

Al intentar enviar un comentario, deberías ver:

```
📝 [CommentEditor] Enviando comentario...
📄 [CommentEditor] Texto: tu texto aquí
🖼️ [CommentEditor] Imágenes seleccionadas: [array de imágenes]
🎬 [CommentEditor] Videos seleccionados: [array de videos]
📦 [CommentEditor] Datos a enviar: {objeto completo}

🚀 [Frontend] Datos del comentario recibidos: {objeto}
📝 [Frontend] Texto: tu texto
🖼️ [Frontend] Imágenes: [array]
🎬 [Frontend] Videos: [array]
📤 [Frontend] Agregando texto al FormData: tu texto
🖼️ [Frontend] Agregando imagen 0: nombre.jpg tamaño
📦 [Frontend] Contenido del FormData:
  texto: tu texto
  imagenes: [File object]
```

### 3. **Verificar en Backend**

En los logs del backend deberías ver:

```
📝 [Backend] Agregando comentario...
📄 Texto: tu texto
📁 Archivos recibidos: imagenes,videos o ninguno
🖼️ [Backend] Procesando imagen de comentario: nombre.jpg
```

## 🔧 Si Sigue Fallando

### Opción 1: Test Simple

1. Ve a http://localhost:5174/
2. Abre DevTools (F12)
3. Ve a la pestaña Console
4. Copia y pega este código:

```javascript
// Test rápido de la API
async function testComentario() {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("texto", "Test simple 😀");

  try {
    const response = await fetch(
      "http://localhost:3001/api/publicaciones/68bf1cf35e59eea2cc35d1c2/comentarios",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    console.log("Status:", response.status);
    const result = await response.json();
    console.log("Response:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

testComentario();
```

### Opción 2: Verificar FormData

Si el test anterior falla, verifica que FormData se esté creando correctamente:

```javascript
const formData = new FormData();
formData.append("texto", "Test");
console.log("FormData entries:");
for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
```

## 🚨 Errores Comunes

### Error: "No se puede leer archivos"

**Causa**: Middleware multer no configurado
**Solución**: ✅ Ya corregido en routes

### Error: "FormData vacío"

**Causa**: Problema en el frontend
**Solución**: Verificar que los archivos se agreguen correctamente

### Error: "Token inválido"

**Causa**: Sesión expirada
**Solución**: Refrescar página y volver a iniciar sesión

## 📝 Reiniciar Componente

Si nada funciona, prueba comentario simple:

1. Solo texto: "Hola 😀"
2. Solo emoji: "😀"
3. Solo imagen: (subir una imagen pequeña)

## 🔄 Restart Completo

Si el problema persiste:

1. Ctrl+C en ambos terminales
2. Reiniciar backend: `npm run dev` en NodeInicios
3. Reiniciar frontend: `npm run dev` en Degader_Social
4. Refrescar navegador (F5)
5. Intentar de nuevo

---

**Estado actual**: Backend actualizado ✅, Frontend con logs ✅
**Próximo paso**: Probar comentario y revisar logs en consola
