from typing import List
from sqlalchemy import select 
from sqlalchemy.orm import Session
from src.opciones_respuesta.models import OpcionRespuesta
from src.opciones_respuesta import schemas

# operaciones CRUD para opcionesRespuestas

def crear_opcion_respuesta(
    db: Session, 
    opcion_respuesta: schemas.OpcionRespuestaCreate
) -> OpcionRespuesta:
    _opcion = OpcionRespuesta(**opcion_respuesta.model_dump())
    db.add(_opcion)
    db.commit()
    db.refresh(_opcion)
    return _opcion

def listar_opciones_respuestas(db: Session) -> List[OpcionRespuesta]:
    return db.scalars(select(OpcionRespuesta)).all()
