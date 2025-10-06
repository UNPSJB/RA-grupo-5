from pydantic import BaseModel
from typing import Optional

class RespuestaBase(BaseModel):
    alumno: str  # Esto es una relacion con la tabla alumnos
    id_encuesta_asignatura: int

class RespuestaCreate(RespuestaBase):
    pass

class Respuesta(RespuestaBase):
    id: int

    model_config = {"from_attributes": True}