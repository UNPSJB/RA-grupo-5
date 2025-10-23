from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session, joinedload
from src.reportes.models import Reporte
from src.reportes import schemas, exceptions


def listar_reportes(db:Session) -> List[schemas.Reporte]:    
    return db.scalars(select(Reporte)).all()

def crear_reporte(db: Session, reporte: schemas.ReporteCreate) -> schemas.Reporte:
    _reporte = Reporte(**reporte.model_dump())
    db.add(_reporte)
    db.commit()
    db.refresh(_reporte)
    return _reporte

def leer_reporte(db: Session, reporte_id: int)-> schemas.Reporte:
    db_reporte = db.scalar(select(Reporte).where(Reporte.id == reporte_id))
    if db_reporte is None:
        raise exceptions.ReporteNoEncontrado()
    return db_reporte

def eliminar_reporte(db: Session, reporte_id: int) -> None:    
    db_reporte = leer_reporte(db, reporte_id)
    db.delete(db_reporte)
    db.commit()
    return {"message": f"Reporte {db_reporte.id} eliminado"}

def actualizar_reporte(db: Session, reporte_id: int, reporte: schemas.ReporteUpdate) -> schemas.Reporte:
    db_reporte = leer_reporte(db, reporte_id)
    for key, value in reporte.model_dump().items():
        setattr(db_reporte, key, value)
    db.commit()
    db.refresh(db_reporte)
    return db_reporte
