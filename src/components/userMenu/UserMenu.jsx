// UserMenu.jsx
import { useEffect, useState, useRef } from "react";
import { User, LogOut } from "lucide-react";

export default function UserMenu({ user, loading, err, handleSignOut }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="d-flex align-items-center gap-2 ms-1">
      {/* Avatar */}
      <button
        className="p-0 border-0 bg-transparent rounded-circle overflow-hidden d-flex align-items-center justify-content-center"
        style={{ width: 36, height: 36, background: "linear-gradient(135deg,#60a5fa,#fbbf24)" }}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="profileSlideMenu"
      >
        {user?.fotoPerfil ? (
          <img
            src={`http://localhost:3001${user.fotoPerfil}?t=${new Date().getTime()}`}
            alt={user.primernombreUsuario || "Avatar"}
            className="w-100 h-100 object-fit-cover"
          />
        ) : (
          <User size={18} className="text-white" />
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel deslizante */}
      <div
        id="profileSlideMenu"
        ref={panelRef}
        className={`slide-panel ${open ? "show" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de perfil"
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-start d-none d-sm-block">
            <div className="small fw-semibold text-dark">
              {loading ? "Cargando..." : user ? `${user.primernombreUsuario} ${user.primerapellidoUsuario}` : "Invitado"}
            </div>
            <div className="small text-secondary text-capitalize"> {loading ? "" : user?.rolUsuario || "visitante"} </div>
            {err && (<div className="mt-1 text-danger" style={{ fontSize: "10px" }}> Error: {err} </div>)}
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
          />
        </div>

        {/* Secciones */}
        <p className="mb-3">Perfil</p>
        <p className="mb-3">Ajustes</p>
        <p className="mb-3">Notificaciones</p>
        <p className="mb-3">Privacidad</p>
        <p className="mb-3">Ayuda</p>

        <div className="mt-auto">
          <button
            onClick={() => {
              setOpen(false);
              handleSignOut();
            }}
            className="btn btn-outline-danger w-100"
          >
            <LogOut size={16} className="me-2" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
