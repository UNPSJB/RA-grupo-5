from pydantic import BaseModel, ConfigDict
from typing import Optional, List

from src.pregunta_opcion.schemas import PreguntaOpcionRead

class DetalleRespuestaBase(BaseModel):
    id_pregunta_opcion: int
    texto_respuesta_abierta: Optional[str] = None

class DetalleRespuestaCreate(DetalleRespuestaBase):
    pass 

class DetalleRespuestaRead(DetalleRespuestaBase):
    id: int
    id_respuesta: int
    
    pregunta_opcion: PreguntaOpcionRead
    
    model_config = ConfigDict(from_attributes=True)