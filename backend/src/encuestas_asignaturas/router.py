from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.encuestas_asignaturas import schemas, services

router = APIRouter(prefix="/encuestas-asignaturas", tags=["encuestas-asignaturas"])



@router.get("/", response_model=list[schemas.EncuestaAsignaturaRead])
def read_encuestas_asignaturas(db: Session = Depends(get_db)):
    return services.listar_encuestas_asignaturas(db)


@router.post("/",response_model=schemas.EncuestaAsignaturaRead)
def create_encuesta_asignatura(encuesta: schemas.EncuestaAsignaturaCreate,  db: Session = Depends(get_db)):
    return services.crear_encuesta_asignatura(db,encuesta)


@router.get("/{encuesta_id}", response_model=schemas.EncuestaAsignaturaRead)
def read_encuesta_asignatura(encuesta_id: int, db:Session = Depends(get_db)):
    return services.leer_encuesta_asignatura(db, encuesta_id)



# #ver encuesta por id con sus variables
# @router.get("/{encuesta_id}", response_model=schemas.EncuestaRead)
# def read_encuesta(encuesta_id: int, db: Session = Depends(get_db)):
#     return services.get_encuesta_completa(db, encuesta_id)


@router.put("/{encuesta_id}", response_model=schemas.EncuestaAsignaturaRead)
def update_encuesta_asignatura(
    encuesta_id: int, encuesta: schemas.EncuestaAsignaturaUpdate, db: Session = Depends(get_db)):
    return services.modificar_encuesta_asignatura(db, encuesta_id, encuesta)


@router.delete("/{encuesta_id}", response_model=dict)
def delete_encuesta_asignatura(encuesta_id: int, db: Session = Depends(get_db)):
    return services.eliminar_encuesta_asignatura(db, encuesta_id)



@router.post("/{encuesta_id}/confirmar")
def confirmar_encuesta_asignatura(encuesta_id: int):
    # lógica para confirmar la encuesta
    # Simula que se guardo correctamente
    return {"status": "ok", "mensaje": f"Encuesta {encuesta_id} confirmada"}
