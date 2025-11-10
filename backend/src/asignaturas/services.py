from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session, joinedload
from src.asignaturas.models import Asignatura
from src.asignaturas import schemas


# CRUD:

def listar_asignaturas(db:Session) -> List[schemas.AsignaturaRead]:
    return db.scalars(select(Asignatura)).all()


def crear_asignatura(db: Session, asignatura: schemas.AsignaturaCreate) -> schemas.AsignaturaRead:
    _asignatura = Asignatura(**asignatura.model_dump())
    db.add(_asignatura)
    db.commit()
    db.refresh(_asignatura)
    return _asignatura

def leer_asignatura(db: Session, asignatura_id: int)-> schemas.AsignaturaRead:
    db_asignatura = db.scalar(select(Asignatura).where(Asignatura.id == asignatura_id))
    if db_asignatura is None:
         return {"message": f"Asignatura {asignatura_id} no encontrada"}
    return db_asignatura



def modificar_asignatura(
    db: Session, asignatura_id: int, asignatura: schemas.AsignaturaUpdate) -> Asignatura:
    db_asignatura = leer_asignatura(db, asignatura_id)
    db.execute(update(Asignatura).where(Asignatura.id == asignatura_id).values(**asignatura.model_dump()))
    db.commit()
    db.refresh(db_asignatura)
    return db_asignatura


def eliminar_asignatura(db: Session, asignatura_id: int) -> dict:
    db_asignatura = leer_asignatura(db, asignatura_id)
    nombre_asignatura = db_asignatura.asignatura
    db.delete(db_asignatura)
    db.commit()
    return {"message": f"Asignatura {nombre_asignatura} eliminada"}


