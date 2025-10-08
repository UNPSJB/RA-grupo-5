from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session, joinedload
from src.encuestas_asignaturas.models import EncuestaAsignatura
from src.encuestas_asignaturas import schemas


# CRUD:
 
def listar_encuestas_asignaturas(db:Session) -> List[schemas.EncuestaAsignaturaRead]:
    return db.scalars(select(EncuestaAsignatura)).all()


def crear_encuesta_asignatura(db: Session, encuesta: schemas.EncuestaAsignaturaCreate) -> schemas.EncuestaAsignaturaRead:
    _encuesta = EncuestaAsignatura(**encuesta.model_dump())
    db.add(_encuesta)
    db.commit()
    db.refresh(_encuesta)
    return _encuesta

def leer_encuesta_asignatura(db: Session, encuesta_id: int)-> schemas.EncuestaAsignaturaRead:
    db_encuesta = db.scalar(select(EncuestaAsignatura).where(EncuestaAsignatura.id == encuesta_id))
    if db_encuesta is None:
        return {"message": "Encuesta no encontrada"}
    return db_encuesta


# def get_encuesta_completa(db: Session, encuesta_id: int):
#     return (
#         db.query(EncuestaAsignatura)
#         .options(
#             joinedload(EncuestaAsignatura.variables)
#             .joinedload(EncuestaAsignatura.Variable.preguntas)
#         )
#         .filter(EncuestaAsignatura.id == encuesta_id)
#         .first()
#     )


def modificar_encuesta_asignatura(
    db: Session, encuesta_id: int, encuesta: schemas.EncuestaAsignaturaUpdate) -> EncuestaAsignatura:
    db_encuesta = leer_encuesta_asignatura(db, encuesta_id)
    db.execute(update(EncuestaAsignatura).where(EncuestaAsignatura.id == encuesta_id).values(**encuesta.model_dump()))
    db.commit()
    db.refresh(db_encuesta)
    return db_encuesta


def eliminar_encuesta_asignatura(db: Session, encuesta_id: int) -> dict:
    db_encuesta = leer_encuesta_asignatura(db, encuesta_id)
    db.delete(db_encuesta)
    db.commit()
    return {"message": f"Encuesta  eliminada"}


