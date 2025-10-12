from pydantic import BaseModel
from typing import Optional, List
from src.preguntas.models import TipoPreguntaEnum
from src.opciones_respuestas.schemas import OpcionRespuestaRead


class PreguntaBase(BaseModel):
    texto_pregunta: str
    tipo: TipoPreguntaEnum
    obligatoria: bool

class PreguntaCreate(PreguntaBase):
    id_variable: int   # al crear hay que especificar la variable


class PreguntaUpdate(PreguntaBase):
    pass


class PreguntaRead(PreguntaBase):
    id: int
    id_variable: int
    opcionesRespuestas: List[OpcionRespuestaRead]  = []  #incluimos las opciones
    model_config = {"from_attributes": True}