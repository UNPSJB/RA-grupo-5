from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from . import schemas, services

router = APIRouter(prefix="/informe-sintetico-carrera", tags=["informe-sintetico-carrera"])

@router.get("/", response_model=list[schemas.InformeSinteticoCarreraRead])
def read_informes_sinteticos_carrera(db: Session = Depends(get_db)):
    return services.listar_informes_sinteticos_carrera(db)

@router.post("/",response_model=schemas.InformeSinteticoCarreraRead)
def create_informe_sintetico_carrera(informe: schemas.InformeSinteticoCarreraCreate,  db: Session = Depends(get_db)):
    return services.crear_informe_sintetico_carrera(db,informe)

@router.get("/{informe_id}", response_model=schemas.InformeSinteticoCarreraRead)
def read_informe_sintetico_carrera(informe_id: int, db:Session = Depends(get_db)):
    return services.leer_informe_sintetico_carrera(db, informe_id)

@router.get("/departamento/{persona_id}", response_model=list[schemas.InformeSinteticoCarreraRead])
def read_informes_respondidos_departamento(persona_id: int, db: Session = Depends(get_db)):
    return services.listar_informes_respondidos_departamento(db, persona_id)