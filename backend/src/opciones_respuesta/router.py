from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.opciones_respuesta import schemas, services

router = APIRouter(prefix="/opciones-respuestas", tags=["opciones-respuestas"])

# Rutas para opcionesRespuestas

@router.post("/", response_model=schemas.OpcionRespuestaRead)
def create_opcion_respuesta(OpcionRespuesta: schemas.OpcionRespuestaCreate, db: Session = Depends(get_db)):
    return services.crear_opcion_respuesta(db, OpcionRespuesta)


@router.get("/", response_model=list[schemas.OpcionRespuestaRead])
def read_opcion_respuesta(db: Session = Depends(get_db)):
    return services.listar_opciones_respuestas(db)