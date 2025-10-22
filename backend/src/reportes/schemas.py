from pydantic import BaseModel, EmailStr
from typing import List
from enum import Enum
from src.asignaturas.models import Cursado
from datetime import date
from src.reportes.models import Reporte
from src.encuestas_asignaturas.schemas import EncuestaAsignaturaRead


class ReporteBase(BaseModel):
    asignatura: str
    año: int
    cursado: Cursado
    carrera: str
    sede: str

class ReporteCreate(ReporteBase):
    id_encuesta_asignatura: int

class ReporteUpdate(ReporteBase):
    id_encuesta_asignatura: int

class Reporte(ReporteBase):
    id: int
    encuesta_asignatura: EncuestaAsignaturaRead
    model_config = {"from_attributes": True}



