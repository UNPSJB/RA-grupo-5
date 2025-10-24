from pydantic import BaseModel
from typing import Optional
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
    model_config = {"from_attributes": True}

