from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from src.encuestas_asignaturas.models import EstadoEncuesta
from src.asignaturas.schemas import AsignaturaRead
from src.encuestas_base.schemas import EncuestaBaseRead
from src.respuestas.schemas import RespuestaRead

class EncuestaAsignaturaBase(BaseModel):
    fecha_inicio: date = date(2025, 7, 1)
    fecha_fin: date = date(2025, 12, 31)
    ciclo_lectivo: int
    estado: EstadoEncuesta

class EncuestaAsignaturaCreate(EncuestaAsignaturaBase):
    id_encuesta_base: int
    id_asignatura: int

class EncuestaAsignaturaUpdate(EncuestaAsignaturaBase):
    id_encuesta_base: int
    id_asignatura: int

class EncuestaAsignaturaRead(EncuestaAsignaturaBase):
    id: int
    id_encuesta_base: int
    id_asignatura: int
    encuesta_base: EncuestaBaseRead
    asignatura: AsignaturaRead
    respuestas: List[RespuestaRead] = []
    estado: EstadoEncuesta
    model_config = {"from_attributes": True}

# --- NUEVO SCHEMA PARA EL LISTADO ---
class EncuestaListado(EncuestaAsignaturaRead):
    respondida: bool