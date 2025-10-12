from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.encuestas_base import schemas, services

router = APIRouter(prefix="/encuestas-base", tags=["encuestas-base"])

#rutas:


#listar encuestas
@router.get("/", response_model=list[schemas.EncuestaBaseRead])
def read_encuestas_base(db: Session = Depends(get_db)):
    return services.listar_encuestas_base(db)

#crear encuesta
@router.post("/",response_model=schemas.EncuestaBaseRead)
def create_encuesta_base(encuesta_base: schemas.EncuestaBaseCreate,  db: Session = Depends(get_db)):
    return services.crear_encuesta_base(db,encuesta_base)

#ver encuesta por id
@router.get("/{encuesta_base_id}", response_model=schemas.EncuestaBaseRead)
def read_encuesta_base(encuesta_base_id: int, db:Session = Depends(get_db)):
    return services.leer_encuesta_base(db, encuesta_base_id)

#modificar encuesta

@router.put("/{encuesta_base_id}", response_model=schemas.EncuestaBaseRead)
def update_encuesta_base(
    encuesta_base_id: int, encuesta_base: schemas.EncuestaBaseUpdate, db: Session = Depends(get_db)):
    return services.modificar_encuesta_base(db, encuesta_base_id, encuesta_base)

#eliminar encuesta
@router.delete("/{encuesta_base_id}", response_model=dict)
def delete_encuesta_base(encuesta_base_id: int, db: Session = Depends(get_db)):
    return services.eliminar_encuesta_base(db, encuesta_base_id)


