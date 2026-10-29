import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useReportes } from "../hook/useReportes";
import apiFetch from "../api/client";
import { useEffect, useState, useMemo } from "react"; 
import { useParams, Link } from "react-router-dom";
import {EncabezadoReporte } from "../componentes/LayoutEncabezados";
import ResumenVariable from "../componentes/ResumenVariable";
import EmptyState from "../componentes/EmptyState";
import "../styles/Resumen-reporte.css"; 

const esVariableIA = (codigo?: string) =>
  (codigo ?? "").toString().toUpperCase() === "H";

// La variable H (Inteligencia Artificial) debe mostrarse siempre al final.
const ordenarEntradasVariables = (entradas: [string, any][]) =>
  [...entradas].sort(([, a], [, b]) => {
    const aEsIA = esVariableIA(a?.codigo);
    const bEsIA = esVariableIA(b?.codigo);
    if (aEsIA === bEsIA) return 0;
    return aEsIA ? 1 : -1;
  });

export default function ResumenReporte() {
  const { id } = useParams();
  const idReporte = Number(id);
  const { fetchResumenByReporteId, fetchReporteById, loading, error } =
    useReportes();
  const [reporte, setReporte] = useState<any>(null);
  const [reporteCompleto, setReporteCompleto] = useState<any>(null);
  const [inscriptos, setInscriptos] = useState<number | null>(null);
  const [activeVariableKey, setActiveVariableKey] = useState<string | null>(
    null
  );


  useEffect(() => {
    if (!isNaN(idReporte)) {
      const cargarResumen = async () => {
        const data = await fetchResumenByReporteId(idReporte);
        setReporte(data);
        if (data && data.resultados_por_pregunta && !activeVariableKey) {
          const firstKey = ordenarEntradasVariables(
            Object.entries(data.resultados_por_pregunta)
          )[0]?.[0];
          if (firstKey) {
            setActiveVariableKey(firstKey);
          }
        }
      };
      cargarResumen();
    }
  }, [idReporte, fetchResumenByReporteId, activeVariableKey]);

  useEffect(() => {
    const cargarReporte = async () => {
      const data = await fetchReporteById(idReporte);
      if (data) {
        setReporteCompleto(data);

        // Los inscriptos provienen del informe curricular asociado al reporte.
        if (data.informe_id) {
          const resInforme = await apiFetch(`/informes-asignaturas/${data.informe_id}`);
          if (resInforme.ok) {
            const informe = await resInforme.json();
            const cant = Number(informe?.cant_alumnos_insc);
            setInscriptos(Number.isFinite(cant) && cant >= 0 ? cant : null);
          }
        }
      }
    };
    cargarReporte();
  }, [idReporte, fetchReporteById]);

  // --- 2. ¡CORRECCIÓN! MOVEMOS useMemo AQUÍ ---
  // Lo ponemos ANTES de los 'return' condicionales
  const tabsData = useMemo(() => {
    if (!reporte || !reporte.resultados_por_pregunta) {
      return [];
    }
    return ordenarEntradasVariables(
      Object.entries(reporte.resultados_por_pregunta)
    ).map(
      ([nombreVariable, variableData]: [string, any]) => ({
        key: nombreVariable,
        title: nombreVariable,
        cod: variableData.codigo,
        content: (
          <div>
            {variableData.preguntas.map((pregunta: any, j: number) => (
              <div key={j} className={j > 0 ? "pregunta-block mt-2" : "pt-2"}>
                <h6 className="fw-bold mb-3">
                  {pregunta.pregunta_texto}
                </h6>
                {pregunta.opciones.map((opcion: any, k: number) => (
                  <div key={k} className="mb-3"> 
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-muted">{opcion.opcion_texto}</span>
                      <span className="fw-bold small">{opcion.porcentaje}%</span>
                    </div>
                    <ProgressBar
                      now={opcion.porcentaje}
                      label={`${opcion.porcentaje}%`}
                      variant="primary" 
                      className="progress-compact progress-animated"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ),
      })
    );
  }, [reporte]); 


  if (loading) return <p>Cargando resumen...</p>;
  if (error) return <p>Error: {error}</p>;
  if (
    !reporte ||
    !reporteCompleto ||
    !reporte.resultados_por_pregunta ||
    !reporte.resumen_por_variable ||
    !activeVariableKey
  ) {
    return (
      <Container className="my-4">
        <EmptyState
          icon="bi-bar-chart"
          title="Sin datos disponibles"
          message="No hay datos disponibles para generar el resumen de este reporte."
        />
      </Container>
    );
  }


  const activeVariableSummary = reporte.resumen_por_variable[activeVariableKey];
  const Datosasignatura = reporteCompleto.encuesta_asignatura.asignatura;

  return (
    <EncabezadoReporte
      asignatura={Datosasignatura.nombre}
      anio={Datosasignatura.año}
      docente={Datosasignatura.nombre_docente}
      carrera={Datosasignatura.carrera}
      ciclo_lectivo={reporteCompleto.encuesta_asignatura.ciclo_lectivo}
      anio_inicio={reporteCompleto.encuesta_asignatura.encuesta_base?.anio_inicio}
      anio_fin={reporteCompleto.encuesta_asignatura.encuesta_base?.anio_fin}
      sede={Datosasignatura.sede}
    >
      <Container className="my-4">
        <Row className="g-4">
          
          
          <Col xs={12} md={8} lg={8}>
            <Card className="border rounded shadow-sm">
              <Card.Header as="h5" className="bg-primary text-white">
                Análisis de Respuestas por Variable
              </Card.Header>
              <Card.Body className="p-4">
                <Tabs
                  id="variable-tabs"
                  activeKey={activeVariableKey}
                  onSelect={(k) => setActiveVariableKey(k || null)}
                  className="mb-3"
                  mountOnEnter
                  unmountOnExit
                >
                  {tabsData.map((tab) => (
                    <Tab key={tab.key} eventKey={tab.key} title={tab.cod}>
                      <div className="mb-4 text-center">
                        <h5 className="mb-0">
                          {tab.cod}: {tab.title}
                        </h5>
                      </div>
                      {tab.content}
                    </Tab>
                  ))}
                </Tabs>
              </Card.Body>
            </Card>
          </Col>

          
          <Col xs={12} md={4} lg={4}>
                  
            <aside className="right-rail">
              <div className="right-cta mb-3">
                {reporteCompleto?.has_respuesta ? (
                  <Link
                    to={`/docente/informes-curriculares-respondidos/${reporteCompleto.informe_id}`}
                    className="btn btn-outline-primary btn-lg w-100"
                  >
                    Ver Informe
                  </Link>
                ) : (
                  <Link
                    to={`/docente/nuevo-informe/${reporteCompleto.id}`}
                    className="btn btn-primary btn-lg w-100"
                  >
                    Nuevo Informe de Act.Curricular
                  </Link>
                )}
              </div>
              
              <Card className="border rounded shadow-sm">
                <Card.Header as="h6" className="bg-primary text-white">
                  Métricas de la Encuesta
                </Card.Header>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted fw-semibold small">
                      Total inscriptos
                    </span>
                    <span className="text-dark fw-bold">
                      {inscriptos ?? "N/D"}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted fw-semibold small">
                      Encuestas procesadas
                    </span>
                    <span className="text-primary fw-bold">
                      {reporteCompleto.encuesta_asignatura.respuestas.length}
                    </span>
                  </div>
                </Card.Body>
              </Card>
              <br />
              <Card className="border rounded shadow-sm mb-3 ">
                <Card.Header as="h6" className="bg-primary text-white">
                  Resumen de la Variable
                </Card.Header>
                <ResumenVariable resumen={activeVariableSummary} />
              </Card>
            </aside>
          </Col>
        </Row>
      </Container>
    </EncabezadoReporte>
  );
}