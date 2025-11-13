from pydantic import BaseModel, ConfigDict

class OpcionRespuestaBase(BaseModel):
    texto_opcion: str
    
class OpcionRespuestaCreate(OpcionRespuestaBase):
    pass

class OpcionRespuestaUpdate(OpcionRespuestaBase):
    pass

class OpcionRespuestaRead(OpcionRespuestaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

