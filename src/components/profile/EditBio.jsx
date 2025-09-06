// src/components/profile/EditBio.jsx
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bioSchema } from "../../schemas/profileSchemas.js";
import { apiFetch } from "../../lib/api.js";

const MAX = 1000;

export function EditBio({ initial, version, onSaved }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(bioSchema),
    defaultValues: {
      biografia: initial?.biografia || "",
    },
  });

  const bioValue = useWatch({ control, name: "biografia" }) || "";
  const count = bioValue.length;

  const onSubmit = async (values) => {
    const cleaned = {
      biografia: (values.biografia || "").trim(),
    };

    const { data } = await apiFetch("http://localhost:3001/api/me", {
      method: "PATCH",
      body: JSON.stringify({ ...cleaned, version }),
    });

    // resetea con lo que guardó el backend (limpia “dirty”)
    reset({ biografia: data.usuario.biografia || "" });
    onSaved?.(data.usuario);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3">
      <div>
        <label className="form-label">Biografía</label>
        <textarea
          rows={6}
          className="form-control"
          placeholder="Contanos sobre vos (máx 1000 caracteres)…"
          maxLength={MAX}
          {...register("biografia")}
        />
        <div className="d-flex justify-content-between mt-1">
          <small className="text-secondary">{count}/{MAX}</small>
          {errors.biografia && (
            <small className="text-danger">{errors.biografia.message}</small>
          )}
        </div>
        <small className="text-secondary d-block mt-1">
          Podés dejarla vacía si no querés mostrar una biografía.
        </small>
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => reset({ biografia: initial?.biografia || "" })}
          disabled={isSubmitting}
        >
          Deshacer cambios
        </button>
        <button
          type="button"
          className="btn btn-outline-danger ms-auto"
          onClick={() => reset({ biografia: "" })}
          disabled={isSubmitting}
          title="Vaciar biografía"
        >
          Vaciar
        </button>
      </div>
    </form>
  );
}
