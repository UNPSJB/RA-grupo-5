from pydantic import BaseModel
from typing import Optional, List

class DetalleRespuestaBase(BaseModel):
    id_opc_respuesta: int
    id_respuesta: int

class DetalleRespuestaCreate(DetalleRespuestaBase):
    pass

class DetalleRespuesta(DetalleRespuestaBase):
    id: int
    id_opc_respuesta: int
    id_respuesta: int
    
    model_config = {"from_attributes": True}