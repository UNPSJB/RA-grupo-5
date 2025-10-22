from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from src.respuestas.models import Respuesta
from src.respuestas import schemas, exception

def crear_respuesta(db: Session, respuesta: schemas.RespuestaCreate) -> Respuesta:
    _respuesta = Respuesta(**respuesta.model_dump())
    db.add(_respuesta)
    db.commit()
    db.refresh(_respuesta)
    return _respuesta

def listar_respuestas(db: Session) -> List[Respuesta]:
    return db.scalars(select(Respuesta)).all()

def leer_respuesta(db: Session, respuesta_id: int) -> Respuesta:
    
    query = (
        select(Respuesta)
        .where(Respuesta.id == respuesta_id)
        .options(joinedload(Respuesta.detalles)) 
    )
    db_respuesta = db.scalar(query)
    
    if db_respuesta is None:
        raise exception.RespuestaNoEncontrada()
    return db_respuesta
