from pydantic import BaseModel
from typing import List
from src.encuestas.models import EstadoEncuesta, Cursado
from datetime import date
from src.variables.schemas import VariableRead


class EncuestaBase(BaseModel):
    asignatura: str
    año: int
    estado: EstadoEncuesta
    cursado: Cursado
    fecha_inicio: date
    fecha_fin: date
    carrera: str
    sede: str
    


class EncuestaCreate(EncuestaBase):
    pass


class EncuestaUpdate(EncuestaBase):
    pass


class EncuestaRead(EncuestaBase):
    id: int
    variables: List[VariableRead]  = []  #incluimos las variables
    model_config = {"from_attributes": True}
