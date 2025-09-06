import { useState } from "react";
import { EditBasicInfo } from "./EditBasicInfo";
import EditContact from "./EditContact";
import { EditAvatar } from "./EditAvatar";
import { EditBio } from "./EditBio";
import { EditPrivacy } from "./EditPrivacy";
// (Puedes agregar aquí los otros: EditContact, EditBio, EditAvatar, EditPrivacy)

export function EditProfileModal({ open, onClose, user, onUserUpdate }) {
  const [tab, setTab] = useState("Nombre Usuario"); // "Nombre Usuario" | "Contacto" | "Biografía" | "Perfil" | "Privacidad"

  if (!open) return null;

  return (
    <>
      <div className="modal show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Perfil</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <ul className="nav nav-tabs mb-3">
                {["Nombre Usuario", "Contacto", "Biografía", "Perfil", "Privacidad"].map((t) => (
                  <li className="nav-item" key={t}>
                    <button
                      className={`nav-link ${tab === t ? "active" : ""}`}
                      onClick={() => setTab(t)}
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>

              {tab === "Nombre Usuario" && (
                <EditBasicInfo
                  initial={{
                    primernombreUsuario: user.primernombreUsuario,
                    primerapellidoUsuario: user.primerapellidoUsuario,
                  }}
                  version={user.version}
                  onSaved={onUserUpdate}
                />
              )}
              {tab === "Contacto" && (
                <EditContact
                  initial={{
                    ciudadUsuario: user.ciudadUsuario,
                    paisUsuario: user.paisUsuario,
                    direccionUsuario: user.direccionUsuario,
                  }}
                  version={user.version}
                  onSaved={onUserUpdate}
                />
              )}
              {tab === "Biografía" && (
                <EditBio
                  initial={{ biografia: user.biografia }}
                  version={user.version}
                  onSaved={onUserUpdate}
                />)}
              {tab === "Perfil" && (<EditAvatar
                currentAvatar={user.fotoPerfil}   // opcional, para mostrar el actual
                onSaved={onUserUpdate}
                onUserUpdate={onUserUpdate}
              />)}
              {tab === "Privacidad" && (
                <EditPrivacy
                  initial={{ preferencias: user.preferencias }}
                  version={user.version}
                  onSaved={onUserUpdate}
              />)}

            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" onClick={onClose} />
    </>
  );
}
