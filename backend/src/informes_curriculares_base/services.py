from typing import List
from sqlalchemy import select, desc
from sqlalchemy.orm import Session, selectinload
from src.informes_curriculares_base.models import InformeCurricularBase
from src.informes_curriculares_base import schemas, exceptions
from src.preguntas.models import Pregunta
from src.pregunta_opcion.models import PreguntaOpcion

def listar_informes_base(db:Session) -> List[schemas.InformeCurricularBaseRead]:
    return db.scalars(select(InformeCurricularBase)).all()

def crear_informe_base(db: Session, informe: schemas.InformeCurricularBaseCreate) -> schemas.InformeCurricularBaseRead:
    _informebase = InformeCurricularBase(**informe.model_dump())
    db.add(_informebase)
    db.commit()
    db.refresh(_informebase)
    return _informebase

def leer_informe_base(db: Session, informe_base_id: int)-> schemas.InformeCurricularBaseRead:
    db_informe_base = db.scalar(select(InformeCurricularBase).where(InformeCurricularBase.id == informe_base_id))
    if db_informe_base is None:
        raise exceptions.InformeBaseNoEncontrado()
    return db_informe_base


def leer_informe_base_actual(db: Session):
    query = (
        select(InformeCurricularBase)
        .options(
            selectinload(InformeCurricularBase.preguntas)
            .selectinload(Pregunta.pregunta_opcion)
            .selectinload(PreguntaOpcion.opcion_respuesta)
        )
        .order_by(desc(InformeCurricularBase.id))
        .limit(1)
    )

    result = db.execute(query)

    informe_base = result.unique().scalars().first()
    return informe_base
