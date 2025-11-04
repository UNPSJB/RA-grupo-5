from pydantic import BaseModel, ConfigDict
from typing import Optional, List

# Importamos el schema que necesitamos anidar
from src.pregunta_opcion.schemas import PreguntaOpcionRead

class DetalleRespuestaBase(BaseModel):
    id_pregunta_opcion: int
    texto_respuesta_abierta: Optional[str] = None

class DetalleRespuestaCreate(DetalleRespuestaBase):
    pass 

class DetalleRespuestaRead(DetalleRespuestaBase):
    id: int
    id_respuesta: int
    
    # --- ¡CAMPO ANIDADO AÑADIDO! ---
    # Esto anida la pregunta_opcion (que contiene la pregunta)
    pregunta_opcion: PreguntaOpcionRead
    
    model_config = ConfigDict(from_attributes=True)