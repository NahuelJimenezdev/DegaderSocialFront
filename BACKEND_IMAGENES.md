# Configuración del Backend para Imágenes

## Problema Identificado

La imagen se está subiendo correctamente al servidor, pero no se puede acceder desde el frontend. Esto indica un problema en la configuración del servidor para servir archivos estáticos.

## Solución Requerida en el Backend

### 1. Configuración de Multer (Middleware de Archivos)

```javascript
const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Crear directorio si no existe
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"));
    }
  },
});
```

### 2. Endpoint para Subir Avatar

```javascript
app.post("/api/me/avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No se subió ningún archivo" });
    }

    // Obtener el usuario actual (desde el token JWT)
    const userId = req.user.id; // Asumiendo que tienes middleware de auth

    // Construir la URL completa de la imagen
    const imageUrl = `/uploads/${req.file.filename}`;

    // Actualizar el usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fotoPerfil: imageUrl },
      { new: true }
    );

    res.json({
      msg: "Avatar actualizado",
      usuario: updatedUser,
    });
  } catch (error) {
    console.error("Error al subir avatar:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
});
```

### 3. Servir Archivos Estáticos (CRÍTICO)

```javascript
const express = require("express");
const path = require("path");

// Servir archivos estáticos desde el directorio uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// O alternativamente, servir desde un directorio público
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
```

### 4. Configuración de CORS

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // URLs de tu frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

### 5. Estructura de Directorios Recomendada

```
tu-proyecto-backend/
├── uploads/           # Directorio donde se guardan las imágenes
│   ├── avatar-1234567890-123456789.webp
│   └── avatar-1234567890-987654321.jpg
├── public/            # Archivos públicos (alternativo)
│   └── images/
├── routes/
│   └── api.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── package.json
└── server.js
```

### 6. Verificación de la Configuración

Para verificar que tu backend esté configurado correctamente:

1. **Sube una imagen** usando el endpoint `/api/me/avatar`
2. **Verifica que el archivo se guarde** en el directorio `uploads/`
3. **Prueba acceder directamente** a la URL: `http://localhost:3001/uploads/nombre-del-archivo.webp`
4. **Verifica que la respuesta** incluya la URL correcta en el campo `fotoPerfil`

### 7. Ejemplo de Respuesta Correcta

```json
{
  "msg": "Avatar actualizado",
  "usuario": {
    "_id": "68b7b91425baf1d36e9b4e53",
    "primernombreUsuario": "Joeel",
    "primerapellidoUsuario": "Benitez",
    "fotoPerfil": "/uploads/avatar-1234567890-123456789.webp",
    "correoUsuario": "nahuel@gmail.com",
    "rolUsuario": "Miembro"
  }
}
```

### 8. URLs de Prueba

Una vez configurado, deberías poder acceder a:

- `http://localhost:3001/uploads/avatar-1234567890-123456789.webp` ✅
- `http://localhost:3001/static/avatar-1234567890-123456789.webp` ✅ (si usas /static)
- `http://localhost:3001/images/avatar-1234567890-123456789.webp` ✅ (si usas /images)

### 9. Solución de Problemas Comunes

#### Error 404 al acceder a la imagen

- **Causa**: No se está sirviendo el directorio de uploads
- **Solución**: Agregar `app.use('/uploads', express.static(...))`

#### Error de CORS

- **Causa**: CORS no configurado correctamente
- **Solución**: Configurar CORS con las URLs correctas del frontend

#### Imagen no se guarda

- **Causa**: Permisos del directorio o configuración de multer
- **Solución**: Verificar permisos y crear el directorio si no existe

#### URL incorrecta en la base de datos

- **Causa**: Lógica incorrecta al construir la URL
- **Solución**: Usar `path.join()` para construir URLs correctas

### 10. Comando para Probar

```bash
# Probar que el servidor esté funcionando
curl http://localhost:3001/api/me

# Probar que se pueda acceder a una imagen (reemplaza con un archivo real)
curl -I http://localhost:3001/uploads/archivo-de-prueba.webp
```

## Resumen

El problema principal es que **el backend no está configurado para servir archivos estáticos**. Necesitas:

1. ✅ **Configurar multer** para guardar archivos
2. ✅ **Servir archivos estáticos** con `express.static()`
3. ✅ **Configurar CORS** correctamente
4. ✅ **Construir URLs correctas** para las imágenes

Una vez implementado esto, las imágenes deberían mostrarse correctamente en el frontend.
