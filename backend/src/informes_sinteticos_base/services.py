from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List
from fastapi import HTTPException

from src.informes_sinteticos_base import models, schemas 

def crear_informe_sintetico(db: Session, informe: schemas.InformeSinteticoBaseCreate) -> models.InformeSinteticoBase:
    _informe = models.InformeSinteticoBase(**informe.model_dump())
    db.add(_informe)
    db.commit()
    db.refresh(_informe)
    return _informe

def listar_informes_sinteticos(db: Session) -> List[models.InformeSinteticoBase]:
    return db.scalars(select(models.InformeSinteticoBase)).all()

def leer_informe_sintetico(db: Session, informe_id: int) -> models.InformeSinteticoBase:
    db_informe = db.scalar(
        select(models.InformeSinteticoBase).where(models.InformeSinteticoBase.id == informe_id)
    )
    if db_informe is None:
        raise HTTPException(status_code=404, detail="Informe sintético no encontrado")
    return db_informe