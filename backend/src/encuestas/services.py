from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.encuestas.models import Encuesta
from src.encuestas import schemas, exceptions

# CRUD:

def listar_encuestas(db:Session) -> List[schemas.Encuesta]:
    return db.scalars(select(Encuesta)).all()


def crear_encuesta(db: Session, encuesta: schemas.EncuestaCreate) -> schemas.Encuesta:
    _encuesta = Encuesta(**encuesta.model_dump())
    db.add(_encuesta)
    db.commit()
    db.refresh(_encuesta)
    return _encuesta

def leer_encuesta(db: Session, encuesta_id: int)-> schemas.Encuesta:
    db_encuesta = db.scalar(select(Encuesta).where(Encuesta.id == encuesta_id))
    if db_encuesta is None:
        raise exceptions.EncuestaNoEncontrada()
    return db_encuesta

