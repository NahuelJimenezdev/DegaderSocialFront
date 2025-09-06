# FHS\&L — Plataforma Social & Administrativa

**Fundación Humanitaria Sol & Luna (FHS\&L)** · **Frontend (React + Vite)**

> Aplicación web que combina red social cristiana y sistema de gestión administrativa para iglesias y la fundación, con jerarquía multi-país, módulos de publicaciones, grupos, reuniones, perfiles, notificaciones y control de acceso por roles.

---

## Tabla de contenidos

1. [Visión general](#visión-general)
2. [Alcance y funcionalidades](#alcance-y-funcionalidades)
3. [Modelo organizacional (Dominio)](#modelo-organizacional-dominio)
4. [Arquitectura](#arquitectura)
5. [Tecnologías](#tecnologías)
6. [Estructura del proyecto](#estructura-del-proyecto)
7. [Configuración y variables de entorno](#configuración-y-variables-de-entorno)
8. [Scripts disponibles](#scripts-disponibles)
9. [Convenciones de código](#convenciones-de-código)
10. [Autenticación y autorización](#autenticación-y-autorización)
11. [Módulos clave del frontend](#módulos-clave-del-frontend)
12. [Esquemas y contratos de datos](#esquemas-y-contratos-de-datos)
13. [Pruebas](#pruebas)
14. [Despliegue](#despliegue)
15. [Accesibilidad, i18n y rendimiento](#accesibilidad-i18n-y-rendimiento)
16. [Roadmap](#roadmap)
17. [Contribuir](#contribuir)
18. [Licencia](#licencia)

---

## Visión general

La plataforma FHS\&L busca **conectar y organizar** a directivos, líderes, profesionales y miembros de iglesias y obras asociadas en distintos países, ofreciendo:

* Un **feed social** para publicaciones e interacciones.
* **Gestión administrativa** con jerarquías por país/ región/ departamento/ municipio.
* **Reuniones y eventos** (presenciales y virtuales).
* **Directorio** de personas y áreas.
* **Notificaciones** y workflows de aprobación (p. ej. solicitudes de acceso).

El frontend está construido con **React + Vite**, consume APIs de un backend Node/Express con base de datos **MongoDB**.

---

## Alcance y funcionalidades

* **Registro / Login** con verificación de estado del usuario (`activo`, `pendiente`, `inactivo`).
* **Roles y permisos**: `director`, `subdirector`, `encargado`, `profesional`, `miembro`, `visitante`.
* **Perfiles** (avatar, biografía, datos de contacto).
* **Publicaciones** con texto, imágenes y reacciones (likes, comentarios).
* **Grupos** (por áreas y niveles), con membresías y moderación.
* **Reuniones / Meetings** (gestión, listado, acceso por código si corresponde).
* **Notificaciones** (in-app).
* **Búsqueda unificada** (personas, grupos, lugares).
* **Soporte multi-país** (p. ej., Argentina, Colombia, Paraguay) con **jerarquías** ajustables por territorio.

---

## Modelo organizacional (Dominio)

**Grupos Directivos Generales (Nivel Directivo)**

* Director Ejecutivo, Junta Directiva, Secretaría Ejecutiva, Equipo de Licitación y Adquisiciones.

**Órganos de Control**

* Control Interno y Seguimiento, Asuntos Éticos.

**Organismos Internacionales**

* Salvación Mundial, Misión Internacional de Paz.

**Jerarquía por nivel (aplicada por país/territorio):**

* **Dirección Nacional** (áreas: Planeación, Asuntos Étnicos, Infraestructura, Sostenibilidad, RRHH y Seguridad Laboral, Jurídica, Salud, Psicosocial, Protección Animal, Educación, Financiera, Comunicación, Seguridad).
* **Dirección Regional** (mismas áreas, con alcance regional).
* **Dirección Departamental** → Coordinaciones por área.
* **Coordinación Municipal** → Coordinaciones por área.

> El sistema de permisos y el contenido visible en la interfaz se ajustan automáticamente al **nivel y área** del usuario.

---

## Arquitectura

* **Frontend SPA (este repo)**: React + Vite, estado por hooks/context, ruteo con React Router.
* **Backend (API REST)**: Node.js/Express, JWT y control de roles, MongoDB (Mongoose).
* **CDN/Storage** (opcional): para medios estáticos (avatares, imágenes de publicaciones).
* **Estrategia de seguridad**: CORS, JWT Storage seguro, sanitización de inputs, validación en cliente y servidor.

---

## Tecnologías

* **Frontend**: React 18, Vite, React Router, Fetch/axios, lucide-react (iconos), TailwindCSS (opcional, recomendado).
* **Testing** (recomendado): Vitest + React Testing Library.
* **Calidad** (opcional): ESLint, Prettier, Husky + lint-staged.

---

## Estructura del proyecto

```
/ (raíz del frontend)
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ Auth/           # Formularios Login/Registro
│  │  ├─ Layout/         # Navbar, Sidebar, layouts
│  │  ├─ Profile/        # EditAvatar, EditBio, ProfileView
│  │  ├─ Feed/           # PostCard, Composer, Feed
│  │  ├─ Groups/         # Vista y gestión de grupos
│  │  ├─ Meetings/       # Reuniones/Rooms/Accesos
│  │  └─ Admin/          # Panel admin (roles, aprobaciones)
│  ├─ pages/             # Páginas de alto nivel (routing)
│  ├─ hooks/             # useAuth, useFetch, etc.
│  ├─ context/           # AuthContext, UIContext
│  ├─ services/          # API clients (usuarios, posts, grupos)
│  ├─ lib/               # utilidades (apiFetch, storage, validators)
│  ├─ styles/            # estilos globales (si aplica)
│  ├─ assets/            # imágenes, logos (si aplica)
│  ├─ App.jsx
│  └─ main.jsx
├─ .env.example
├─ index.html
├─ package.json
└─ README.md
```

---

## Configuración y variables de entorno

Crea un archivo **`.env`** en la raíz del frontend basado en **`.env.example`**:

```env
# URL base del backend
VITE_API_URL=http://localhost:3001/api

# Opcional: URL de WebSocket si tu backend lo ofrece
VITE_WS_URL=ws://localhost:3001

# Branding
VITE_APP_NAME="FHS&L Plataforma"
```

> **Importante:** Nunca expongas secretos del servidor en el frontend. Las claves privadas y secretos JWT pertenecen exclusivamente al backend.

### Requisitos

* Node.js 18+ (recomendado 20+)
* npm 9+ / pnpm / yarn
* Backend en marcha (Node/Express + MongoDB) en `VITE_API_URL`

### Instalación

```bash
# 1) Instalar dependencias
npm install

# 2) Iniciar en desarrollo
npm run dev

# 3) Compilar para producción
npm run build

# 4) Previsualizar build
npm run preview
```

---

## Scripts disponibles

* `dev`: Ejecuta Vite en modo desarrollo con HMR.
* `build`: Genera la build de producción.
* `preview`: Sirve la build ya generada.
* `lint` *(opcional)*: Ejecuta ESLint.
* `test` *(opcional)*: Ejecuta Vitest.

---

## Convenciones de código

* **Estilo**: ESLint + Prettier (cuando estén habilitados).
* **Nombres**: componentes en PascalCase, hooks en camelCase iniciando con `use`.
* **Carpetas**: agrupar por dominio (Auth, Profile, Feed) para alta cohesión.
* **Commits** *(sugerido)*: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.).

---

## Autenticación y autorización

* **Login**: correo + contraseña.
* **Token**: JWT almacenado de forma segura (p. ej. Cookie HTTPOnly o, si se usa `localStorage`, extremar cuidados).
* **Estados** de usuario:

  * `pendiente`: acceso limitado (visitante).
  * `activo`: acceso según rol.
  * `inactivo`: acceso denegado.
* **Roles** (de menor a mayor privilegio): `visitante` → `miembro` → `profesional` → `encargado` → `subdirector` → `director`.

> El frontend muestra/oculta secciones según el rol. Por ejemplo, herramientas de depuración de imágenes o paneles de administración sólo para `admin/director` (según reglas del negocio).

---

## Módulos clave del frontend

### 1) Autenticación

* Formularios de Login/Registro, validaciones, flujos de error (`401`, `Credenciales incorrectas`, `Usuario inactivo`, etc.).
* Hook `useAuth` para estado global (usuario, token, loading).

### 2) Perfil de usuario

* **Editar avatar** (validación de tamaño y tipo, vista previa, upload al backend).
* **Editar biografía** (≤ 300 caracteres).
* Vista pública/privada de perfil con metadatos: nombre, email, ciudad, país, jerarquía/área.

### 3) Feed de publicaciones

* Crear/leer publicaciones, reacciones, comentarios.
* Paginación/infinite scroll (si aplica).
* Manejo de errores de red.

### 4) Grupos

* Listado y detalle.
* Membresía y permisos según área y nivel jerárquico.
* Publicaciones filtradas por grupo.

### 5) Reuniones

* Listado de reuniones (con acceso por rol o código).
* Integración de enlaces o embeddings (cuando aplique).

### 6) Búsqueda

* Barra de búsqueda con debounce y dropdown (personas, grupos, lugares).
* Navegación hacia resultados (páginas de detalle).

### 7) Administración

* Aprobación/denegación de solicitudes.
* Gestión de roles/estados.
* Vistas por país/área/nivel (Nacional, Regional, Departamental, Municipal).

---

## Esquemas y contratos de datos

> **Referencia de usuario (backend Mongo/Mongoose)** — resumen de campos consumidos por el frontend:

```js
{
  nombreUsuario: String,
  apellidoUsuario: String,
  correoUsuario: String,            // único
  contraseniaUsuario: String,       // hash (argon2/bcrypt en backend)
  celularUsuario: String,
  direccionUsuario: String,
  ciudadUsuario: String,
  paisUsuario: String,
  rolUsuario: "director" | "subdirector" | "encargado" | "profesional" | "miembro" | "visitante",
  estadoUsuario: "activo" | "inactivo" | "pendiente",
  fotoPerfil: String,               // URL
  biografia: String,                // ≤ 300
  amigos: [ObjectId],
  grupos: [ObjectId],
  publicaciones: [ObjectId],
  fechaRegistro: Date,
  ultimaConexion: Date,
  notificaciones: [{ mensaje, leido, fecha }],
  createdAt: Date,
  updatedAt: Date
}
```

**Endpoints esperados (ejemplos)**

* `POST /api/usuariosInicios/login` → `{ token, usuario }`
* `POST /api/usuariosInicios/register`
* `GET  /api/me` (requiere JWT)
* `PATCH /api/me/avatar` (multipart/form-data)
* `PATCH /api/me/bio`
* `GET  /api/publicaciones` / `POST /api/publicaciones`
* `GET  /api/grupos` / `POST /api/grupos`
* `GET  /api/reuniones`

> Los nombres/paths pueden variar; ajustar el cliente en `src/services/*`.

---

## Pruebas

* **Unitarias**: componentes UI y utilidades.
* **Integración**: hooks y servicios (mock de fetch/axios).
* **E2E** *(opcional)*: Cypress/Playwright para flujos críticos (login, publicar, unirse a grupo).

---

## Despliegue

1. Compilar:

   ```bash
   npm run build
   ```
2. Servir `/dist` con un servidor estático (Nginx, Apache, Vercel, Netlify).
3. Configurar variables de entorno y CORS en el **backend** para el dominio final.
4. **Cache**: idealmente CDN para assets estáticos (imágenes, JS/CSS minificado).

> Si se usa Nginx como reverse proxy, recuerda redirigir `/*` hacia `index.html` para rutas de SPA.

---

## Accesibilidad, i18n y rendimiento

* **A11y**: usar roles ARIA, contraste adecuado, navegación por teclado.
* **i18n**: arquitectura preparada para ES (AR/CO) y futuro EN/PT (biblioteca i18next recomendada).
* **Performance**: code-splitting por rutas, imágenes optimizadas (WebP/AVIF), memoización en listas grandes.

---

## Roadmap

* **v0.1 (MVP)**: Auth, Perfil, Feed básico, Notificaciones mínimas.
* **v0.2**: Grupos + moderación, Búsqueda unificada.
* **v0.3**: Reuniones con acceso por código + calendario básico.
* **v0.4**: Jerarquía multi-país completa con vistas por nivel y área.
* **v1.0**: Auditoría (log de acciones), paneles por áreas, reportes.

---

## Contribuir

1. Crea una rama desde `main`: `feat/nombre-feature` o `fix/bug-descriptivo`.
2. Sigue las convenciones de commits (Conventional Commits).
3. Abre un Pull Request con descripción clara (qué cambia, por qué, cómo probarlo).

**Guías sugeridas**

* Code Review: lint sin errores, tests pasando, cobertura suficiente.
* UI: consistencia visual (espaciados, tipografía, estados de carga/empty/error).

---

## Licencia

Proyecto **privado** de la Fundación Humanitaria Sol & Luna.

> Define aquí la licencia elegida (p. ej. “Todos los derechos reservados” o “MIT”) según la decisión institucional.

---

### Notas útiles (Windows & Git)

* Si ves avisos de **CRLF/LF**, puedes normalizar con:

  ```bash
  git config core.autocrlf true   # Windows recomendado
  ```
* Revisa que `VITE_API_URL` apunte al backend correcto y que CORS esté habilitado para tu origen de frontend.

---

**Contacto**
Equipo de Dirección de Planeación Estratégica y Proyectos — FHS\&L
Soporte técnico: *\[definir correo oficial]*

> Si necesitas que este README incluya capturas, diagramas o ejemplos de llamadas a la API con datos reales, dímelo y los agrego.
