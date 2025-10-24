from pydantic import BaseModel, model_validator
from typing import Optional, List
from src.detalle_respuesta.schemas import DetalleRespuestaCreate, DetalleRespuestaRead

class RespuestaBase(BaseModel):
    id_persona: int
    id_encuesta_asignatura: Optional[int] = None
    id_informe_asignatura: Optional[int] = None
class RespuestaCreate(RespuestaBase):
    detalles: List[DetalleRespuestaCreate]
    
    @model_validator(mode='after')
    def check_exactly_one_context(self):
        if self.id_encuesta_asignatura and self.id_informe_asignatura:
            raise ValueError("La respuesta no puede pertenecer a una encuesta y un informe a la vez.")
        if not self.id_encuesta_asignatura and not self.id_informe_asignatura:
            raise ValueError("La respuesta debe pertenecer a una encuesta o a un informe.")
        return self

class RespuestaRead(RespuestaBase):
    id: int
    detalles: List[DetalleRespuestaRead]

    model_config = {"from_attributes": True}