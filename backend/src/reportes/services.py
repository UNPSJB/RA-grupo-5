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

    return db.query(Reporte).options(
        selectinload(Reporte.encuesta_asignatura).options(
            selectinload(EncuestaAsignatura.encuesta_base)
                .selectinload(EncuestaBase.variables)
                .selectinload(Variable.preguntas)
                .selectinload(Pregunta.pregunta_opcion)
                .selectinload(PreguntaOpcion.opcion_respuesta), 
            selectinload(EncuestaAsignatura.respuestas)
                .selectinload(Respuesta.detalles)
                .selectinload(DetalleRespuesta.pregunta_opcion).options(
                    selectinload(PreguntaOpcion.pregunta).selectinload(Pregunta.variable), 
                    selectinload(PreguntaOpcion.opcion_respuesta) 
                )
        )
    ).filter(Reporte.id == reporte_id).first()

def generar_resumen_variable(db: Session, reporte_id: int) -> dict:
    """
    Se encarga de la generación del reporte completo,
    incluyendo tanto los resultados por pregunta como el resumen por variable.
    """
    
    # 1. Obtenemos el reporte con TODAS las relaciones anidadas ya cargadas
    db_reporte = leer_reporte_con_relaciones_completas(db, reporte_id)
    
    if not db_reporte:
        return {"error": "Reporte no encontrado"}

    encuesta_asig = db_reporte.encuesta_asignatura
    
    resultados_preguntas = _generar_resultados_preguntas_cerradas(encuesta_asig)
    resumen_variables = _generar_resumen_por_variable(encuesta_asig)
    
    return {
        "message": "Reporte de encuesta asignatura generado",
        "resultados_por_pregunta": resultados_preguntas,
        "resumen_por_variable": resumen_variables
    }



def _generar_resultados_preguntas_cerradas(encuesta_asig: EncuestaAsignatura) -> dict:
    
    # --- Conteo de votos por PREGUNTA ---
    conteo_opciones = defaultdict(lambda: defaultdict(int))
    total_respuestas_por_pregunta = defaultdict(int)
    
    for respuesta in encuesta_asig.respuestas:
        for detalle in respuesta.detalles:
            if detalle.pregunta_opcion:
                pregunta_id = detalle.pregunta_opcion.id_pregunta
                opcion_id = detalle.pregunta_opcion.id_opcion_respuesta
                
                conteo_opciones[pregunta_id][opcion_id] += 1
                total_respuestas_por_pregunta[pregunta_id] += 1

    # --- Estructura del resumen por PREGUNTA ---
    resultados_por_pregunta = {}

    for variable in encuesta_asig.encuesta_base.variables:
        preguntas_de_la_variable = []
        
        for pregunta in variable.preguntas:
            
            # Filtramos solo por preguntas cerradas
            if pregunta.tipo == "single_choice":
                
                total_votos = total_respuestas_por_pregunta[pregunta.id]
                opciones_con_porcentaje = []
                
                for pregunta_opcion_obj in pregunta.pregunta_opcion:
                    opcion = pregunta_opcion_obj.opcion_respuesta
                    
                    if opcion is None:
                        continue 

                    votos_opcion = conteo_opciones[pregunta.id][opcion.id]
                    porcentaje = (votos_opcion / total_votos * 100) if total_votos > 0 else 0
                    
                    opciones_con_porcentaje.append({
                        "opcion_texto": opcion.texto_opcion,
                        "porcentaje": round(porcentaje, 2)
                    })
                
                if opciones_con_porcentaje:
                    preguntas_de_la_variable.append({
                        "pregunta_texto": pregunta.texto_pregunta,
                        "opciones": opciones_con_porcentaje
                    })

        if preguntas_de_la_variable:
            resultados_por_pregunta[variable.nombre] = {
                "variable_id": variable.id,
                "codigo": variable.codigo,
                "preguntas": preguntas_de_la_variable
            }
            
    return resultados_por_pregunta



def _generar_resumen_por_variable(encuesta_asig: EncuestaAsignatura) -> dict:

    # Conteo de votos por VARIABLE ---
    conteo_por_variable = defaultdict(lambda: defaultdict(int))
    total_votos_por_variable = defaultdict(int)

    for respuesta in encuesta_asig.respuestas:
        for detalle in respuesta.detalles:
            variable = detalle.pregunta_opcion.pregunta.variable
            opcion = detalle.pregunta_opcion.opcion_respuesta

            # Agregamos el conteo usando el ID de la variable y el TEXTO de la opción
            conteo_por_variable[variable.id][opcion.texto_opcion] += 1
            total_votos_por_variable[variable.id] += 1
                
    # --- Estructura del resumen por VARIABLE ---
    resumen_final_variables = {}

    # Iteramos sobre la estructura de la encuesta para incluir todas las variables
    for variable in encuesta_asig.encuesta_base.variables:
        variable_id = variable.id
        total_votos = total_votos_por_variable[variable_id]
        conteos_opcion_texto = conteo_por_variable[variable_id]
        
        opciones_con_porcentaje = []
        
    # 1. Primero, creamos una lista de todos los textos de opción únicos
        #    que existen para esta variable. Usamos un 'set' para evitar duplicados.
        textos_de_opcion_unicos = set()
        for pregunta in variable.preguntas:
            for po_obj in pregunta.pregunta_opcion:
                if po_obj.opcion_respuesta:
                    textos_de_opcion_unicos.add(po_obj.opcion_respuesta.texto_opcion)

        # 2. Ahora, iteramos sobre esa lista estructural (ordenada)
        #    en lugar de iterar sobre los resultados del conteo.
        for texto_opcion in sorted(list(textos_de_opcion_unicos)):
            
            # 3. Buscamos los votos en nuestro diccionario.
            #    Usamos .get(texto_opcion, 0) para que devuelva 0 si no
            #    encuentra votos para esa opción (ej. "mas o menos").
            votos_opcion = conteos_opcion_texto.get(texto_opcion, 0)
            
            porcentaje = (votos_opcion / total_votos * 100) if total_votos > 0 else 0
            
            opciones_con_porcentaje.append({
                "opcion_texto": texto_opcion,
                "porcentaje": round(porcentaje, 2)
            })
        

        if opciones_con_porcentaje:
            resumen_final_variables[variable.nombre] = {
                "variable_id": variable.id,
                "codigo": variable.codigo,
                "opciones": opciones_con_porcentaje
            }
            
    return resumen_final_variables    

