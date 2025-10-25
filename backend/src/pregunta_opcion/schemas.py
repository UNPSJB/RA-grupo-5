from typing import Optional
from pydantic import BaseModel
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
    id_pregunta: int
    id_opcion_respuesta: Optional[int] = None
    opcion_respuesta: Optional[OpcionRespuestaRead] = None
    model_config = {"from_attributes": True}
