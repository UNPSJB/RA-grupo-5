from pydantic import BaseModel, model_validator, ConfigDict
from typing import Optional, List
from src.preguntas.models import TipoPreguntaEnum

from src.pregunta_opcion.schemas import PreguntaOpcionRead 

class PreguntaBase(BaseModel):
    texto_pregunta: str 
    tipo: TipoPreguntaEnum
    obligatoria: bool
    codigo: Optional[str] = None 

class PreguntaCreate(PreguntaBase):
    id_variable: Optional[int] = None
    id_informe_curricular_base: Optional[int] = None
    id_informe_sintetico_base: Optional[int] = None

    @model_validator(mode='after')
    def check_context(self):
        if (
            self.id_variable is None
            and self.id_informe_curricular_base is None
            and self.id_informe_sintetico_base is None    
        ):
            raise ValueError("La pregunta debe estar asociada a una Variable o un InformeBase o un InformeSinteticoBase.")
        return self

class PreguntaUpdate(PreguntaBase):
    pass

class PreguntaRead(PreguntaBase):
    id: int
    id_variable: Optional[int] = None
    id_informe_curricular_base: Optional[int] = None
    id_informe_sintetico_base: Optional[int] = None
    pregunta_opcion: List[PreguntaOpcionRead] = []
    
    model_config = ConfigDict(from_attributes=True)
