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

@router.get("/docente/{persona_id}", response_model=list[schemas.InformeAsignaturaRead])
def read_informes_respondidos_docente(persona_id: int, db:Session = Depends(get_db)):
    return services.listar_informes_respondidos_docente(db, persona_id)

@router.post("/{informe_id}/confirmar")
def confirmar_informe_asignatura(informe_id: int):
    # lógica para confirmar el informe
    # Simula que se guardo correctamente
    return {"status": "ok", "mensaje": f"Informe {informe_id} confirmado"}

@router.get("/estado/listado", response_model=list[schemas.InformeAsignaturaEstado])
def read_informes_asignaturas_estado(db: Session = Depends(get_db)):
    """
    Listado con flags derivados para la UI:
      - hasRespuesta: True si existe una respuesta vinculada
      - respuestaId: id de la respuesta (si existe)
      - canResponder: True solo si estado='abierto' y sin respuesta
    """
    return services.listar_informes_asignaturas_estado(db)

@router.get("/estado/{informe_id}", response_model=schemas.InformeAsignaturaEstado)
def read_informe_asignatura_estado(informe_id: int, db: Session = Depends(get_db)):
    """
    Estado derivado por ID. Útil como guard antes de renderizar el formulario.
    """
    try:
        return services.leer_informe_asignatura_estado(db, informe_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Informe no encontrado")