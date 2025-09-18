from pydantic import BaseModel
from typing import Optional


class VariableBase(BaseModel):
    nombre: str
    codigo: str


class VariableCreate(VariableBase):
    id_encuesta: int


class VariableUpdate(BaseModel):
    nombre: Optional[str] = None
    codigo: Optional[str] = None
    id_encuesta: Optional[int] = None


class Variable(VariableBase):
    id: int
    id_encuesta: int

    model_config = {"from_attributes": True}
