from sqlalchemy import delete, select
from sqlalchemy.orm import Session, joinedload
from src.informe_sintetico_carrera.models import InformeSinteticoCarrera
from src.informe_sintetico_carrera import schemas


def listar_informes_sinteticos_carrera(db:Session):
    return (
        db.query(InformeSinteticoCarrera)
        .options(
            joinedload(InformeSinteticoCarrera.carrera),
            joinedload(InformeSinteticoCarrera.informe_sintetico_base)
        )
        .all()
    )

def crear_informe_sintetico_carrera(db: Session, informe: schemas.InformeSinteticoCarreraCreate) -> schemas.InformeSinteticoCarreraRead:
    _informe = InformeSinteticoCarrera(**informe.model_dump())
    db.add(_informe)
    db.commit()
    db.refresh(_informe)
    return _informe

def leer_informe_sintetico_carrera(db: Session, informe_id: int)-> schemas.InformeSinteticoCarreraRead:
    db_informe = db.scalar(select(InformeSinteticoCarrera).where(InformeSinteticoCarrera.id == informe_id))
    if db_informe is None:
        return {"message": "Informe no encontrado"}
    return db_informe
