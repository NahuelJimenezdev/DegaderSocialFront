// App.jsx
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";

import Login  from "./auth/Login";
import Sidebar from "./components/layout/Sidebar";
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

function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-3">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/feed" replace />} />
          <Route path="/feed" element={<Home />} />
          <Route path="/friends" element={<AmigosUser />} />
          <Route path="/groups" element={<GruposUser />} />
          <Route path="/meetings" element={<Reuniones />} />
          <Route path="/messages" element={<Mensajes />} />
          <Route path="/perfilUser" element={<PerfilUser />} />
          <Route path="/files" element={<CarpetasUser />} />            
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/busqueda" element={<Busqueda />} />
          <Route path="/perfil/:id" element={<PerfilVisitante />} />
        </Route>
      </Routes>
  );
}

export default App;