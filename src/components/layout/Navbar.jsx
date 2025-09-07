// src/components/Layout/Navbar.jsx
import React from "react";
import { Search, Bell, Users, Calendar } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import UserMenu from "../userMenu/UserMenu";
import { useProfile } from "../../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/SearchBar";
import NotificacionesBell from "../notificacionesBell/NotificacionesBell";

export function Navbar() {
  const { profile, loading, clearProfile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    clearProfile();
    navigate('/login')
  }

  return (
    <nav className="navbar bg-white shadow-sm border-bottom sticky-top" style={{ zIndex: 1050 }}>
      <div className="container-xxl px-3">
        <div className="d-flex align-items-center w-100" style={{ minHeight: 64 }}>
          {/* Logo */}
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center justify-content-center rounded-circle gradient-bubble" style={{ width: 40, height: 40 }}>
              <span className="text-white fw-bold">SL</span>
            </div>
            <div className="d-none d-sm-block lh-1">
              <h1 className="h5 m-0 gradient-text fw-bold">Sol &amp; Luna</h1>
              <small className="text-secondary">Fundación Humanitaria</small>
            </div>
          </div>

          {/* Search */}
          <SearchBar />

          {/* Actions */}
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-light p-2 rounded-circle">
              <Users size={20} className="text-secondary" />
            </button>

            <button className="btn btn-light p-2 rounded-circle">
              <Calendar size={20} className="text-secondary" />
            </button>

            {/* Componente de notificaciones mejorado */}
            <NotificacionesBell />

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