from sqlalchemy.orm import Session
from sqlalchemy import func, desc, distinct, extract
from src.encuestas_asignaturas.models import EncuestaAsignatura
from src.respuestas.models import Respuesta
from src.detalle_respuesta.models import DetalleRespuesta
from src.pregunta_opcion.models import PreguntaOpcion
from src.opciones_respuesta.models import OpcionRespuesta
from src.preguntas.models import Pregunta
from src.variables.models import Variable
from src.asignaturas.models import Asignatura
from src.estadisticas.schemas import DashboardDTO

class EstadisticaService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_data(self, ciclo_lectivo: int) -> DashboardDTO:
        
        # --- 1. INDICADORES (KPIs) ---
        total_asignaturas = self.db.query(func.count(EncuestaAsignatura.id))\
            .filter(extract('year', EncuestaAsignatura.fecha_inicio) == ciclo_lectivo).scalar() or 0

        total_docentes = self.db.query(func.count(func.distinct(Asignatura.nombre_docente)))\
            .join(EncuestaAsignatura, EncuestaAsignatura.id_asignatura == Asignatura.id)\
            .filter(extract('year', EncuestaAsignatura.fecha_inicio) == ciclo_lectivo).scalar() or 0

        total_respuestas = self.db.query(func.count(Respuesta.id))\
            .join(EncuestaAsignatura)\
            .filter(extract('year', EncuestaAsignatura.fecha_inicio) == ciclo_lectivo).scalar() or 0

        # Cálculo de Satisfacción
        textos_positivos = ["Excelente", "Muy Bueno", "Bueno", "Satisfactorio", "Muy Satisfactorio", "Si"]
        textos_escala = ["Excelente", "Muy Bueno", "Bueno", "Regular", "Malo", "Insuficiente", "Satisfactorio", "No Satisfactorio", "Si", "No"]

        conteo_satisfaccion = self.db.query(
            OpcionRespuesta.texto_opcion,
            func.count(DetalleRespuesta.id)
        ).join(PreguntaOpcion, OpcionRespuesta.id == PreguntaOpcion.id_opcion_respuesta)\
         .join(DetalleRespuesta, PreguntaOpcion.id == DetalleRespuesta.id_pregunta_opcion)\
         .join(Respuesta, DetalleRespuesta.id_respuesta == Respuesta.id)\
         .join(EncuestaAsignatura, Respuesta.id_encuesta_asignatura == EncuestaAsignatura.id)\
         .filter(extract('year', EncuestaAsignatura.fecha_inicio) == ciclo_lectivo)\
         .filter(OpcionRespuesta.texto_opcion.in_(textos_escala))\
         .group_by(OpcionRespuesta.texto_opcion).all()

        total_votos_validos = 0
        total_votos_positivos = 0

        for texto, cantidad in conteo_satisfaccion:
            total_votos_validos += cantidad
            if texto in textos_positivos:
                total_votos_positivos += cantidad
        
        porcentaje_satisfaccion = 0
        if total_votos_validos > 0:
            porcentaje_satisfaccion = int((total_votos_positivos / total_votos_validos) * 100)

        indicadores = [
            {"titulo": "Asignaturas evaluadas", "valor": total_asignaturas, "bg": "primary"},
            {"titulo": "Docentes participantes", "valor": total_docentes, "bg": "info"},
            {"titulo": "Total de Respuestas", "valor": total_respuestas, "bg": "success"},
            {"titulo": "Satisfacción Global", "valor": f"{porcentaje_satisfaccion}%", "bg": "warning"},
        ]

        # --- 2. DIMENSIONES ---
        dims_query = self.db.query(
            Variable.nombre,
            func.count(DetalleRespuesta.id)
        ).join(Pregunta, Variable.id == Pregunta.id_variable)\
         .join(PreguntaOpcion, Pregunta.id == PreguntaOpcion.id_pregunta)\
         .join(DetalleRespuesta, PreguntaOpcion.id == DetalleRespuesta.id_pregunta_opcion)\
         .join(Respuesta, DetalleRespuesta.id_respuesta == Respuesta.id)\
         .join(EncuestaAsignatura, Respuesta.id_encuesta_asignatura == EncuestaAsignatura.id)\
         .filter(extract('year', EncuestaAsignatura.fecha_inicio) == ciclo_lectivo)\
         .group_by(Variable.id, Variable.nombre).all()

        total_detalles = sum([x[1] for x in dims_query]) or 1
        dimensiones = []
        for nombre, cantidad in dims_query:
            porcentaje = round((cantidad / total_detalles) * 100, 1)
            dimensiones.append({"nombre": nombre, "valor": porcentaje})

        # --- 3. VALORACIONES ---
        conteo_opciones = self.db.query(
            OpcionRespuesta.texto_opcion,
            func.count(DetalleRespuesta.id)
        ).join(PreguntaOpcion, OpcionRespuesta.id == PreguntaOpcion.id_opcion_respuesta)\
         .join(DetalleRespuesta, PreguntaOpcion.id == DetalleRespuesta.id_pregunta_opcion)\
         .join(Respuesta, DetalleRespuesta.id_respuesta == Respuesta.id)\
         .join(EncuestaAsignatura, Respuesta.id_encuesta_asignatura == EncuestaAsignatura.id)\
         .filter(extract('year', EncuestaAsignatura.fecha_inicio) == ciclo_lectivo)\
         .group_by(OpcionRespuesta.id, OpcionRespuesta.texto_opcion).all()

        color_map = {
            "Excelente": "#198754", "Muy Bueno": "#0d6efd", "Bueno": "#6c757d",
            "Regular": "#ffc107", "Malo": "#dc3545", "Insuficiente": "#dc3545",
            "Si": "#198754", "No": "#dc3545"
        }
        
        valoraciones = []
        escalas_interes = ["Excelente", "Muy Bueno", "Bueno", "Regular", "Malo", "Si", "No"]
        temp_conteo = {}
        
        for texto, cantidad in conteo_opciones:
            if texto in escalas_interes:
                temp_conteo[texto] = temp_conteo.get(texto, 0) + cantidad
        
        for texto, cantidad in temp_conteo.items():
            valoraciones.append({
                "label": texto,
                "valor": cantidad,
                "color": color_map.get(texto, "#adb5bd")
            })

        if not valoraciones:
            valoraciones = [{"label": "Sin datos", "valor": 1, "color": "#e9ecef"}]

        # --- 4. TOP ASIGNATURAS ---
        top_query = self.db.query(
            Asignatura.nombre,
            func.count(Respuesta.id).label("respuestas_reales")
        ).join(EncuestaAsignatura, Asignatura.id == EncuestaAsignatura.id_asignatura)\
         .outerjoin(Respuesta, EncuestaAsignatura.id == Respuesta.id_encuesta_asignatura)\
         .filter(extract('year', EncuestaAsignatura.fecha_inicio) == ciclo_lectivo)\
         .group_by(Asignatura.id)\
         .order_by(desc("respuestas_reales"))\
         .all()

        top_asignaturas = []
        alertas = []

        for i, (nombre, respuestas) in enumerate(top_query):
            insc_estimado = 50 
            avance = int((respuestas / insc_estimado) * 100)
            
            if i < 4:
                top_asignaturas.append({
                    "nombre": nombre,
                    "alumnos": insc_estimado,
                    "avance": min(100, avance)
                })
            
            if respuestas == 0:
                alertas.append({
                    "tipo": "Participación",
                    "asignatura": nombre,
                    "detalle": "Sin respuestas registradas",
                    "severidad": "Alta"
                })

        # --- 5. KEYWORDS ---
        text_query = self.db.query(DetalleRespuesta.texto_respuesta_abierta)\
            .join(Respuesta).join(EncuestaAsignatura)\
            .filter(
                extract('year', EncuestaAsignatura.fecha_inicio) == ciclo_lectivo,
                DetalleRespuesta.texto_respuesta_abierta != None,
                DetalleRespuesta.texto_respuesta_abierta != ""
            )\
            .order_by(desc(DetalleRespuesta.id))\
            .limit(15).all()
            
        keywords = []
        for (texto,) in text_query:
            words = [w for w in texto.split() if len(w) > 5]
            keywords.extend(words)

        return DashboardDTO(
            indicadores=indicadores,
            dimensiones=dimensiones,
            valoraciones=valoraciones,
            top_asignaturas=top_asignaturas,
            alertas=alertas[:5],
            keywords=list(set(keywords))[:8]
        )