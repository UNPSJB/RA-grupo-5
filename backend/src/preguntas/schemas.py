from pydantic import BaseModel
from typing import Optional, List
from src.preguntas.models import TipoPreguntaEnum
from src.opciones_respuestas.schemas import OpcionRespuestaRead


class PreguntaBase(BaseModel):
    texto_pregunta: str
    tipo: TipoPreguntaEnum
    obligatoria: bool

class PreguntaCreate(PreguntaBase):
    id_variable: Optional[int]   # al crear hay que especificar la variable
    id_informe_base: Optional[int]  # o el informe base al que pertenece
    id_pregunta_padre: Optional[int]  # o la pregunta padre si es subpregunta

class PreguntaUpdate(PreguntaBase):
    pass


class PreguntaRead(PreguntaBase):
    id: int
    id_variable: Optional[int]
    id_informe_base: Optional[int]
    id_pregunta_padre: Optional[int]
    opcionesRespuestas: List[OpcionRespuestaRead]  = []
    model_config = {"from_attributes": True}