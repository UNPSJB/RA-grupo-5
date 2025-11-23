from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session, joinedload, selectinload
from fastapi import HTTPException

from src.encuestas_asignaturas.models import EncuestaAsignatura
from src.encuestas_asignaturas.models import EstadoEncuesta
from src.encuestas_base.models import EncuestaBase
from src.variables.models import Variable
from src.preguntas.models import Pregunta
from src.pregunta_opcion.models import PreguntaOpcion
from src.opciones_respuesta.models import OpcionRespuesta
from src.asignaturas.models import Asignatura
from src.respuestas.models import Respuesta
from src.cursadas.models import Cursada
from src.encuestas_asignaturas import schemas
from datetime import date

def _get_eager_loading_query():
    return select(EncuestaAsignatura).options(
        joinedload(EncuestaAsignatura.asignatura),
        joinedload(EncuestaAsignatura.encuesta_base).options(
            selectinload(EncuestaBase.variables).options(
                selectinload(Variable.preguntas).options(
                    selectinload(Pregunta.pregunta_opcion).options(
                        joinedload(PreguntaOpcion.opcion_respuesta)
                    )
                )
            )
        )
    )


def listar_encuestas_asignaturas(db:Session):
    return (
        db.query(EncuestaAsignatura)
        .options(
            joinedload(EncuestaAsignatura.asignatura),
            joinedload(EncuestaAsignatura.encuesta_base)
        )
        .all()
    )
    
def listar_encuestas_asignaturas_cortas(db:Session):
    return (
        db.query(EncuestaAsignatura)
        .options(
            joinedload(EncuestaAsignatura.asignatura),
            joinedload(EncuestaAsignatura.encuesta_base)
        )
        .all()
    )

def listar_encuestas_respondidas_alumno(db: Session, persona_id: int) -> List[EncuestaAsignatura]:
    query = (
        db.query(EncuestaAsignatura)
        .join(Respuesta, EncuestaAsignatura.respuestas)
        .filter(Respuesta.id_persona == persona_id)
        .options(
            joinedload(EncuestaAsignatura.asignatura),
            joinedload(EncuestaAsignatura.encuesta_base)
        )
    )
    return query.all()

def crear_encuesta_asignatura(db: Session, encuesta: schemas.EncuestaAsignaturaCreate) -> EncuestaAsignatura:
    _encuesta = EncuestaAsignatura(**encuesta.model_dump())
    db.add(_encuesta)
    db.commit()
    db.refresh(_encuesta)
    
    return leer_encuesta_asignatura(db, _encuesta.id)

def leer_encuesta_asignatura(db: Session, encuesta_id: int) -> EncuestaAsignatura:
    query = _get_eager_loading_query().where(EncuestaAsignatura.id == encuesta_id)
    
    db_encuesta = db.scalars(query).first() 
    
    if db_encuesta is None:
        raise HTTPException(status_code=404, detail="Encuesta no encontrada")
        
    return db_encuesta



def modificar_encuesta_asignatura(
    db: Session, encuesta_id: int, encuesta: schemas.EncuestaAsignaturaUpdate) -> EncuestaAsignatura:
    
    db.execute(update(EncuestaAsignatura).where(EncuestaAsignatura.id == encuesta_id).values(**encuesta.model_dump()))
    db.commit()
    
    return leer_encuesta_asignatura(db, encuesta_id)


def eliminar_encuesta_asignatura(db: Session, encuesta_id: int) -> dict:
    db_encuesta = db.get(EncuestaAsignatura, encuesta_id)
    if db_encuesta is None:
        raise HTTPException(status_code=404, detail="Encuesta no encontrada")
        
    db.delete(db_encuesta)
    db.commit()
    return {"message": f"Encuesta eliminada"}


def listar_encuestas_pendientes_alumno(db: Session, persona_id: int) -> List[EncuestaAsignatura]:
    """
    Retorna las encuestas que:
    1. Están en estado 'abierta'.
    2. Están dentro del rango de fechas (inicio <= hoy <= fin).
    3. Corresponden a una asignatura que el alumno está cursando (tabla Cursada).
    4. El alumno NO ha respondido todavía. <-(esto no)
    """
    today = date.today()

    # 1. Subquery: IDs de asignaturas que el alumno cursa actualmente
    # (Asumimos que Cursada tiene 'ciclo_lectivo' como indicaste)
    # Podrías filtrar también por ciclo_lectivo == año_actual si es necesario.
    subquery_asignaturas = select(Cursada.id_asignatura).where(
        Cursada.id_persona == persona_id
    )

    # 2. Subquery: IDs de encuestas que el alumno YA respondió
    subquery_respondidas = select(Respuesta.id_encuesta_asignatura).where(
        Respuesta.id_persona == persona_id,
        Respuesta.id_encuesta_asignatura.is_not(None)
    )

    # 3. Query Principal
    query = (
        select(EncuestaAsignatura)
        .options(
            joinedload(EncuestaAsignatura.asignatura).joinedload(Asignatura.carrera),

            joinedload(EncuestaAsignatura.encuesta_base).options(
                selectinload(EncuestaBase.variables).options(
                    selectinload(Variable.preguntas).options(
                        selectinload(Pregunta.pregunta_opcion).options(
                            joinedload(PreguntaOpcion.opcion_respuesta)
                        )
                    )
                )
            )
        )
        .where(
            # A) Que la materia esté en sus cursadas
            EncuestaAsignatura.id_asignatura.in_(subquery_asignaturas),
            
            # B) Que la encuesta esté abierta y vigente
            EncuestaAsignatura.estado == EstadoEncuesta.abierta,
            EncuestaAsignatura.fecha_inicio <= today,
            EncuestaAsignatura.fecha_fin >= today,

            # C) Que NO esté en la lista de respondidas
            EncuestaAsignatura.id.not_in(subquery_respondidas)
        )
    )
    resultados = db.scalars(query).unique().all()
    for encuesta in resultados:
        encuesta.respuestas = []
        
    return resultados