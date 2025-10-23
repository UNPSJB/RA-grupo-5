from pydantic import BaseModel
from typing import Optional, List

class DetalleRespuestaBase(BaseModel):
    id_pregunta_opcion: int
    texto_respuesta_abierta: Optional[str] = None

class DetalleRespuestaCreate(DetalleRespuestaBase):
    id_pregunta_opcion: int
    id_respuesta: int
    texto_respuesta_abierta: Optional[str] = None

class DetalleRespuestaRead(DetalleRespuestaBase):
    id: int
    id_pregunta_opcion: int
    texto_respuesta_abierta: Optional[str] = None
    model_config = {"from_attributes": True}