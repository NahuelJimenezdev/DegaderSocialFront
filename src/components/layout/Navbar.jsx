// src/components/Layout/Navbar.jsx
import React from "react";
import { Search, Bell, Users, Calendar } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import UserMenu from "../userMenu/UserMenu";
import { useProfile } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/SearchBar";
import NotificacionesBell from "../notificacionesBell/NotificacionesBell";
import ChatBell from "../notificacionesBell/ChatBell";

export function Navbar() {
  const { profile, loading, clearProfile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    clearProfile();
    navigate('/login')
  }

  return (
    <nav className="navbar bg-white shadow-sm border-bottom sticky-top" style={{ zIndex: 9999 }}>
      <div className="container-fluid px-2 px-md-3">
        <div className="d-flex align-items-center justify-content-between w-100" style={{ minHeight: 64 }}>
          {/* Logo */}
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center justify-content-center rounded-circle gradient-bubble" style={{ width: 40, height: 40 }}>
              <img
                src="/DegaderSocial.png"
                alt="Degader Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              />
            </div>
            <div className="d-none d-sm-block lh-1">
              <h1 className="h5 m-0 gradient-text fw-bold">Sol &amp; Luna</h1>
              <small className="text-secondary">Fundación Humanitaria</small>
            </div>
          </div>

          {/* Search - Solo visible en tablet y desktop */}
          <div className="d-none d-md-block flex-grow-1 mx-3">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="d-flex align-items-center gap-1 gap-md-2">
            {/* Amigos - Solo en desktop */}
            <button
              className="btn btn-light p-2 rounded-circle d-none d-lg-flex"
              onClick={() => navigate('/friends')}
              title="Amigos"
            >
              <Users size={20} className="text-secondary" />
            </button>

            {/* Reuniones - Solo en desktop */}
            <button
              className="btn btn-light p-2 rounded-circle d-none d-lg-flex"
              onClick={() => navigate('/meetings')}
              title="Reuniones"
            >
              <Calendar size={20} className="text-secondary" />
            </button>

            {/* Notificaciones generales (sin mensajes) */}
            <NotificacionesBell />

            {/* Mensajes (contador y dropdown) */}
            <ChatBell />

            {/* User menu */}
            <UserMenu
              user={profile}
              loading={loading}
              handleSignOut={handleSignOut}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}