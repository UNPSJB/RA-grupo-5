from pydantic import BaseModel, ConfigDict

class InformeSinteticoBase(BaseModel):
    titulo: str
    
class InformeSinteticoBaseCreate(InformeSinteticoBase):
    pass 

class InformeSinteticoBaseRead(InformeSinteticoBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
