from pydantic import BaseModel
from typing import Optional, List
from src.detalle_respuesta.schemas import DetalleRespuesta

class RespuestaBase(BaseModel):
    pass

class RespuestaCreate(RespuestaBase):
    id_persona: int
    id_encuesta_asignatura: int

class RespuestaRead(RespuestaBase):
    id_persona: int
    id_encuesta_asignatura: int
    detalles: List[DetalleRespuesta]

class Respuesta(RespuestaBase):
    id: int
    id_persona: int
    id_encuesta_asignatura: int
    detalles: List[DetalleRespuesta]

    model_config = {"from_attributes": True}