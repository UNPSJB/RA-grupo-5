from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from src.opciones_respuesta.schemas import OpcionRespuestaRead


class PreguntaOpcionBase(BaseModel):
    id_pregunta: int
    id_opcion_respuesta: Optional[int] = None

class PreguntaOpcionCreate(PreguntaOpcionBase):
    pass

class PreguntaOpcionUpdate(PreguntaOpcionBase):
    pass

class PreguntaOpcionRead(PreguntaOpcionBase):
    id: int
    opcion_respuesta: Optional[OpcionRespuestaRead] = None
    
    model_config = ConfigDict(from_attributes=True)
