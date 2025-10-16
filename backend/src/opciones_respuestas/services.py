from typing import List
from sqlalchemy import select 
from sqlalchemy.orm import Session
from src.opciones_respuestas.models import OpcionRespuesta
from src.opciones_respuestas import schemas

# operaciones CRUD para opcionesRespuestas

def crear_opcionRespuesta(db: Session, opcionRespuesta: schemas.OpcionRespuestaCreate) -> schemas.OpcionRespuestaRead:
    _opcion = OpcionRespuesta(**opcionRespuesta.model_dump())
    db.add(_opcion)
    db.commit()
    db.refresh(_opcion)
    return _opcion


def listar_opcionesRespuestas(db: Session) -> List[schemas.OpcionRespuestaRead]:
    return db.scalars(select(OpcionRespuesta)).all()


