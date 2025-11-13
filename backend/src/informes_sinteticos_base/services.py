from sqlalchemy.orm import Session, selectinload # <-- Asegúrate de tener selectinload
from sqlalchemy import select, desc # <-- Asegúrate de tener desc
from typing import List
from fastapi import HTTPException
from src.informes_sinteticos_base import models, schemas 
from src.preguntas.models import Pregunta
from src.pregunta_opcion.models import PreguntaOpcion
from src.opciones_respuesta.models import OpcionRespuesta


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

# --- ASEGÚRATE QUE TU FUNCIÓN 'actual' SEA ESTA ---
def leer_informe_base_actual(db: Session):
    query = (
        select(models.InformeSinteticoBase)
        .options(
            selectinload(models.InformeSinteticoBase.preguntas)
            .selectinload(Pregunta.pregunta_opcion)
            .selectinload(PreguntaOpcion.opcion_respuesta)
        )
        .order_by(desc(models.InformeSinteticoBase.id))
        .limit(1)
    )

    result = db.execute(query)

    informe_base = result.unique().scalars().first()
    return informe_base