from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.informes_asignaturas import schemas, services

router = APIRouter(prefix="/informes-asignaturas", tags=["informes-asignaturas"])

@router.get("/", response_model=list[schemas.InformeAsignaturaRead])
def read_informes_asignaturas(db: Session = Depends(get_db)):
    return services.listar_informes_asignaturas(db)

@router.post("/",response_model=schemas.InformeAsignaturaRead)
def create_informe_asignatura(informe: schemas.InformeAsignaturaCreate,  db: Session = Depends(get_db)):
    return services.crear_informe_asignatura(db,informe)

@router.get("/{informe_id}", response_model=schemas.InformeAsignaturaRead)
def read_informe_asignatura(informe_id: int, db:Session = Depends(get_db)):
    return services.leer_informe_asignatura(db, informe_id)

@router.post("/{informe_id}/confirmar")
def confirmar_informe_asignatura(informe_id: int):
    # lógica para confirmar el informe
    # Simula que se guardo correctamente
    return {"status": "ok", "mensaje": f"Informe {informe_id} confirmado"}