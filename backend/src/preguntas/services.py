from typing import List
from fastapi import HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import Session, joinedload
from src.preguntas.models import Pregunta
from src.preguntas import schemas, exceptions
from src.opciones_respuesta.models import OpcionRespuesta

from src.pregunta_opcion.models import PreguntaOpcion

def crear_pregunta(db: Session, pregunta: schemas.PreguntaCreate) -> Pregunta:
    _pregunta = Pregunta(**pregunta.model_dump())
    db.add(_pregunta)
    db.flush()
    
    if _pregunta.tipo == "open": #Si la pregunta es abierta el id_opcion_respuesta se inicializa en NULL
        db_receptor_op = PreguntaOpcion(
            id_pregunta = _pregunta.id,
            id_opcion_respuesta = None
        )
        db.add(db_receptor_op)

    db.commit()
    db.refresh(_pregunta)
    return _pregunta


def listar_preguntas(db: Session) -> List[Pregunta]: 
    query = (
        select(Pregunta)
        .options(
            joinedload(Pregunta.pregunta_opcion)
            .joinedload(PreguntaOpcion.opcion_respuesta)
        )
    )
    result = db.execute(query)

    return result.unique().scalars().all()

def leer_pregunta(db: Session, pregunta_id: int) -> Pregunta:
    query = (
        select(Pregunta)
        .where(Pregunta.id == pregunta_id)
        .options(joinedload(Pregunta.pregunta_opcion)) 
    )
    db_pregunta = db.scalar(query)
    if db_pregunta is None:
        raise exceptions.PreguntaNoEncontrada()
    return db_pregunta


def modificar_pregunta(db: Session, pregunta_id: int, pregunta: schemas.PreguntaUpdate ) -> Pregunta:
    
    db_pregunta = leer_pregunta(db, pregunta_id) 
    for key, value in pregunta.model_dump(exclude_unset=True).items():
        setattr(db_pregunta, key, value)
    db.commit()
    db.refresh(db_pregunta)
    return db_pregunta


def eliminar_pregunta(db: Session, pregunta_id: int) -> Pregunta:
    db_pregunta = leer_pregunta(db, pregunta_id)
    db.execute(delete(Pregunta).where(Pregunta.id == pregunta_id))
    db.commit()
    return db_pregunta



def asociar_opcion_a_pregunta(db: Session, pregunta_id: int, opcion_id: int) -> Pregunta:

    db_pregunta = db.get(Pregunta, pregunta_id)
    if not db_pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")

    db_opcion = db.get(OpcionRespuesta, opcion_id)
    if not db_opcion:
        raise HTTPException(status_code=404, detail="Opción de respuesta no encontrada")

    if db_opcion in db_pregunta.opciones_respuestas:
        raise HTTPException(status_code=400, detail="Esta opción ya está asociada a la pregunta")
    db_pregunta.opciones_respuestas.append(db_opcion)
    db.commit()
    db.refresh(db_pregunta)

    return db_pregunta 