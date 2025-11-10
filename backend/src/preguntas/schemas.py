from pydantic import BaseModel, model_validator, ConfigDict
from typing import Optional, List
from src.preguntas.models import TipoPreguntaEnum
# --- CORRECCIÓN 3: Importar el schema 'Read' de los hijos ---
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
        # (Tu lógica de validación está bien)
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
    
    # --- CORRECCIÓN 4: Añadir la lista de opciones ---
    # Esto le dará a React las opciones (como Si/No) para cada pregunta
    pregunta_opcion: List[PreguntaOpcionRead] = []
    
    model_config = {"from_attributes": True}