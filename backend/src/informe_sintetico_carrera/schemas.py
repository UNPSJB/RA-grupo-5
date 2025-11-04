from pydantic import BaseModel, ConfigDict
from typing import List, Optional

from src.carreras.schemas import CarreraRead
from src.informes_asignaturas.schemas import InformeAsignaturaRead
from src.informes_sinteticos_base.schemas import InformeSintetico


class InformeSinteticoCarreraBase(BaseModel):
    ciclo_lectivo: str
    comision_asesora: str
    sede: str
    integrantes: str
    id_carrera: int
    id_informe_sintetico: int

class InformeSinteticoCarreraCreate(InformeSinteticoCarreraBase):
    pass

class InformeSinteticoCarreraRead(InformeSinteticoCarreraBase):
    id: int
    carrera: CarreraRead
    informe_sintetico: InformeSintetico
    
    informes_asignaturas: List[InformeAsignaturaRead] = []

    model_config = ConfigDict(from_attributes=True)