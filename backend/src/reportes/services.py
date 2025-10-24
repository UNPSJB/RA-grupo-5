from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session, selectinload
from src.reportes.models import Reporte
from src.encuestas_asignaturas.models import EncuestaAsignatura
from src.encuestas_base.models import EncuestaBase
from src.respuestas.models import Respuesta
from src.detalle_respuesta.models import DetalleRespuesta
from src.pregunta_opcion.models import PreguntaOpcion
from src.preguntas.models import Pregunta
from src.variables.models import Variable
from collections import defaultdict
from src.reportes import schemas, exceptions



def listar_reportes(db:Session) -> List[schemas.Reporte]:    
    return db.scalars(select(Reporte)).all()

def crear_reporte(db: Session, reporte: schemas.ReporteCreate) -> schemas.Reporte:
    _reporte = Reporte(**reporte.model_dump())
    db.add(_reporte)
    db.commit()
    db.refresh(_reporte)
    return _reporte

def leer_reporte(db: Session, reporte_id: int)-> schemas.Reporte:
    db_reporte = db.scalar(select(Reporte).where(Reporte.id == reporte_id))
    if db_reporte is None:
        raise exceptions.ReporteNoEncontrado()
    return db_reporte

def eliminar_reporte(db: Session, reporte_id: int) -> None:    
    db_reporte = leer_reporte(db, reporte_id)
    nombre_reporte = db_reporte.asignatura
    db.delete(db_reporte)
    db.commit()
    return {"message": f"Reporte {nombre_reporte} eliminado"}

def actualizar_reporte(db: Session, reporte_id: int, reporte: schemas.ReporteUpdate) -> schemas.Reporte:
    db_reporte = leer_reporte(db, reporte_id)
    for key, value in reporte.model_dump().items():
        setattr(db_reporte, key, value)
    db.commit()
    db.refresh(db_reporte)
    return db_reporte

def leer_reporte_con_relaciones_completas(db: Session, reporte_id: int):
    """
    Lee un reporte y precarga (eager loading) de forma eficiente toda la
    jerarquía de datos necesaria para el resumen, adaptado al nuevo modelo.
    """
    return db.query(Reporte).options(
        selectinload(Reporte.encuesta_asignatura).options(
            
            # 1. Carga la estructura de la encuesta (para la Etapa 2)
            selectinload(EncuestaAsignatura.encuesta_base)
                .selectinload(EncuestaBase.variables)
                .selectinload(Variable.preguntas)
                .selectinload(Pregunta.pregunta_opcion)  # Carga la lista de joins
                .selectinload(PreguntaOpcion.opcion_respuesta), # Carga el objeto de opción (para el texto)

            # 2. Carga las respuestas de los usuarios (para la Etapa 1)
            selectinload(EncuestaAsignatura.respuestas)
                .selectinload(Respuesta.detalles)  # Asumiendo 'detalles' (basado en tu DetalleRespuesta.respuesta)
                .selectinload(DetalleRespuesta.pregunta_opcion) # Carga el objeto PreguntaOpcion de la respuesta
        )
    ).filter(Reporte.id == reporte_id).first()


def generar_resumen_variable(db: Session, reporte_id: int) -> dict:    
    # Obtenemos el reporte con todas las relaciones anidadas ya cargadas
    db_reporte = leer_reporte_con_relaciones_completas(db, reporte_id)
    
    if not db_reporte:
        return {"error": "Reporte no encontrado"}

    encuesta_asig = db_reporte.encuesta_asignatura
    
    # --- ETAPA 1: RECOPILAR Y CONTAR TODAS LAS RESPUESTAS ---
    
    conteo_opciones = defaultdict(lambda: defaultdict(int))
    total_respuestas_por_pregunta = defaultdict(int)
    
    # Recorremos las respuestas que dieron los usuarios
    # (Usando 'detalles' como se define en el back_populates de tu modelo DetalleRespuesta)
    for respuesta in encuesta_asig.respuestas:
        for detalle in respuesta.detalles:
            
            # CAMBIO: Verificamos 'detalle.pregunta_opcion'
            if detalle.pregunta_opcion:
                
                # CAMBIO: Extraemos los IDs desde el objeto 'pregunta_opcion'
                # (SQLAlchemy los tiene al haber cargado el objeto)
                pregunta_id = detalle.pregunta_opcion.id_pregunta
                opcion_id = detalle.pregunta_opcion.id_opcion_respuesta
                
                # El resto de la lógica de conteo es idéntica
                conteo_opciones[pregunta_id][opcion_id] += 1
                total_respuestas_por_pregunta[pregunta_id] += 1

    # --- ETAPA 2: ESTRUCTURAR EL RESUMEN Y CALCULAR PORCENTAJES ---

    resumen_por_variable = {}

    # 1. Recorremos las variables directamente desde la encuesta base
    for variable in encuesta_asig.encuesta_base.variables:
        
        preguntas_de_la_variable = []
        
        # 2. Recorremos las preguntas que pertenecen a esta variable
        for pregunta in variable.preguntas:
            
            total_votos = total_respuestas_por_pregunta[pregunta.id]
            
            opciones_con_porcentaje = []
            
            # CAMBIO: Iteramos sobre 'pregunta.pregunta_opcion' (la lista de joins)
            for pregunta_opcion_obj in pregunta.pregunta_opcion:
                
                # Obtenemos el objeto OpcionRespuesta real desde el join
                opcion = pregunta_opcion_obj.opcion_respuesta
                
                # Consultamos los votos usando el ID de la opción
                votos_opcion = conteo_opciones[pregunta.id][opcion.id]
                porcentaje = (votos_opcion / total_votos * 100) if total_votos > 0 else 0
                
                opciones_con_porcentaje.append({
                    "opcion_texto": opcion.texto_opcion, # Obtenemos el texto
                    "porcentaje": round(porcentaje, 2)
                })
            
            preguntas_de_la_variable.append({
                "pregunta_texto": pregunta.texto_pregunta,
                "opciones": opciones_con_porcentaje
            })

        # 3. Finalmente, añadimos la variable y su lista de preguntas al resumen
        resumen_por_variable[variable.nombre] = {
            "variable_id": variable.id,
            "preguntas": preguntas_de_la_variable
        }

    return {"message": "Resumen por variable generado", "resumen": resumen_por_variable}