from pydantic import BaseModel
from typing import List
from enum import Enum
from src.encuestas.models import Ciclo
from datetime import date
from src.variables.schemas import VariableRead
from src.encuestas_asignaturas.schemas import EncuestaAsignaturaRead


class EncuestaBase(BaseModel):
    nombre: str
    ciclo: Ciclo
    
class EncuestaCreate(EncuestaBase):
    pass

class EncuestaUpdate(EncuestaBase):
    pass


class EncuestaRead(EncuestaBase):
    id: int
    variables: List[VariableRead]  = []  #incluimos las variables
    encuestas_asignaturas: List[EncuestaAsignaturaRead] = []  #incluimos las encuestas de asignaturas
    model_config = {"from_attributes": True}
