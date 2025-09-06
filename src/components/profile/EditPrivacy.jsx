// src/components/profile/EditPrivacy.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { privacySchema } from "../../schemas/profileSchemas.js";
import { apiFetch } from "../../lib/api.js";

export function EditPrivacy({ initial, version, onSaved }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      preferencias: {
        showEmail: !!initial?.preferencias?.showEmail,
        showLocation: !!initial?.preferencias?.showLocation,
      },
    },
  });

  const showEmail = watch("preferencias.showEmail");
  const showLocation = watch("preferencias.showLocation");

  const onSubmit = async (values) => {
    const body = {
      preferencias: {
        showEmail: !!values.preferencias?.showEmail,
        showLocation: !!values.preferencias?.showLocation,
      },
      version,
    };

    const { data } = await apiFetch("http://localhost:3001/api/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    reset({
      preferencias: {
        showEmail: !!data.usuario?.preferencias?.showEmail,
        showLocation: !!data.usuario?.preferencias?.showLocation,
      },
    });

    onSaved?.(data.usuario);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3">
      <div className="form-check form-switch">
        <input
          id="pref-show-email"
          type="checkbox"
          className="form-check-input"
          {...register("preferencias.showEmail")}
        />
        <label className="form-check-label" htmlFor="pref-show-email">
          Mostrar mi correo a otros usuarios
        </label>
        {errors?.preferencias?.showEmail && (
          <small className="text-danger d-block">
            {errors.preferencias.showEmail.message}
          </small>
        )}
        <small className="text-secondary d-block">
          Estado: {showEmail ? "visible" : "oculto"}
        </small>
      </div>

      <div className="form-check form-switch">
        <input
          id="pref-show-location"
          type="checkbox"
          className="form-check-input"
          {...register("preferencias.showLocation")}
        />
        <label className="form-check-label" htmlFor="pref-show-location">
          Mostrar mi ubicación (ciudad/país)
        </label>
        {errors?.preferencias?.showLocation && (
          <small className="text-danger d-block">
            {errors.preferencias.showLocation.message}
          </small>
        )}
        <small className="text-secondary d-block">
          Estado: {showLocation ? "visible" : "oculto"}
        </small>
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
              preferencias: {
                showEmail: !!initial?.preferencias?.showEmail,
                showLocation: !!initial?.preferencias?.showLocation,
              },
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
