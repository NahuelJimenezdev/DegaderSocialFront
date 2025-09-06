// components/UserMiniCard.jsx
import { User } from "lucide-react";

export default function UserMiniCard({ u, onClick }) {
  return (
    <div
      className="d-flex align-items-center p-2 rounded cursor-pointer"
      style={{ gap: 8 }}
      onClick={onClick}
    >
      <img
        src={u.fotoPerfil ? `http://localhost:3001${u.fotoPerfil}` : "/default-avatar.png"}
        alt={`${u.primernombreUsuario} ${u.primerapellidoUsuario}`}
        className="rounded-circle"
        style={{ width: 40, height: 40, objectFit: "cover" }}
      />
      <div className="flex-grow-1">
        <div className="fw-semibold">
          {u.primernombreUsuario} {u.primerapellidoUsuario}
        </div>
        <small className="text-muted">
          {u.rolUsuario} · {u.ciudadUsuario || "—"}{u.paisUsuario ? `, ${u.paisUsuario}` : ""}
        </small>
      </div>
      <User size={16} className="text-muted" />
    </div>
  );
}
