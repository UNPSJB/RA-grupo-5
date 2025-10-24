from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from src.database import get_db
from src.respuestas import schemas, services

router = APIRouter(prefix="/respuestas", tags=["respuestas"])

# Rutas para Respuestas

@router.post("/", response_model=schemas.RespuestaCreate)
def create_respuesta(respuesta: schemas.RespuestaCreate, db: Session = Depends(get_db)):
    return services.crear_respuesta(db, respuesta)

@router.get("/", response_model=List[schemas.RespuestaRead])
def read_respuestas(
    persona_id: Optional[int] = None,
    encuesta_asignatura_id: Optional[int] = None,
    informe_asignatura_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    respuestas = services.listar_respuestas(
        db, 
        persona_id=persona_id, 
        encuesta_asignatura_id=encuesta_asignatura_id,
        informe_asignatura_id=informe_asignatura_id
    )
    return respuestas
@router.get("/{respuesta_id}", response_model=schemas.RespuestaRead)
def get_respuesta(respuesta_id: int, db: Session = Depends(get_db)):
    return services.leer_respuesta(db, respuesta_id)
