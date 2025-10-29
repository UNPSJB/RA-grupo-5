import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useReportes } from "../hook/useReportes";
import { useInformesCurriculares } from "../hook/useInformesCurriculares";
import { useInformeBase } from "../hook/useInformeBase";
import { useResponderInforme } from "../hook/useResponderInforme";
import LayoutReporte from "../componentes/LayoutReporte";
import { Container, Card } from "react-bootstrap";

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

  // 👇 este es el que cambiamos: ahora puede ser number o "" mientras se edita
  const [cicloLectivo, setCicloLectivo] = useState<number | "">("");

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

        // ciclo_lectivo debería ser un año (número).
        // Si viene del backend como string o number, normalizamos:
        if (
          asignatura?.ciclo_lectivo === 0 ||
          asignatura?.ciclo_lectivo === "" ||
          asignatura?.ciclo_lectivo === undefined ||
          asignatura?.ciclo_lectivo === null
        ) {
          setCicloLectivo("");
        } else {
          setCicloLectivo(Number(asignatura.ciclo_lectivo));
        }
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
          ciclo_lectivo: Number(cicloLectivo),
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
        // TODO: reemplazar esto cuando tengas auth real
        const idDocente = 1;

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
  // Renderizado
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
      <h2>Informe de Actividad Curricular</h2>

      <LayoutReporte
        asignatura={asignatura.nombre}
        anio={asignatura.año}
        docente={asignatura.nombre_docente}
        carrera={asignatura.carrera}
      >
        <Container className="mt-5">
          {/* FORMULARIO */}
          <form onSubmit={handleSubmit}>
            {/* Datos administrativos que van en InformeAsignatura */}
            <Card
              className="shadow-sm p-4 mb-4 border-0"
              style={{ fontSize: "0.95rem", borderRadius: "0.75rem" }}
            >
              <h5 className="mb-3 fw-semibold text-secondary">
                Datos de su informe
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Fecha inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Fecha fin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Estado</label>
                  <select
                    className="form-select"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="abierto">Abierto</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Sede</label>
                  <input
                    type="text"
                    className="form-control"
                    value={sede}
                    onChange={(e) => setSede(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Ciclo lectivo (año)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={cicloLectivo}
                    onChange={(e) =>
                      setCicloLectivo(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    min={2000}
                    placeholder="2025"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Docente responsable
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={docente}
                    onChange={(e) => setDocente(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Cant. alumnos inscriptos
                  </label>
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
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Cant. comisiones teóricas
                  </label>
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
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Cant. comisiones prácticas
                  </label>
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
                </div>
              </div>
            </Card>

            {/* Preguntas dinámicas de la plantilla */}
            <div className="mb-4">
              <h5>Desarrollo del cursado</h5>

              {informeBase.preguntas?.map((pregunta: any) => {
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
        </Container>
      </LayoutReporte>
    </div>
  );
}
