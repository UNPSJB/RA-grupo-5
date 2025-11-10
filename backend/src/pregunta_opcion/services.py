from typing import List
from sqlalchemy import select 
from sqlalchemy.orm import Session
from src.pregunta_opcion.models import PreguntaOpcion
from src.pregunta_opcion import schemas

# operaciones CRUD para preguntaOpcion

def crear_pregunta_opcion(
    db: Session, 
    pregunta_opcion: schemas.PreguntaOpcionCreate
) -> PreguntaOpcion:
    _opcion = PreguntaOpcion(**pregunta_opcion.model_dump())
    
    db.add(_opcion)
    db.commit()
    db.refresh(_opcion)
    return _opcion

def listar_pregunta_opcion(db: Session) -> List[PreguntaOpcion]:
    return db.scalars(select(PreguntaOpcion)).all()
