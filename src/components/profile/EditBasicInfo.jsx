import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { basicInfoSchema } from "../../schemas/profileSchemas";
import { apiFetch } from "../../lib/api";

export function EditBasicInfo({ initial, version, onSaved }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: { ...initial },
  });

  const onSubmit = async (values) => {
    const body = { ...values, version };
    const { data } = await apiFetch("http://localhost:3001/api/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    onSaved?.(data.usuario);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-2">
      <div>
        <label className="form-label">Nombre</label>
        <input className="form-control" {...register("primernombreUsuario")} />
        {errors.primernombreUsuario && (
          <small className="text-danger">
            {errors.primernombreUsuario.message}
          </small>
        )}
      </div>

      <div>
        <label className="form-label">Apellido</label>
        <input className="form-control" {...register("primerapellidoUsuario")} />
        {errors.primerapellidoUsuario && (
          <small className="text-danger">
            {errors.primerapellidoUsuario.message}
          </small>
        )}
      </div>

      <button className="btn btn-primary" disabled={!isDirty || isSubmitting}>
        {isSubmitting ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
