from pydantic import BaseModel, model_validator
from typing import Optional, List
from src.preguntas.models import TipoPreguntaEnum
from src.pregunta_opcion.schemas import PreguntaOpcionRead

class PreguntaBase(BaseModel):
    texto_pregunta: str 
    tipo: TipoPreguntaEnum
    obligatoria: bool

class PreguntaCreate(PreguntaBase):
    id_variable: Optional[int] = None   # al crear hay que especificar la variable
    id_informe_curricular_base: Optional[int] = None  # o el informe base al que pertenece
    id_informe_sintetico_base: Optional[int] = None  # o el informe sintetico al que pertenece

    @model_validator(mode='after')
    def check_context(self):
        """Valida que la pregunta pertenezca al menos a un contexto."""
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
    model_config = {"from_attributes": True}