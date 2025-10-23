from pydantic import BaseModel
from typing import List, Optional
from src.detalle_respuesta.schemas import DetalleRespuesta


class RespuestaBase(BaseModel):
    pass

class RespuestaCreate(RespuestaBase):
    id_persona: int
    id_encuesta_asignatura: Optional[int] = None
    id_informe_asignatura: Optional[int] = None

class RespuestaRead(RespuestaBase):
    id: int
    id_persona: int
    id_encuesta_asignatura: Optional[int] = None
    id_informe_asignatura: Optional[int]  = None
    detalles: List[DetalleRespuesta]  = []  #incluimos las preguntas
    model_config = {"from_attributes": True}