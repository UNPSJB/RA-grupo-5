import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResponderEncuesta } from "../hook/useResponderEncuesta";
import Variable from "../componentes/Variable";
import {
  construirEsquemaEncuesta,
  construirValoresPorDefecto,
} from "../validaciones/Encuesta";

import { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import "../styles/encuesta.css";

type SurveyFormData = Record<string, any>;

function ResponderEncuesta() {
  const { id } = useParams<{ id: string }>();
  const idEncuesta = id ? Number(id) : null;

  const { encuesta, asignatura, loading, error, guardarRespuestas } =
    useResponderEncuesta(idEncuesta);

  const defaultValues = encuesta ? construirValoresPorDefecto(encuesta) : {};
  const schema = encuesta ? construirEsquemaEncuesta(encuesta) : undefined;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SurveyFormData>({
    defaultValues,
    resolver: schema ? zodResolver(schema) : undefined,
  });

  const navigate = useNavigate();

  // ---- Alert local (usa estilos de Encuesta.css) ----
  const [alert, setAlert] = useState<{
    show: boolean;
    exiting: boolean;
    variant: "success" | "danger" | "warning" | "info";
    message: string;
  }>({ show: false, exiting: false, variant: "success", message: "" });

  // Autocierre: tras 2.5s marca "exiting" (dispara la animación CSS)
  useEffect(() => {
    if (!alert.show || alert.exiting) return;
    const t = setTimeout(() => {
      setAlert((a) => ({ ...a, exiting: true, show: false }));
    }, 2500);
    return () => clearTimeout(t);
  }, [alert.show, alert.exiting]);

  // Al terminar la animación (0.5s en CSS), limpiar estado y redirigir si fue éxito
  useEffect(() => {
    if (!alert.exiting) return;
    const t = setTimeout(() => {
      const go = alert.variant === "success";
      setAlert({
        show: false,
        exiting: false,
        variant: "success",
        message: "",
      });
      if (go) navigate("/alumno");
    }, 500); // coincide con la duración de slideUp/slideDown del CSS
    return () => clearTimeout(t);
  }, [alert.exiting, alert.variant, navigate]);

  // ---- Submit ----
  const onSubmit = async (data: SurveyFormData) => {
    try {
      const idPersona = 1; // TODO: usar el id real del usuario autenticado
      const resultado = await guardarRespuestas(idPersona, data);

      // Normalizamos: si es objeto y trae ok=false => error; si no trae ok, usamos truthiness
      const ok =
        typeof resultado === "object" ? resultado?.ok !== false : !!resultado;

      if (ok) {
        setAlert({
          show: true,
          exiting: false,
          variant: "success",
          message: "¡Encuesta guardada con éxito! ✔",
        });
      } else {
        setAlert({
          show: true,
          exiting: false,
          variant: "danger",
          message:
            resultado?.detail || "No se pudieron guardar las respuestas.",
        });
      }
    } catch (err: any) {
      console.error(err);
      setAlert({
        show: true,
        exiting: false,
        variant: "danger",
        message: err?.message || "Ocurrió un error inesperado.",
      });
    }
  };

  const [firstLoadDone, setFirstLoadDone] = useState(false);

  useEffect(() => {
    if (!firstLoadDone && !loading && encuesta) {
      setFirstLoadDone(true);
    }
  }, [firstLoadDone, loading, encuesta]);

  // 👇 reemplazá el if antiguo por este
  if (!firstLoadDone) {
    if (loading) {
      return <div className="container mt-4">Cargando encuesta... ⏳</div>;
    }
    if (error) {
      return <div className="container mt-4 text-danger">Error: {error}</div>;
    }
    if (!encuesta) {
      return <div className="container mt-4">No se encontró la encuesta.</div>;
    }
  }
  if (!encuesta) {
    return null;
  }

  return (
    <div className="container mt-4">
      {/* ALERT GLOBAL (flotante con clases CSS locales) */}
      {(alert.show || alert.exiting) && (
        <div
          className={`alert-float ${
            alert.exiting ? "alert-float-hide" : "alert-float-show"
          }`}
        >
          <Alert
            show={alert.show}
            variant={alert.variant}
            dismissible
            transition={false}
            onClose={() =>
              setAlert((a) => ({ ...a, exiting: true, show: false }))
            }
            className="shadow-lg"
          >
            {alert.message}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <div className="alert alert-danger">Error: {error}</div>}

        <h1>{encuesta.nombre}</h1>
        <h2>{asignatura?.nombre}</h2>

        {encuesta.variables.map((variable) => (
          <Variable
            key={variable.id}
            variable={variable}
            control={control}
            errors={errors}
          />
        ))}

        {Object.keys(errors).length > 0 && (
          <div className="alert alert-warning mt-4">
            Debes completar <b>{Object.keys(errors).length}</b> preguntas
            obligatorias.
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? "Guardando..." : "Guardar Respuestas"}
        </button>
      </form>
    </div>
  );
}

export default ResponderEncuesta;
