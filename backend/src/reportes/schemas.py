from pydantic import BaseModel, EmailStr
from typing import List
from enum import Enum
from src.encuestas.models import Cursado
from datetime import date
from src.reportes.models import Reporte


class ReporteBase(BaseModel):
    id: int
    asignatura: str
    año: int
    cursado: Cursado
    carrera: str
    sede: str

class ReporteCreate(ReporteBase):
    pass

class ReporteUpdate(ReporteBase):
    pass    

class Reporte(ReporteBase):
    id: int
    model_config = {"from_attributes": True}



