from pydantic import BaseModel, model_validator
from typing import Optional, List
from src.preguntas.models import TipoPreguntaEnum
from src.pregunta_opcion.schemas import PreguntaOpcionRead

class PreguntaBase(BaseModel):
    texto_pregunta: str 
    tipo: TipoPreguntaEnum
    obligatoria: bool

class PreguntaCreate(PreguntaBase):
    id_variable: Optional[int] = None
    id_informe_base: Optional[int] = None
    id_pregunta_padre: Optional[int] = None


    @model_validator(mode='after')
    def check_context(self):
        """Valida que la pregunta pertenezca al menos a un contexto."""
        if (
            self.id_variable is None and
            self.id_informe_base is None and
            self.id_pregunta_padre is None
        ):
            raise ValueError("La pregunta debe estar asociada a una Variable, un InformeBase o una PreguntaPadre.")
        return self
class PreguntaUpdate(PreguntaBase):
    pass


class PreguntaRead(PreguntaBase):
    id: int
    id_variable: Optional[int]
    id_informe_base: Optional[int]
    id_pregunta_padre: Optional[int]
    pregunta_opcion: List[PreguntaOpcionRead]
    model_config = {"from_attributes": True}