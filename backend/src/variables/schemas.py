from pydantic import BaseModel, EmailStr
from typing import List
from src import Encuesta


class VariableBase(BaseModel):
    nombre: str
    codigo: str


class VariableCreate(VariableBase):
    pass


class VariableUpdate(VariableBase):
    pass


class Variable(VariableBase):
    id: int
    encuesta: int
    model_config = {"from_attributes": True}