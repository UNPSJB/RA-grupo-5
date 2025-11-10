from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.pregunta_opcion import schemas, services

router = APIRouter(prefix="/pregunta-opcion", tags=["pregunta-opcion"])

# Rutas para opcionesRespuestas

@router.post("/", response_model=schemas.PreguntaOpcionRead)
def create_pregunta_opcion(pregunta_opcion: schemas.PreguntaOpcionCreate, 
    db: Session = Depends(get_db)):
    return services.crear_pregunta_opcion(db, pregunta_opcion)

@router.get("/", response_model=list[schemas.PreguntaOpcionRead])
def read_pregunta_opcion(db: Session = Depends(get_db)):
    return services.listar_pregunta_opcion(db)