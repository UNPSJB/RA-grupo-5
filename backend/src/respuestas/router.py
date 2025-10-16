from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.respuestas import schemas, services

router = APIRouter(prefix="/respuestas", tags=["respuestas"])

# Rutas para Respuestas

@router.post("/", response_model=schemas.Respuesta)
def create_respuesta(respuesta: schemas.RespuestaCreate, db: Session = Depends(get_db)):
    return services.crear_respuesta(db, respuesta)

@router.get("/", response_model=List[schemas.Respuesta])
def get_respuestas(db: Session = Depends(get_db)):
    return services.listar_respuestas(db)

@router.get("/{respuesta_id}", response_model=schemas.Respuesta)
def get_respuesta(respuesta_id: int, db: Session = Depends(get_db)):
    return services.leer_respuesta(db, respuesta_id)
