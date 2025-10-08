from pydantic import BaseModel
from typing import List
from src.asignaturas.models import Cursado
from src.encuestas_asignaturas.schemas import EncuestaAsignaturaRead

class AsignaturaBase(BaseModel):
    nombre: str
    año: int
    nombre_docente: str
    cursado: Cursado
    carrera: str
    sede: str


class AsignaturaCreate(AsignaturaBase):
    pass


class AsignaturaUpdate(AsignaturaBase):
    pass


class AsignaturaRead(AsignaturaBase):
    id: int
    encuestas_asignaturas: List[EncuestaAsignaturaRead] = []
    model_config = {"from_attributes": True}
