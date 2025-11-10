from pydantic import BaseModel
from typing import List
from src.carreras.models import Carrera

class CarreraBase(BaseModel):
    nombre: str
    sede: str

class CarreraCreate(CarreraBase):
    pass

class CarreraRead(CarreraBase):
    id: int
    model_config = {"from_attributes": True}
