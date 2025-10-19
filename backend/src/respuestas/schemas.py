from pydantic import BaseModel
from typing import Optional

class RespuestaBase(BaseModel):
    pass

class RespuestaCreate(RespuestaBase):
    id_persona: int
    id_encuesta_asignatura: int

class Respuesta(RespuestaBase):
    id: int
    id_persona: int
    id_encuesta_asignatura: int

    model_config = {"from_attributes": True}