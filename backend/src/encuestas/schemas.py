from pydantic import BaseModel, EmailStr
from typing import List
from enum import Enum
from src.encuestas.models import EstadoEncuesta, Cursado
from datetime import date
from src.variables.schemas import VariableBase


class EncuestaBase(BaseModel):
    asignatura: str
    año: int
    estado: EstadoEncuesta
    cursado: Cursado
    fecha_inicio: date
    fecha_fin: date
    carrera: str
    sede: str
    variables: List[VariableBase]


class EncuestaCreate(EncuestaBase):
    pass


class EncuestaUpdate(EncuestaBase):
    pass


class Encuesta(EncuestaBase):
    id: int
    model_config = {"from_attributes": True}
