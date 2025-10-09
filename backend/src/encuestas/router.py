from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.encuestas import schemas, services

router = APIRouter(prefix="/encuestas", tags=["encuestas"])

#rutas:


#listar encuestas
@router.get("/", response_model=list[schemas.EncuestaRead])
def read_encuestas(db: Session = Depends(get_db)):
    return services.listar_encuestas(db)

#crear encuesta
@router.post("/",response_model=schemas.EncuestaRead)
def create_encuesta(encuesta: schemas.EncuestaCreate,  db: Session = Depends(get_db)):
    return services.crear_encuesta(db,encuesta)

#ver encuesta por id
@router.get("/{encuesta_id}", response_model=schemas.EncuestaRead)
def read_encuesta(encuesta_id: int, db:Session = Depends(get_db)):
    return services.leer_encuesta(db, encuesta_id)

#ver encuesta por id con sus variables
@router.get("/{encuesta_id}", response_model=schemas.EncuestaRead)
def read_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
    return services.get_encuesta_completa(db, encuesta_id)

#modificar encuesta

@router.put("/{encuesta_id}", response_model=schemas.EncuestaRead)
def update_encuesta(
    encuesta_id: int, encuesta: schemas.EncuestaUpdate, db: Session = Depends(get_db)):
    return services.modificar_encuesta(db, encuesta_id, encuesta)

#eliminar encuesta
@router.delete("/{encuesta_id}", response_model=dict)
def delete_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
    return services.eliminar_encuesta(db, encuesta_id)



@router.post("/{encuesta_id}/confirmar")
def confirmar_encuesta(encuesta_id: int):
    # lógica para confirmar la encuesta
    # Simula que se guardo correctamente
    return {"status": "ok", "mensaje": f"Encuesta {encuesta_id} confirmada"}
