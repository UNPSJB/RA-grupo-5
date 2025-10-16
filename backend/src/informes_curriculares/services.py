from sqlalchemy import select, update
from sqlalchemy.orm import Session
from src.informes_curriculares.models import InformeCurricular
from src.informes_curriculares import schemas, exceptions
from typing import List

def listar_informes(db:Session) -> List[schemas.InformeCurricular]:
    return db.scalars(select(InformeCurricular)).all()

def crear_informe(db: Session, informe: schemas.InformeCurricularCreate) -> schemas.InformeCurricular:
    _informe = InformeCurricular(**informe.model_dump())
    db.add(_informe)
    db.commit()
    db.refresh(_informe)
    return _informe

def leer_informe(db: Session, informe_id: int)-> schemas.InformeCurricular:
    db_informe = db.scalar(select(InformeCurricular).where(InformeCurricular.id == informe_id))
    if db_informe is None:
        raise exceptions.InformeNoEncontrado()
    return db_informe