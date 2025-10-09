from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.asignaturas import schemas, services

router = APIRouter(prefix="/asignaturas", tags=["asignaturas"])


@router.post("/", response_model=schemas.AsignaturaRead)
def create_asignatura(asignatura: schemas.AsignaturaCreate, db: Session = Depends(get_db)):
    return services.crear_asignatura(db, asignatura)


@router.get("/", response_model=list[schemas.AsignaturaRead])
def read_asignaturas(db: Session = Depends(get_db)):
    return services.listar_asignaturas(db)


@router.put("/{asignatura_id}", response_model=schemas.AsignaturaRead)
def update_asignatura(
    asignatura_id: int, asignatura: schemas.AsignaturaUpdate, db: Session = Depends(get_db)):
    return services.modificar_asignatura(db, asignatura_id, asignatura)


@router.delete("/{asignatura_id}", response_model=schemas.AsignaturaRead)
def delete_asignatura(asignatura_id: int, db: Session = Depends(get_db)): 
    return services.eliminar_asignatura(db, asignatura_id)