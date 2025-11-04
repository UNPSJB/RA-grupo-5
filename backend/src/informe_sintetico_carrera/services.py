from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from fastapi import HTTPException
from typing import List

from src.informe_sintetico_carrera.models import InformeSinteticoCarrera
from src.informes_asignaturas.models import InformeAsignatura
from src.asignaturas.models import Asignatura
from src.respuestas.models import Respuesta
from src.detalle_respuesta.models import DetalleRespuesta
from src.pregunta_opcion.models import PreguntaOpcion
from src.preguntas.models import Pregunta
from src.carreras.models import Carrera
from src.informes_sinteticos_base.models import InformeSinteticoBase
from src.informes_base.models import InformeBase 

from . import schemas


def _get_query_con_joins():
    """
    Helper para cargar TODA la jerarquía de datos.
    ESTA ES LA VERSIÓN COMPLETA Y CORRECTA.
    """
    return select(InformeSinteticoCarrera).options(
        
        # --- Relaciones del Padre ---
        joinedload(InformeSinteticoCarrera.carrera),
        joinedload(InformeSinteticoCarrera.informe_sintetico),
        
        # --- Cadena A: Cargar el nombre de la Asignatura ---
        joinedload(InformeSinteticoCarrera.informes_asignaturas)
            .joinedload(InformeAsignatura.asignatura),
        
        # --- Cadena B: Cargar las Respuestas y sus detalles ---
        joinedload(InformeSinteticoCarrera.informes_asignaturas)
            .joinedload(InformeAsignatura.respuestas)
                .joinedload(Respuesta.detalles)
                    .joinedload(DetalleRespuesta.pregunta_opcion)
                        .joinedload(PreguntaOpcion.pregunta),
        
        # --- Cadena C: Cargar el "molde" y sus preguntas ---
        joinedload(InformeSinteticoCarrera.informes_asignaturas)
            .joinedload(InformeAsignatura.informe_base) 
                .joinedload(InformeBase.preguntas)
    )

def listar_informes_sinteticos_carrera(db: Session) -> List[InformeSinteticoCarrera]:
    query = _get_query_con_joins()
    return db.scalars(query).unique().all()


def crear_informe_sintetico_carrera(db: Session, informe: schemas.InformeSinteticoCarreraCreate) -> InformeSinteticoCarrera:
    _informe = InformeSinteticoCarrera(**informe.model_dump())
    db.add(_informe)
    db.commit()
    db.refresh(_informe)
    return leer_informe_sintetico_carrera(db, _informe.id)


def leer_informe_sintetico_carrera(db: Session, informe_id: int) -> InformeSinteticoCarrera:
    query = _get_query_con_joins().where(InformeSinteticoCarrera.id == informe_id)
    db_informe = db.scalar(query)
    
    if db_informe is None:
        raise HTTPException(
            status_code=404, 
            detail="Informe sintético de carrera no encontrado"
        )
    
    return db_informe