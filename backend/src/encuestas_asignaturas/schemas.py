from pydantic import BaseModel
from typing import List, Optional
from src.encuestas_asignaturas.models import EstadoEncuesta
from src.asignaturas.schemas import AsignaturaRead
# --- CORRECCIÓN 1: Importar el schema 'Read' (completo), NO el 'Base' ---
from src.encuestas_base.schemas import EncuestaBaseRead
from src.respuestas.schemas import RespuestaRead
from datetime import date
# (Quité 'InformeCurricularBaseRead', no parece pertenecer a una Encuesta de Alumno)

class EncuestaAsignaturaBase(BaseModel):
    fecha_inicio: date
    fecha_fin: date
    estado: EstadoEncuesta

class EncuestaAsignaturaCreate(EncuestaAsignaturaBase):
    id_encuesta_base: int
    id_asignatura: int

class EncuestaAsignaturaUpdate(EncuestaAsignaturaBase):
    id_encuesta_base: int
    id_asignatura: int

class EncuestaAsignaturaRead(EncuestaAsignaturaBase):
    id: int
    id_encuesta_base: int
    id_asignatura: int
    
    # --- CORRECCIÓN 2: Usar el schema 'Read' (completo) ---
    # Esto asegura que la lista 'variables' (y sus hijos) se incluya.
    encuesta_base: EncuestaBaseRead
    
    asignatura: AsignaturaRead
    # (Esta lista de respuestas está bien, una encuesta tiene muchas respuestas)
    respuestas: List[RespuestaRead]
    estado: EstadoEncuesta
    model_config = {"from_attributes": True}