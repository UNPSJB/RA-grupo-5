from pydantic import BaseModel
from typing import List
from enum import Enum
from src.encuestas_base.models import Ciclo
from datetime import date
from src.variables.schemas import VariableRead
#from src.encuestas_asignaturas.schemas import EncuestaAsignaturaRead


class EncuestaBaseBase(BaseModel):
    nombre: str
    ciclo: Ciclo
    
class EncuestaBaseCreate(EncuestaBaseBase):
    pass

class EncuestaBaseUpdate(EncuestaBaseBase):
    pass


class EncuestaBaseRead(EncuestaBaseBase):
    id: int
    variables: List[VariableRead]  = []  #incluimos las variables
    #encuestas_asignaturas: List[EncuestaAsignaturaRead] = []
    model_config = {"from_attributes": True}
