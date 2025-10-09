from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped,mapped_column,relationship
from src.models import ModeloBase

class Respuesta(ModeloBase):
    __abstract__ = "respuestas" 

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)   
    alumno: Mapped[str] = mapped_column(String, index=True) # Esto es una relacion con la tabla alumnos/usuario
    id_encuesta_asignatura: Mapped[int] = mapped_column(ForeignKey("encuesta_asignatura.id"))
    encuesta_asignatura = relationship("Encuesta_asignatura", back_populates="respuestas")
    
    det_respuesta = relationship("Detalle_respuesta", back_populates="respuesta")