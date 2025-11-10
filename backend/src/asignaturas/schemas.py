from pydantic import BaseModel
from typing import List
from src.asignaturas.models import Cursado
from src.carreras.schemas import CarreraRead
#from src.encuestas_asignaturas.schemas import EncuestaAsignaturaRead

class AsignaturaBase(BaseModel):
    nombre: str
    año: int
    nombre_docente: str
    cursado: Cursado
    sede: str
    id_carrera: int


class AsignaturaCreate(AsignaturaBase):
    pass


class AsignaturaUpdate(AsignaturaBase):
    pass


class AsignaturaRead(AsignaturaBase):
    id: int
    carrera: CarreraRead
    #encuestas_asignaturas: List[EncuestaAsignaturaRead] = []
    model_config = {"from_attributes": True}
