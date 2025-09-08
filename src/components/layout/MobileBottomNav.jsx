// src/components/layout/MobileBottomNav.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Calendar, Folder, MessageCircle, User } from "lucide-react";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const current = (location.pathname.split("/")[1] || "feed").toLowerCase();

  const navItems = [
    { id: "feed", icon: Home, label: "Inicio" },
    { id: "meetings", icon: Calendar, label: "Reuniones" },
    { id: "files", icon: Folder, label: "Carpetas" },
    { id: "messages", icon: MessageCircle, label: "Mensajes" },
    { id: "perfilUser", icon: User, label: "Perfil" }
  ];

  return (
    <div
      className="bg-white border-top shadow-lg d-flex justify-content-around align-items-center position-fixed bottom-0 start-0 end-0"
      style={{ height: '70px', zIndex: 1040 }}
    >
      {navItems.map(({ id, icon: Icon, label }) => {
        const isActive = current === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => navigate(`/${id}`)}
            className={`btn d-flex flex-column align-items-center justify-content-center p-2 border-0 ${isActive ? 'text-primary' : 'text-secondary'
              }`}
            style={{
              background: 'transparent',
              minWidth: '60px',
              height: '60px'
            }}
          >
            <Icon
              size={24}
              className={isActive ? 'text-primary' : 'text-secondary'}
            />
            <small
              className={`mt-1 ${isActive ? 'text-primary fw-semibold' : 'text-secondary'}`}
              style={{ fontSize: '10px', lineHeight: 1 }}
            >
              {label}
            </small>
          </button>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
