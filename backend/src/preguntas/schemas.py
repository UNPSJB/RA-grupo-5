from pydantic import BaseModel
from typing import Optional, List
from src.preguntas.models import TipoPreguntaEnum
from src.opcionesRespuestas.schemas import OpcionRespuestaRead


class PreguntaBase(BaseModel):
    texto_pregunta: str
    tipo: TipoPreguntaEnum
    obligatoria: bool
    condicion: Optional[str] = None

class PreguntaCreate(PreguntaBase):
    id_variable: int   # al crear hay que especificar la variable


class PreguntaUpdate(PreguntaBase):
    pass


class PreguntaRead(PreguntaBase):
    id: int
    id_variable: int
    opcionesRespuestas: List[OpcionRespuestaRead]  = []  #incluimos las opciones
    model_config = {"from_attributes": True}