// src/pages/InformeCurricular.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

import { useReportes } from "../hook/useReportes";
import { useInformesCurriculares } from "../hook/useInformesCurriculares";
import { useInformeBase } from "../hook/useInformeBase";
import { useResponderInforme } from "../hook/useResponderInforme";

export default function InformeCurricular() {
  // 1. ID del reporte que eligió el docente en la pantalla anterior
  const { reporteId } = useParams();

  // 2. Hooks para hablar con la API
  const { fetchReporteById } = useReportes();
  const { crearInformeCurricular } = useInformesCurriculares();
  const { fetchInformeBaseActual } = useInformeBase();

  // Hook para manejar respuestas libres del docente
  const {
    answersByPreguntaOpcion,
    setTextoRespuesta,
    guardarRespuestasInforme,
  } = useResponderInforme();

  // 3. Estados para datos precargados
  const [reporte, setReporte] = useState<any>(null);
  const [loadingReporte, setLoadingReporte] = useState(true);
  const [errorReporte, setErrorReporte] = useState<string | null>(null);

  const [informeBase, setInformeBase] = useState<any>(null);
  const [loadingBase, setLoadingBase] = useState(true);
  const [errorBase, setErrorBase] = useState<string | null>(null);

  // 4. Estados para los campos administrativos del informe_asignatura
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState("abierto");

  const [sede, setSede] = useState("");
  const [cicloLectivo, setCicloLectivo] = useState("");
  const [docente, setDocente] = useState("");

  const [cantInscriptos, setCantInscriptos] = useState<number | "">("");
  const [cantTeoricas, setCantTeoricas] = useState<number | "">("");
  const [cantPracticas, setCantPracticas] = useState<number | "">("");

  // 5. Feedback de guardado
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);

  // ------------------------
  // Carga inicial: Reporte
  // ------------------------
  useEffect(() => {
    async function cargarReporte() {
      if (!reporteId) {
        setErrorReporte("Falta reporteId en la URL");
        setLoadingReporte(false);
        return;
      }

      try {
        const data = await fetchReporteById(reporteId);
        setReporte(data);

        const asignatura = data.encuesta_asignatura?.asignatura;
        setSede(asignatura?.sede || "");
        setDocente(asignatura?.nombre_docente || "");
        setCicloLectivo(asignatura?.ciclo_lectivo || "");
      } catch (err) {
        setErrorReporte("Error cargando el reporte.");
      } finally {
        setLoadingReporte(false);
      }
    }

    cargarReporte();
  }, [reporteId, fetchReporteById]);

  // ------------------------
  // Carga inicial: InformeBase (plantilla vigente)
  // ------------------------
  useEffect(() => {
    async function cargarInformeBase() {
      try {
        const base = await fetchInformeBaseActual();
        // IMPORTANTE:
        // base.preguntas[i] DEBE traer también las opciones (pregunta_opcion)
        // para cada pregunta. Al menos una pregunta_opcion por pregunta,
        // y cada pregunta_opcion debe tener su `id`.
        //
        // Ej:
        // {
        //   id: 10,
        //   texto_pregunta: "...",
        //   pregunta_opcion: [
        //     { id: 999, id_pregunta: 10, id_opcion_respuesta: null }
        //   ]
        // }
        setInformeBase(base);
      } catch (err) {
        setErrorBase("Error cargando la plantilla del informe.");
      } finally {
        setLoadingBase(false);
      }
    }

    cargarInformeBase();
  }, [fetchInformeBaseActual]);

  // ------------------------
  // Submit del formulario
  // ------------------------
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!reporte || !informeBase) return;

      setSaving(true);
      setSaveError(null);
      setSaveOk(false);

      try {
        // 1. Armamos la "cabecera" del informe_asignatura
        const asignatura = reporte.encuesta_asignatura?.asignatura;
        const id_asignatura =
          asignatura?.id ||
          asignatura?.id_asignatura ||
          asignatura?.idAsignatura;

        const payloadCabecera = {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          estado: estado,

          sede: sede,
          ciclo_lectivo: cicloLectivo,
          docente: docente,

          cant_alumnos_insc: cantInscriptos === "" ? 0 : Number(cantInscriptos),
          cant_comisiones_teoricas:
            cantTeoricas === "" ? 0 : Number(cantTeoricas),
          cant_comisiones_practicas:
            cantPracticas === "" ? 0 : Number(cantPracticas),

          id_informe_base: informeBase.id,
          id_asignatura: id_asignatura,
          id_reporte: Number(reporteId),
        };

        // 2. Creamos el informe_asignatura en backend
        const informeCreado = await crearInformeCurricular(payloadCabecera);
        // informeCreado.id = id_informe_asignatura que vamos a usar abajo

        // 3. Guardamos las respuestas abiertas del docente
        // Necesitamos el id_persona (docente actual).
        // Por ahora, hasta que tengas auth, lo dejamos fijo.
        const idDocente = 1; // TODO: reemplazar con el ID real del docente logueado

        await guardarRespuestasInforme(idDocente, informeCreado.id);

        setSaveOk(true);
      } catch (err) {
        console.error(err);
        setSaveError("No se pudo guardar el informe curricular.");
      } finally {
        setSaving(false);
      }
    },
    [
      reporte,
      informeBase,
      fechaInicio,
      fechaFin,
      estado,
      sede,
      cicloLectivo,
      docente,
      cantInscriptos,
      cantTeoricas,
      cantPracticas,
      reporteId,
      crearInformeCurricular,
      guardarRespuestasInforme,
    ]
  );

  // ------------------------
  // Render
  // ------------------------
  if (loadingReporte || loadingBase) {
    return <div className="container mt-4">Cargando...</div>;
  }

  if (errorReporte) {
    return <div className="container mt-4 text-danger">{errorReporte}</div>;
  }
  if (errorBase) {
    return <div className="container mt-4 text-danger">{errorBase}</div>;
  }
  if (!reporte) {
    return <div className="container mt-4">No hay datos del reporte.</div>;
  }
  if (!informeBase) {
    return (
      <div className="container mt-4">
        No hay plantilla de Informe Base disponible.
      </div>
    );
  }

  const asignatura = reporte.encuesta_asignatura?.asignatura || {};

  return (
    <div className="container mt-4">
      <h2>Informe Curricular</h2>

      {/* CONTEXTO DE LA ASIGNATURA / REPORTE */}
      <div className="alert alert-secondary">
        <p>
          <strong>Asignatura:</strong> {asignatura.nombre}
        </p>
        <p>
          <strong>Carrera:</strong> {asignatura.carrera}
        </p>
        <p>
          <strong>Año:</strong> {asignatura.año}
        </p>
        <p>
          <strong>Cursado:</strong> {asignatura.cursado}
        </p>
        <p>
          <strong>Docente según reporte:</strong> {asignatura.nombre_docente}
        </p>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit}>
        {/* Datos administrativos que van en InformeAsignatura */}
        <div className="mb-3">
          <label className="form-label">
            Fecha inicio
            <input
              type="date"
              className="form-control"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Fecha fin
            <input
              type="date"
              className="form-control"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Estado
            <select
              className="form-select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="abierto">abierto</option>
              <option value="cerrado">cerrado</option>
            </select>
          </label>
        </div>

        <div className="row">
          <div className="mb-3 col-md-4">
            <label className="form-label">
              Sede
              <input
                type="text"
                className="form-control"
                value={sede}
                onChange={(e) => setSede(e.target.value)}
              />
            </label>
          </div>

          <div className="mb-3 col-md-4">
            <label className="form-label">
              Ciclo lectivo
              <input
                type="text"
                className="form-control"
                value={cicloLectivo}
                onChange={(e) => setCicloLectivo(e.target.value)}
                placeholder="2025 - 1er cuatrimestre"
              />
            </label>
          </div>

          <div className="mb-3 col-md-4">
            <label className="form-label">
              Docente responsable
              <input
                type="text"
                className="form-control"
                value={docente}
                onChange={(e) => setDocente(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="row">
          <div className="mb-3 col-md-4">
            <label className="form-label">
              Cant. alumnos inscriptos
              <input
                type="number"
                className="form-control"
                value={cantInscriptos}
                onChange={(e) =>
                  setCantInscriptos(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                min={0}
              />
            </label>
          </div>

          <div className="mb-3 col-md-4">
            <label className="form-label">
              Cant. comisiones teóricas
              <input
                type="number"
                className="form-control"
                value={cantTeoricas}
                onChange={(e) =>
                  setCantTeoricas(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                min={0}
              />
            </label>
          </div>

          <div className="mb-3 col-md-4">
            <label className="form-label">
              Cant. comisiones prácticas
              <input
                type="number"
                className="form-control"
                value={cantPracticas}
                onChange={(e) =>
                  setCantPracticas(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                min={0}
              />
            </label>
          </div>
        </div>

        {/* Preguntas dinámicas de la plantilla */}
        <div className="mb-4">
          <h5>Desarrollo del cursado</h5>

          {informeBase.preguntas?.map((pregunta: any) => {
            // IMPORTANTE:
            // necesitamos el id_pregunta_opcion que corresponde a la respuesta abierta.
            // asumimos que la primera opción es la abierta.
            const primeraOpcion = pregunta.pregunta_opcion?.[0];
            const idPreguntaOpcion = primeraOpcion?.id;

            return (
              <div
                className="mb-3"
                key={idPreguntaOpcion ?? pregunta.id ?? Math.random()}
              >
                <label className="form-label">
                  {pregunta.texto_pregunta ?? pregunta.texto ?? "Pregunta"}
                  <textarea
                    className="form-control"
                    style={{ minHeight: "80px" }}
                    value={
                      idPreguntaOpcion
                        ? answersByPreguntaOpcion[idPreguntaOpcion] ?? ""
                        : ""
                    }
                    onChange={(e) => {
                      if (idPreguntaOpcion) {
                        setTextoRespuesta(idPreguntaOpcion, e.target.value);
                      }
                    }}
                  />
                </label>
              </div>
            );
          })}
        </div>

        {saveError && <div className="text-danger mb-3">{saveError}</div>}

        {saveOk && (
          <div className="text-success mb-3">
            Informe guardado correctamente ✔
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando..." : "Guardar Informe"}
        </button>
      </form>
    </div>
  );
}
