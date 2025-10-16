from pydantic import BaseModel

class OpcionRespuestaBase(BaseModel):
    texto_opcion: str
    
class OpcionRespuestaCreate(OpcionRespuestaBase):
    id_pregunta: int #al crear hay que especificar la pregunta

class OpcionRespuestaUpdate(OpcionRespuestaBase):
    pass

class OpcionRespuestaRead(OpcionRespuestaBase):
    id: int
    id_pregunta: int
    model_config = {"from_attributes": True}

