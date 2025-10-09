from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.opcionesRespuestas import schemas, services

router = APIRouter(prefix="/opcionesRespuestas", tags=["opcionesRespuestas"])

# Rutas para opcionesRespuestas

@router.post("/", response_model=schemas.OpcionRespuestaRead)
def create_opcionRespuesta(OpcionRespuesta: schemas.OpcionRespuestaCreate, db: Session = Depends(get_db)):
    return services.crear_opcionRespuesta(db, OpcionRespuesta)


@router.get("/", response_model=list[schemas.OpcionRespuestaRead])
def read_opcionRespuesta(db: Session = Depends(get_db)):
    return services.listar_opcionesRespuestas(db)