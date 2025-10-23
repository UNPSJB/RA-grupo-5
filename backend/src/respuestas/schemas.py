from pydantic import BaseModel
from typing import Optional, List
from src.detalle_respuesta.schemas import DetalleRespuestaCreate, DetalleRespuestaRead

class RespuestaBase(BaseModel):
    id_persona: int
    id_encuesta_asignatura: int

class RespuestaCreate(RespuestaBase):
    detalles: List[DetalleRespuestaCreate]

class RespuestaRead(RespuestaBase):
    id: int
    detalles: List[DetalleRespuestaRead]

    model_config = {"from_attributes": True}