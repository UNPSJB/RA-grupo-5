from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.detalle_respuesta.models import DetalleRespuesta
from src.detalle_respuesta import schemas

def listar_detalle_respuestas(db: Session) -> List[DetalleRespuesta]:
    return db.scalars(select(DetalleRespuesta)).all()   

def leer_detalle_respuesta(db: Session, detalle_respuesta_id: int) -> DetalleRespuesta:
    db_detalle_respuesta = db.scalar(select(DetalleRespuesta).where(DetalleRespuesta.id == detalle_respuesta_id))
    if db_detalle_respuesta is None:
        raise Exception("Detalle de respuesta no encontrado")
    return db_detalle_respuesta