import { useLocation, useNavigate } from "react-router-dom";
import { Home, User as UserIcon, Users, MessageCircle, Calendar, Folder, Settings, MapPin, UserPlus } from "lucide-react";
import { useProfile } from "../../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const current = (location.pathname.split("/")[1] || "feed").toLowerCase();

  const { profile, loading, error } = useProfile();
  const loadingUser = loading;

  const menuItems = [
    { id: "feed", label: "Inicio", icon: Home },
    { id: "friends", label: "Amigos", icon: Users },
    { id: "solicitudes", label: "Solicitudes", icon: UserPlus },
    { id: "groups", label: "Grupos e Iglesias", icon: MapPin },
    { id: "meetings", label: "Reuniones", icon: Calendar },
    { id: "files", label: "Mis Carpetas", icon: Folder },
    { id: "messages", label: "Mensajes", icon: MessageCircle },
    { id: "perfilUser", label: "Mi Perfil", icon: UserIcon },
  ];

  const nombre = profile?.primernombreUsuario || profile?.nombreUsuario || "";
  const apellido = profile?.primerapellidoUsuario || profile?.apellidoUsuario || "";
  const cargo = profile?.position || profile?.cargo || "";
  const rawRol = profile?.rolUsuario ?? profile?.role ?? profile?.rol ?? profile?.tipo ?? "";

  const rol = String(rawRol).trim().toLowerCase();
  const isAdmin = ["admin", "director", "subdirector", "superadmin", "owner", "founder", "fundador"].includes(rol) ||
    profile?.isAdmin === true ||
    (Array.isArray(profile?.permisos) && profile.permisos.some(p => String(p).trim().toLowerCase() === "admin"));

  return (
    <aside
      className="bg-white border-end position-sticky overflow-auto"
      style={{
        width: '280px',
        minWidth: '280px',
        height: "calc(100vh - 64px)",
        top: 64
      }}
    >
      <div className="p-3">
        {/* User Info Card */}
        <div
          className="rounded-4 p-3 mb-3 border"
          style={{ background: "linear-gradient(135deg,#eff6ff,#fffbeb)", borderColor: "rgba(59,130,246,.25)" }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
              style={{ width: 48, height: 48, background: "linear-gradient(135deg,#60a5fa,#fbbf24)" }}
            >
              {profile?.fotoPerfil ? (
                <img
                  src={`http://localhost:3001${profile.fotoPerfil}?t=${new Date().getTime()}`}
                  alt={nombre || "Avatar"}
                  className="w-100 h-100 object-fit-cover"
                />
              ) : (
                <UserIcon size={24} className="text-white" />
              )}
            </div>
            <div className="flex-grow-1 min-w-0">
              <h3 className="fw-semibold text-dark mb-0 text-truncate" style={{ fontSize: 16 }}>
                {loadingUser ? "Cargando..." : `${nombre} ${apellido}`.trim() || "Invitado"}
              </h3>
              <div className="small text-primary text-capitalize text-truncate">
                {loadingUser ? "" : rol || "Usuario"}
              </div>
              {error && <div className="mt-1 text-danger" style={{ fontSize: 12 }}>{error}</div>}
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="d-grid gap-1">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const isActive = current === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => navigate(`/${id}`)}
                className={`btn d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-start ${isActive
                  ? "btn-light border border-primary-subtle text-primary active"
                  : "btn-white text-body-secondary"
                  }`}
                style={{ fontSize: '14px' }}
              >
                <Icon size={18} className={isActive ? "text-primary" : "text-secondary"} />
                <span className="fw-medium text-truncate">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Admin Section */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-top">
            <div className="text-uppercase text-secondary fw-semibold small mb-2">Administración</div>
            <nav className="d-grid gap-2">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className={`btn d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-start ${(location.pathname.split("/")[1] || "") === "admin"
                  ? "btn-light border border-warning-subtle text-warning"
                  : "btn-white text-body-secondary"
                  }`}
              >
                <Settings size={20}
                  className={(location.pathname.split("/")[1] || "") === "admin" ? "text-warning" : "text-secondary"} />
                <span className="fw-medium text-body">Administración</span>
              </button>
            </nav>
          </div>
        )}

        {/* Hierarchy Info */}
        <div className="mt-4 p-3 bg-body-tertiary rounded-3">
          <div className="fw-semibold text-dark small mb-1">Ubicación</div>
          <div className="text-secondary small">
            {loadingUser ? "—" : `${profile?.country || profile?.pais || ""}, ${profile?.city || profile?.ciudad || ""}`}
          </div>
          <div className="text-body-secondary text-capitalize small mt-1">
            {profile?.hierarchy_level ? `Nivel ${profile?.hierarchy_level}` : ""}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;