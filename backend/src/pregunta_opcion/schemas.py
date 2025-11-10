from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from src.opciones_respuesta.schemas import OpcionRespuestaRead

# --- 1. ELIMINAMOS LA IMPORTACIÓN CIRCULAR ---
# (Ya no importamos 'src.preguntas.schemas')

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
    
    # --- 2. ELIMINAMOS EL CAMPO REDUNDANTE ---
    # (Ya no necesitamos el campo 'pregunta: PreguntaRead')
    
    model_config = ConfigDict(from_attributes=True)

# --- 3. Ya no necesitamos 'model_rebuild()' ---