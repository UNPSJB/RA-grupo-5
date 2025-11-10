from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session, joinedload, selectinload
from fastapi import HTTPException

# --- CORRECCIÓN 1: Importar todos los modelos necesarios para los JOINS ---
from src.encuestas_asignaturas.models import EncuestaAsignatura
from src.encuestas_base.models import EncuestaBase
from src.variables.models import Variable
from src.preguntas.models import Pregunta
from src.pregunta_opcion.models import PreguntaOpcion
from src.opciones_respuesta.models import OpcionRespuesta
from src.asignaturas.models import Asignatura

from src.encuestas_asignaturas import schemas


# --- Helper para la consulta ansiosa (Eager Loading) ---
def _get_eager_loading_query():
    """
    Esta consulta fuerza la carga de toda la jerarquía necesaria
    para contestar una encuesta:
    EncuestaAsignatura -> EncuestaBase -> Variables -> Preguntas -> Opciones
    """
    return select(EncuestaAsignatura).options(
        joinedload(EncuestaAsignatura.asignatura),
        joinedload(EncuestaAsignatura.encuesta_base).options(
            selectinload(EncuestaBase.variables).options(
                selectinload(Variable.preguntas).options(
                    selectinload(Pregunta.pregunta_opcion).options(
                        joinedload(PreguntaOpcion.opcion_respuesta)
                    )
                )
            )
        )
    )

# --- CRUD Corregido ---

def listar_encuestas_asignaturas(db:Session):
    # (Esta función ya estaba bien para la lista)
    return (
        db.query(EncuestaAsignatura)
        .options(
            joinedload(EncuestaAsignatura.asignatura),
            joinedload(EncuestaAsignatura.encuesta_base)
        )
        .all()
    )


def crear_encuesta_asignatura(db: Session, encuesta: schemas.EncuestaAsignaturaCreate) -> EncuestaAsignatura:
    _encuesta = EncuestaAsignatura(**encuesta.model_dump())
    db.add(_encuesta)
    db.commit()
    db.refresh(_encuesta)
    
    # --- CORRECCIÓN 2: Devolver el objeto completo ---
    # Llamamos a 'leer_encuesta_asignatura' para obtener la versión con 'joinedload'
    return leer_encuesta_asignatura(db, _encuesta.id)

def leer_encuesta_asignatura(db: Session, encuesta_id: int) -> EncuestaAsignatura:
    # --- CORRECCIÓN 3: Usar la consulta "ansiosa" (eager loading) ---
    query = _get_eager_loading_query().where(EncuestaAsignatura.id == encuesta_id)
    
    # Usamos .first() porque .scalar() puede dar errores con joins
    db_encuesta = db.scalars(query).first() 
    
    if db_encuesta is None:
        # --- CORRECCIÓN 4: Lanzar una excepción (mejor práctica) ---
        raise HTTPException(status_code=404, detail="Encuesta no encontrada")
        
    return db_encuesta



def modificar_encuesta_asignatura(
    db: Session, encuesta_id: int, encuesta: schemas.EncuestaAsignaturaUpdate) -> EncuestaAsignatura:
    
    # (No es necesario leer primero, el update lo hace directo)
    db.execute(update(EncuestaAsignatura).where(EncuestaAsignatura.id == encuesta_id).values(**encuesta.model_dump()))
    db.commit()
    
    # --- CORRECCIÓN 5: Devolver el objeto actualizado y completo ---
    return leer_encuesta_asignatura(db, encuesta_id)


def eliminar_encuesta_asignatura(db: Session, encuesta_id: int) -> dict:
    # --- CORRECCIÓN 6: Usar una consulta simple solo para borrar ---
    db_encuesta = db.get(EncuestaAsignatura, encuesta_id)
    if db_encuesta is None:
        raise HTTPException(status_code=404, detail="Encuesta no encontrada")
        
    db.delete(db_encuesta)
    db.commit()
    return {"message": f"Encuesta eliminada"}


