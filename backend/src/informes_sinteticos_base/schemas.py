from pydantic import BaseModel, ConfigDict
from typing import List
from src.preguntas.schemas import PreguntaRead

class InformeSinteticoBase(BaseModel):
    titulo: str
    
class InformeSinteticoBaseCreate(InformeSinteticoBase):
    pass 

class InformeSinteticoBaseRead(InformeSinteticoBase):
    id: int
    preguntas: List[PreguntaRead] = []
    model_config = ConfigDict(from_attributes=True)
