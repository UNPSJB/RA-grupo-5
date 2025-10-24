from pydantic import BaseModel
from typing import Optional, List

class DetalleRespuestaBase(BaseModel):
    id_pregunta_opcion: int
    texto_respuesta_abierta: Optional[str] = None

class DetalleRespuestaCreate(DetalleRespuestaBase):
    pass 

class DetalleRespuestaRead(DetalleRespuestaBase):
    id: int
    id_respuesta: int
    model_config = {"from_attributes": True}