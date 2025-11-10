from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from src.opciones_respuesta.schemas import OpcionRespuestaRead

# --- 1. Importación NORMAL (ya no es circular) ---
from src.preguntas.schemas import PreguntaRead

class PreguntaOpcionBase(BaseModel):
    id_pregunta: int
    id_opcion_respuesta: Optional[int] = None

class PreguntaOpcionCreate(PreguntaOpcionBase):
    pass

class PreguntaOpcionUpdate(PreguntaOpcionBase):
    pass

class PreguntaOpcionRead(PreguntaOpcionBase):
    id: int
    opcion_respuesta: Optional[OpcionRespuestaRead] = None
    
    # --- 2. Campo Anidado (Necesario para el frontend) ---
    pregunta: PreguntaRead 
    
    model_config = ConfigDict(from_attributes=True)

# --- 3. Ya no necesitamos 'model_rebuild()' ---