// App.jsx
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import "./App.css";

import Login from "./auth/Login";
import Sidebar from "./components/layout/Sidebar";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import Home from "./pages/Home";
import PerfilUser from "./pages/PerfilUser";
import AmigosUser from "./pages/AmigosUser";
import GruposUser from "./pages/GruposUser";
import Reuniones from "./pages/Reuniones";
import Mensajes from "./pages/Mensajes";
import CarpetasUser from "./pages/CarpetasUser";
import AdminDashboard from "./pages/AdminDashboard";
import Busqueda from "./pages/Busqueda";
import PerfilVisitante from "./pages/PerfilVisitante";
import SolicitudesPendientes from "./components/solicitudesPendientes/SolicitudesPendientes";
import GestionRoles from "./pages/admin/GestionRoles";
import PruebaContactos from "./components/debug/PruebaContactos";

function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="d-flex flex-grow-1">
        {/* Sidebar - Solo visible en desktop */}
        <div className="d-none d-lg-block">
          <Sidebar />
        </div>

        {/* Contenido principal */}
        <main className="flex-grow-1 p-2 p-md-3" style={{ paddingBottom: '80px' }}>
          <div className="container-fluid">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Navegación inferior - Solo visible en móvil */}
      <div className="d-lg-none">
        <MobileBottomNav />
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" replace />} />
        <Route path="/feed" element={<Home />} />
        <Route path="/busqueda" element={<Busqueda />} />
        <Route path="/groups" element={<GruposUser />} />
        <Route path="/messages" element={<Mensajes />} />
        <Route path="/files" element={<CarpetasUser />} />
        <Route path="/friends" element={<AmigosUser />} />
        <Route path="/meetings" element={<Reuniones />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/roles" element={<GestionRoles />} />
        <Route path="/debug/contactos" element={<PruebaContactos />} />
        <Route path="/perfilUser" element={<PerfilUser />} />
        <Route path="/perfil/:id" element={<PerfilVisitante />} />
        <Route path="/solicitudes" element={<SolicitudesPendientes />} />
      </Route>
    </Routes>
  );
}

export default App;