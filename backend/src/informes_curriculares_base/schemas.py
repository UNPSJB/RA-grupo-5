from pydantic import BaseModel
from typing import List
from src.preguntas.schemas import PreguntaRead

class InformeCurricularBase(BaseModel):
    titulo: str
    

class InformeCurricularBaseCreate(InformeCurricularBase):
    pass

class InformeCurricularBaseUpdate(InformeCurricularBase):
    pass

class InformeCurricularBaseRead(InformeCurricularBase):
    id: int
    preguntas: List[PreguntaRead] = []
    model_config = {"from_attributes": True}