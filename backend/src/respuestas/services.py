from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.respuestas.models import Respuesta
from src.respuestas import schemas, exceptions

def crear_respuesta(db: Session, respuesta: schemas.RespuestaCreate) -> Respuesta:
    _respuesta = Respuesta(**respuesta.model_dump())
    db.add(_respuesta)
    db.commit()
    db.refresh(_respuesta)
    return _respuesta

def listar_respuestas(db: Session) -> List[Respuesta]:
    return db.scalars(select(Respuesta)).all()

def leer_respuesta(db: Session, respuesta_id: int) -> Respuesta:
    db_respuesta = db.scalar(select(Respuesta).where(Respuesta.id == respuesta_id))
    if db_respuesta is None:
        raise exceptions.RespuestaNoEncontrada()
    return db_respuesta

def eliminar_respuesta(db: Session, respuesta_id: int) -> Respuesta:
    db_respuesta = leer_respuesta(db, respuesta_id)
    db.delete(db_respuesta)
    db.commit()
    return db_respuesta
