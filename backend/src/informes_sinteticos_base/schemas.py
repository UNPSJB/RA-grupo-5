from pydantic import BaseModel, ConfigDict

class InformeSinteticoBase(BaseModel):
    titulo: str
    comision_asesora: str
    sede: str
    integrantes: int

class InformeSinteticoCreate(InformeSinteticoBase):
    pass 

class InformeSintetico(InformeSinteticoBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
