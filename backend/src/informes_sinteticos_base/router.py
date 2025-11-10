from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db 

from src.informes_sinteticos_base import schemas, services


router = APIRouter(prefix="/informes-sinteticos-base", tags=["informes-sinteticos-base"])


@router.get("/", response_model=list[schemas.InformeSinteticoBaseRead])
def read_informes_sinteticos(db: Session = Depends(get_db)):
    return services.listar_informes_sinteticos(db)

@router.get("/{informe_id}", response_model=schemas.InformeSinteticoBaseRead)
def read_informe_sintetico(informe_id: int, db: Session = Depends(get_db)):
    return services.leer_informe_sintetico(db, informe_id)

@router.post("/", response_model=schemas.InformeSinteticoBaseRead)
def create_informe_sintetico(
    informe: schemas.InformeSinteticoBaseCreate, db: Session = Depends(get_db)
):
    return services.crear_informe_sintetico(db, informe)