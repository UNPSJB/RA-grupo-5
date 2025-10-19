from pydantic import BaseModel
from typing import Optional, List

class DetalleRespuestaBase(BaseModel):
    pass

class DetalleRespuestaCreate(DetalleRespuestaBase):
    id_opciones_respuesta: int
    id_respuesta: int

class DetalleRespuesta(DetalleRespuestaBase):
    id: int
    id_opciones_respuesta: int
    id_respuesta: int
    
    model_config = {"from_attributes": True}