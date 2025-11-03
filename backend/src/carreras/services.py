from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from src.carreras import models, schemas
from fastapi import HTTPException

def crear_carrera(db: Session, carrera: schemas.CarreraCreate) -> models.Carrera:
    _carrera = models.Carrera(**carrera.model_dump())
    db.add(_carrera)
    db.commit()
    db.refresh(_carrera)
    return _carrera

def listar_carreras(db: Session) -> List[models.Carrera]:
    return db.scalars(select(models.Carrera)).all()

def leer_carrera(db: Session, carrera_id: int) -> models.Carrera:
    db_carrera = db.scalar(select(models.Carrera).where(models.Carrera.id == carrera_id))
    if db_carrera is None:
        raise HTTPException(status_code=404, detail="Carrera no encontrada")
    return db_carrera

