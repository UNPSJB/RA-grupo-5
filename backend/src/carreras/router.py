from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.carreras import schemas, services

router = APIRouter(prefix="/carreras", tags=["carreras"])

@router.post("/", response_model=schemas.CarreraRead)
def create_carrera(carrera: schemas.CarreraCreate, db: Session = Depends(get_db)):
    return services.crear_carrera(db, carrera)

@router.get("/", response_model=list[schemas.CarreraRead])
def read_carreras(db: Session = Depends(get_db)):
    return services.listar_carreras(db)

@router.get("/{carrera_id}", response_model=schemas.CarreraRead)
def read_carrera(carrera_id: int, db: Session = Depends(get_db)):
    return services.leer_carrera(db, carrera_id)

