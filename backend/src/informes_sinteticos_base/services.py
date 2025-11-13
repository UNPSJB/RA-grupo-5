from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, desc
from typing import List
from fastapi import HTTPException
from src.informes_sinteticos_base import schemas
from src.informes_sinteticos_base.models import InformeSinteticoBase
from src.preguntas.models import Pregunta
from src.pregunta_opcion.models import PreguntaOpcion

def crear_informe_sintetico(db: Session, informe: schemas.InformeSinteticoBaseCreate) -> schemas.InformeSinteticoBaseRead:
    _informe = InformeSinteticoBase(**informe.model_dump())
    db.add(_informe)
    db.commit()
    db.refresh(_informe)
    return _informe

def listar_informes_sinteticos(db: Session) -> List[schemas.InformeSinteticoBaseRead]:
    return db.scalars(select(InformeSinteticoBase)).all()

def leer_informe_sintetico(db: Session, informe_id: int) -> schemas.InformeSinteticoBaseRead:
    db_informe = db.scalar(select(InformeSinteticoBase).where(InformeSinteticoBase.id == informe_id))
    if db_informe is None:
        raise HTTPException(status_code=404, detail="Informe sintético no encontrado")
    return db_informe

def leer_informe_base_actual(db: Session):
    query = (
        select(InformeSinteticoBase)
        .options(
            selectinload(InformeSinteticoBase.preguntas)
            .selectinload(Pregunta.pregunta_opcion)
            .selectinload(PreguntaOpcion.opcion_respuesta)
        )
        .order_by(desc(InformeSinteticoBase.id))
        .limit(1)
    )

    result = db.execute(query)

    informe_base = result.unique().scalars().first()
    return informe_base
