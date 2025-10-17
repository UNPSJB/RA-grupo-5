from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.detalle_respuesta import schemas
from src.detalle_respuesta import services
router = APIRouter(prefix ="/detalle_respuesta", tags = ["detalle_respuesta"])

@router.post ("/", response_model=schemas.DetalleRespuesta)
def create_detalle_respuesta(respuesat: schemas.DetalleRespuestaCreate, db: Session = Depends (get_db)):
    return services.crear_detalle_respuesta(db, create_detalle_respuesta)

@router.get ("/", response_model=List[schemas.DetalleRespuesta])
def get_detalle_respuestas(db: Session = Depends(get_db)):
    return services.listar_detalle_respuestas(db)

@router.get ("/{detalle_respuesta_id}", response_model=schemas.DetalleRespuesta)
def get_detalle_respuesta(detalle_respuesta_id: int, db: Session = Depends(get_db)):
    return services.leer_detalle_respuesta(db, detalle_respuesta_id)