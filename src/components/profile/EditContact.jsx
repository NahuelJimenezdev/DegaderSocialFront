// src/components/profile/EditContact.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "../../schemas/profileSchemas.js";
import { apiFetch } from "../../lib/api.js";

function EditContact({ initial, version, onSaved }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      ciudadUsuario: initial?.ciudadUsuario || "",
      paisUsuario: initial?.paisUsuario || "",
      direccionUsuario: initial?.direccionUsuario || "",
    },
  });

  const onSubmit = async (values) => {
    console.log('🔄 [EditContact] Enviando datos:', values);
    console.log('🔢 [EditContact] Versión actual:', version);

    // trim de strings para guardar limpio
    const cleaned = Object.fromEntries(
      Object.entries(values).map(([k, v]) =>
        typeof v === "string" ? [k, v.trim()] : [k, v]
      )
    );

    const body = { ...cleaned, version };
    console.log('📦 [EditContact] Body a enviar:', body);

    try {
      const { data } = await apiFetch("http://localhost:3001/api/me", {
        method: "PATCH",
        body: JSON.stringify(body),
      });

      console.log('✅ [EditContact] Respuesta exitosa:', data);

      // resetea el formulario con los valores guardados para limpiar "dirty"
      reset({
        ciudadUsuario: data.usuario.ciudadUsuario || "",
        paisUsuario: data.usuario.paisUsuario || "",
        direccionUsuario: data.usuario.direccionUsuario || "",
      });

      onSaved?.(data.usuario);
    } catch (error) {
      console.error('❌ [EditContact] Error:', error);
      throw error; // Re-lanzar para que se maneje en el UI
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3">
      <div>
        <label className="form-label">Ciudad</label>
        <input
          className="form-control"
          placeholder="Ej: Cúcuta"
          {...register("ciudadUsuario")}
        />
        {errors.ciudadUsuario && (
          <small className="text-danger">{errors.ciudadUsuario.message}</small>
        )}
      </div>

      <div>
        <label className="form-label">País</label>
        <input
          className="form-control"
          placeholder="Ej: Colombia"
          {...register("paisUsuario")}
        />
        {errors.paisUsuario && (
          <small className="text-danger">{errors.paisUsuario.message}</small>
        )}
      </div>

      <div>
        <label className="form-label">Dirección</label>
        <input
          className="form-control"
          placeholder="Ej: Barrio Santa Lucía"
          {...register("direccionUsuario")}
        />
        {errors.direccionUsuario && (
          <small className="text-danger">{errors.direccionUsuario.message}</small>
        )}
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() =>
            reset({
              ciudadUsuario: initial?.ciudadUsuario || "",
              paisUsuario: initial?.paisUsuario || "",
              direccionUsuario: initial?.direccionUsuario || "",
            })
          }
          disabled={isSubmitting}
        >
          Deshacer cambios
        </button>
      </div>
    </form>
  );
}

export default EditContact;