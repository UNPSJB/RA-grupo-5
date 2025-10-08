from pydantic import BaseModel
from typing import List, Optional
from src.encuestas_asignaturas.models import EstadoEncuesta
from datetime import date

class EncuestaAsignaturaBase(BaseModel):
    fecha_inicio: date
    fecha_fin: date
    estado: EstadoEncuesta


class EncuestaAsignaturaCreate(EncuestaAsignaturaBase):
    id_encuesta: int
    id_asignatura: int


class EncuestaAsignaturaUpdate(EncuestaAsignaturaBase):
    id_encuesta: int
    id_asignatura: int


class EncuestaAsignaturaRead(EncuestaAsignaturaBase):
    id: int
    model_config = {"from_attributes": True}
