from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from src.informes_asignaturas.models import InformeAsignatura
from src.informes_asignaturas import schemas

def listar_informes_asignaturas(db:Session):
     return (
        db.query(InformeAsignatura)
        .options(
            joinedload(InformeAsignatura.asignatura),
            joinedload(InformeAsignatura.informe_curricular_base),
            joinedload(InformeAsignatura.respuestas)
        )
        .all()
    )

def crear_informe_asignatura(db: Session, informe: schemas.InformeAsignaturaCreate) -> schemas.InformeAsignaturaRead:
    _informe = InformeAsignatura(**informe.model_dump())
    db.add(_informe)
    db.commit()
    db.refresh(_informe)
    return _informe

def leer_informe_asignatura(db: Session, informe_id: int)-> schemas.InformeAsignaturaRead:
    db_informe = db.scalar(select(InformeAsignatura).where(InformeAsignatura.id == informe_id))
    if db_informe is None:
        return {"message": "Informe no encontrado"}
    return db_informe

