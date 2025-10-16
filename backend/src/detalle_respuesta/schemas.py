from pydantic import BaseModel
from typing import Optional, List

class DetalleRespuestaBase(BaseModel):
    id_opc_respuesta: int
    id_respuesta: int
    texto_resp_abierta: Optional[str] = None  # Para respuestas abiertas

class DetalleRespuestaCreate(DetalleRespuestaBase):
    pass

class DetalleRespuesta(DetalleRespuestaBase):
    id: int

    model_config = {"from_attributes": True}