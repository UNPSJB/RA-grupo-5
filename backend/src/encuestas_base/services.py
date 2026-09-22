from typing import List
from sqlalchemy import select, update
from sqlalchemy.orm import Session, joinedload
from src.encuestas_base.models import EncuestaBase
from src.encuestas_base import schemas, exceptions


# CRUD:

def listar_encuestas_base(db:Session) -> List[schemas.EncuestaBaseRead]:
    return db.scalars(select(EncuestaBase)).all()


def crear_encuesta_base(db: Session, encuesta: schemas.EncuestaBaseCreate) -> schemas.EncuestaBaseRead:
    _encuestabase = EncuestaBase(**encuesta.model_dump())
    db.add(_encuestabase)
    db.commit()
    db.refresh(_encuestabase)
    return _encuestabase

def leer_encuesta_base(db: Session, encuesta_base_id: int)-> schemas.EncuestaBaseRead:
    db_encuesta_base = db.scalar(select(EncuestaBase).where(EncuestaBase.id == encuesta_base_id))
    if db_encuesta_base is None:
        raise exceptions.EncuestaBaseNoEncontrada()
    return db_encuesta_base


def modificar_encuesta_base(
    db: Session, encuesta_base_id: int, encuesta_base: schemas.EncuestaBaseUpdate) -> EncuestaBase:
    db_encuesta_base = leer_encuesta_base(db, encuesta_base_id)
    db.execute(update(EncuestaBase).where(EncuestaBase.id == encuesta_base_id).values(**encuesta_base.model_dump()))
    db.commit()
    db.refresh(db_encuesta_base)
    return db_encuesta_base


def eliminar_encuesta_base(db: Session, encuesta_base_id: int) -> dict:
    db_encuesta_base = leer_encuesta_base(db, encuesta_base_id)
    db.delete(db_encuesta_base)
    db.commit()
    return {"message": f"Encuesta base eliminada"}

def obtener_encuesta_base_vigente(db: Session, ciclo_lectivo: int, ciclo_tipo: str):
    """
    Busca la EncuestaBase que esté vigente para el año del ciclo lectivo 
    y el ciclo correspondiente (básico/superior).
    """
    encuesta_base = (
        db.query(EncuestaBase)
        .filter(
            EncuestaBase.ciclo == ciclo_tipo,
            EncuestaBase.anio_inicio <= ciclo_lectivo,
            EncuestaBase.anio_fin >= ciclo_lectivo
        )
        .first()
    )
    
    if not encuesta_base:
        raise ValueError(f"No existe una encuesta base configurada para el ciclo {ciclo_tipo} en el año {ciclo_lectivo}")
        
    return encuesta_base


