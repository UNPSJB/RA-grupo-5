from pydantic import BaseModel

class PreguntaOpcionBase(BaseModel):
    id_pregunta: int
    id_opcion_respuesta: int

class PreguntaOpcionCreate(PreguntaOpcionBase):
    pass

class PreguntaOpcionUpdate(PreguntaOpcionBase):
    pass

class PreguntaOpcionRead(PreguntaOpcionBase):
    id: int
    id_pregunta: int
    id_opcion_respuesta: int
    model_config = {"from_attributes": True}

