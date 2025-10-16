from pydantic import BaseModel
from typing import List, Optional
from src.encuestas_asignaturas.models import EstadoEncuesta
from src.asignaturas.schemas import AsignaturaRead
from src.encuestas_base.schemas import EncuestaBaseRead
from datetime import date

class EncuestaAsignaturaBase(BaseModel):
    fecha_inicio: date
    fecha_fin: date
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
    model_config = {"from_attributes": True}
