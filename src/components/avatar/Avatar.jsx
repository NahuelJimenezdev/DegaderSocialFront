// components/Avatar.jsx
import { useEffect, useState, useMemo } from 'react';

// Sirve el PNG en /public/default-avatar.png del frontend
const DEFAULT_AVATAR = '/default-avatar.png';

// Configurable por env, con fallback a localhost
const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:3001';

const isAbsoluteUrl = (s) => /^https?:\/\//i.test(s);

function resolveFotoUrl(path) {
  if (!path) return DEFAULT_AVATAR;

  // Normaliza backslashes de Windows
  let p = String(path).replace(/\\/g, '/');

  // Si ya viene absoluta (https://...), úsala tal cual
  if (isAbsoluteUrl(p)) return p;

  // Asegura slash inicial
  if (!p.startsWith('/')) p = `/${p}`;

  // Si es un path del backend (/uploads/avatars/...)
  // devuélvelo pegado al API_BASE
  return `${API_BASE}${p}`;
}

export default function Avatar({ fotoPerfil, alt = '', size = 56, className = 'rounded' }) {
  const initial = useMemo(() => resolveFotoUrl(fotoPerfil), [fotoPerfil]);
  const [src, setSrc] = useState(initial);

  useEffect(() => {
    setSrc(resolveFotoUrl(fotoPerfil));
  }, [fotoPerfil]);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      style={{ width: size, height: size, objectFit: 'cover' }}
      onError={() => {
        // Congela el fallback para evitar parpadeo infinito
        if (src !== DEFAULT_AVATAR) setSrc(DEFAULT_AVATAR);
      }}
    />
  );
}
