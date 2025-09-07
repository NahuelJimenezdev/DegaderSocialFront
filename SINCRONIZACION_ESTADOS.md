# 🔄 Sistema de Sincronización de Estados - Documentación

## 📋 Resumen de la Implementación

Se ha implementado un sistema de eventos globales para sincronizar automáticamente el estado de amistades entre todos los componentes de la aplicación.

## 🎯 Problemas Solucionados

- ✅ **Campanita → Card de solicitudes**: Ahora se actualiza automáticamente
- ✅ **Campanita → Perfil invitado**: El ícono cambia automáticamente
- ✅ **Estados desincronizados**: Todos los componentes se sincronizan

## 🛠️ Componentes Modificados

### 1. **NotificacionesBell.jsx** - ✅ ACTUALIZADO

- Ahora emite eventos globales cuando se responde a solicitudes
- Eventos emitidos: `solicitud_respondida`, `amistad_actualizada`, `notificacion_leida`

### 2. **SolicitudesPendientes.jsx** - ✅ ACTUALIZADO

- Escucha eventos globales para actualizar estados automáticamente
- Se actualiza cuando se responde desde la campanita

## 🆕 Nuevos Componentes Creados

### 1. **useGlobalEvents.js** - Hook de eventos globales

```javascript
import { useAmistadEvents } from "../../hooks/useGlobalEvents";

const { emitSolicitudRespondida, onSolicitudRespondida } = useAmistadEvents();
```

### 2. **useEstadoAmistad.js** - Hook para estado de amistad

```javascript
import { useEstadoAmistad } from "../../hooks/useEstadoAmistad";

const { estado, enviarSolicitud, aceptarSolicitud } =
  useEstadoAmistad(usuarioId);
```

### 3. **BotonAmistad.jsx** - Componente reutilizable

```javascript
import BotonAmistad from "../../components/common/BotonAmistad";

<BotonAmistad
  usuarioId="user123"
  size="md"
  mostrarTexto={true}
  variant="default"
/>;
```

## 🔧 Cómo Integrar en Cualquier Componente

### Para **mostrar botón de amistad** (ej: perfil de usuario):

```javascript
import BotonAmistad from "../components/common/BotonAmistad";

const PerfilUsuario = ({ usuario }) => {
  return (
    <div className="perfil">
      <h2>{usuario.nombre}</h2>

      {/* Botón automático de amistad que se sincroniza */}
      <BotonAmistad usuarioId={usuario._id} size="lg" mostrarTexto={true} />
    </div>
  );
};
```

### Para **escuchar cambios** de amistad:

```javascript
import { useAmistadEvents } from "../hooks/useGlobalEvents";

const MiComponente = () => {
  const { onAmistadActualizada } = useAmistadEvents();

  useEffect(() => {
    const unsubscribe = onAmistadActualizada((eventData) => {
      console.log("Amistad actualizada:", eventData);
      // Actualizar tu estado local aquí
    });

    return unsubscribe; // Cleanup
  }, []);
};
```

### Para **emitir eventos** personalizados:

```javascript
import { useAmistadEvents } from "../hooks/useGlobalEvents";

const MiComponente = () => {
  const { emitAmistadActualizada } = useAmistadEvents();

  const handleAction = () => {
    // Después de una acción exitosa
    emitAmistadActualizada({
      usuarioId: "user123",
      estado: "amigos",
    });
  };
};
```

## 📡 Eventos Disponibles

### `solicitud_respondida`

```javascript
{
  usuarioId: 'user123',
  notificacionId: 'notif456',
  accion: 'aceptar' | 'rechazar',
  timestamp: '2025-09-06T...'
}
```

### `amistad_actualizada`

```javascript
{
  usuarioId: 'user123',
  estado: 'amigos' | 'solicitud_enviada' | 'solicitud_recibida' | 'ninguna',
  timestamp: '2025-09-06T...'
}
```

### `notificacion_leida`

```javascript
{
  notificacionId: 'notif456',
  timestamp: '2025-09-06T...'
}
```

## 🎨 Estilos de BotonAmistad

### Tamaños disponibles:

- `size="sm"` - Botón pequeño
- `size="md"` - Botón mediano (default)
- `size="lg"` - Botón grande

### Variantes disponibles:

- `variant="default"` - Botón normal con fondo
- `variant="outline"` - Botón con borde
- `variant="minimal"` - Botón ghost

### Ejemplo completo:

```javascript
<BotonAmistad
  usuarioId={usuario._id}
  size="lg"
  variant="outline"
  mostrarTexto={true}
  className="my-custom-class"
/>
```

## 🚀 Flujo de Sincronización

1. **Usuario hace clic en "Aceptar"** en NotificacionesBell
2. **Se llama a la API** para aceptar la solicitud
3. **Se emiten eventos globales**: `solicitud_respondida` + `amistad_actualizada`
4. **Todos los componentes escuchan** y actualizan automáticamente:
   - SolicitudesPendientes actualiza la card
   - BotonAmistad en perfil cambia a "Amigos"
   - Cualquier otro componente que use useEstadoAmistad

## 🧪 Cómo Probar

1. **Abre la aplicación** en http://localhost:5175
2. **Ve a las notificaciones** (campanita en navbar)
3. **Acepta una solicitud** desde el dropdown
4. **Ve a "Solicitudes Pendientes"** → debería estar actualizada
5. **Ve al perfil del usuario** → debería mostrar "Amigos"

¡Todo debería sincronizarse automáticamente! 🎉
