from src.preguntas.schemas import PreguntaRead
from pydantic import BaseModel
from typing import List, Optional


class VariableBase(BaseModel):
    nombre: str
    codigo: str


class VariableCreate(VariableBase):
    id_encuesta: int


class VariableUpdate(BaseModel):
    nombre: Optional[str] = None
    codigo: Optional[str] = None
    id_encuesta: Optional[int] = None


class VariableRead(VariableBase):
    id: int
    id_encuesta: int
    preguntas: List[PreguntaRead]  = []  #incluimos las preguntas
    model_config = {"from_attributes": True}
