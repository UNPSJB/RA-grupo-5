from pydantic import BaseModel, ConfigDict
from typing import List
from src.preguntas.schemas import PreguntaRead 

class InformeBaseBase(BaseModel):
    titulo: str
    
class InformeBaseCreate(InformeBaseBase):
    pass

class InformeBaseUpdate(InformeBaseBase):
    pass

class InformeBaseRead(InformeBaseBase):
    id: int
    
    preguntas: List[PreguntaRead] = []
    
    model_config = ConfigDict(from_attributes=True)