from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.informes_base.models import InformeBase
from src.informes_base import schemas, exceptions

def listar_informes_base(db:Session) -> List[schemas.InformeBaseRead]:
    return db.scalars(select(InformeBase)).all()

def crear_informe_base(db: Session, informe: schemas.InformeBaseCreate) -> schemas.InformeBaseRead:
    _informebase = InformeBase(**informe.model_dump())
    db.add(_informebase)
    db.commit()
    db.refresh(_informebase)
    return _informebase

def leer_informe_base(db: Session, informe_base_id: int)-> schemas.InformeBaseRead:
    db_informe_base = db.scalar(select(InformeBase).where(InformeBase.id == informe_base_id))
    if db_informe_base is None:
        raise exceptions.InformeBaseNoEncontrado()
    return db_informe_base

