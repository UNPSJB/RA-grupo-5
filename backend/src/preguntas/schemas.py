from pydantic import BaseModel
from typing import Optional, List
from src.preguntas.models import TipoPreguntaEnum
from src.opciones_respuesta.schemas import OpcionRespuestaRead
from src.pregunta_opcion.schemas import PreguntaOpcionRead

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
    pregunta_opcion: List[PreguntaOpcionRead]
    model_config = {"from_attributes": True}