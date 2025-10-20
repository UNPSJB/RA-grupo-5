from pydantic import BaseModel
from typing import List
from src.informes_base.models import Sede
from src.preguntas.schemas import PreguntaRead

class InformeBaseBase(BaseModel):
    sede: Sede
    ciclo_lectivo: int
    docente: str
    cant_alumnos_insc: int
    cant_comisiones_teoricas: int
    cant_comisiones_practicas: int

class InformeBaseCreate(InformeBaseBase):
    pass

class InformeBaseUpdate(InformeBaseBase):
    pass

class InformeBaseRead(InformeBaseBase):
    id: int
    preguntas: List[PreguntaRead] = []
    model_config = {"from_attributes": True}