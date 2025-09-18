from pydantic import BaseModel
from typing import Optional
from src.preguntas.models import TipoPreguntaEnum


class PreguntaBase(BaseModel):
    texto_pregunta: str
    tipo: TipoPreguntaEnum
    obligatoria: bool
    condicion: Optional[str] = None


class PreguntaCreate(PreguntaBase):
    id_variable: int   # al crear hay que especificar la variable


class PreguntaUpdate(PreguntaBase):
    pass


class Pregunta(PreguntaBase):
    id: int
    id_variable: int

    model_config = {"from_attributes": True}