from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.preguntas import schemas, services

router = APIRouter(prefix="/preguntas", tags=["preguntas"])

# Rutas para Preguntas

@router.post("/", response_model=schemas.PreguntaRead)
def create_pregunta(pregunta: schemas.PreguntaCreate, db: Session = Depends(get_db)):
    return services.crear_pregunta(db, pregunta)


@router.get("/", response_model=list[schemas.PreguntaRead])
def read_preguntas(db: Session = Depends(get_db)):
    return services.listar_preguntas(db)


@router.get("/{pregunta_id}", response_model=schemas.PreguntaRead)
def read_pregunta(pregunta_id: int, db: Session = Depends(get_db)):
    return services.leer_pregunta(db, pregunta_id)


@router.put("/{pregunta_id}", response_model=schemas.PreguntaRead)
def update_pregunta(
    pregunta_id: int, pregunta: schemas.PreguntaUpdate, db: Session = Depends(get_db)):
    return services.modificar_pregunta(db, pregunta_id, pregunta)


@router.delete("/{pregunta_id}", response_model=schemas.PreguntaRead)
def delete_pregunta(pregunta_id: int, db: Session = Depends(get_db)): 
    return services.eliminar_pregunta(db, pregunta_id)