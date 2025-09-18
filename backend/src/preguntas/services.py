from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.preguntas.models import Pregunta
from src.preguntas import schemas, exceptions

# operaciones CRUD para Preguntas

def crear_pregunta(db: Session, pregunta: schemas.PreguntaCreate) -> schemas.Pregunta:
    _pregunta = Pregunta(**pregunta.model_dump())
    db.add(_pregunta)
    db.commit()
    db.refresh(_pregunta)
    return _pregunta


def listar_preguntas(db: Session) -> List[schemas.Pregunta]:
    return db.scalars(select(Pregunta)).all()


def leer_pregunta(db: Session, pregunta_id: int) -> schemas.Pregunta:
    db_pregunta = db.scalar(select(Pregunta).where(Pregunta.id == pregunta_id))
    if db_pregunta is None:
        raise exceptions.PreguntaNoEncontrada()
    return db_pregunta


def modificar_pregunta(db: Session, pregunta_id: int, pregunta: schemas.PreguntaUpdate) -> Pregunta:
    db_pregunta = leer_pregunta(db, pregunta_id)
    for key, value in pregunta.model_dump(exclude_unset=True).items():
        setattr(db_pregunta, key, value)
    db.commit()
    db.refresh(db_pregunta)
    return db_pregunta


def eliminar_pregunta(db: Session, pregunta_id: int) -> schemas.Pregunta:
    db_pregunta = leer_pregunta(db, pregunta_id)
    db.execute(delete(Pregunta).where(Pregunta.id == pregunta_id))
    db.commit()
    return db_pregunta