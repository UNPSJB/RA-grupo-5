from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
from src.models import ModeloBase

class Respuesta(ModeloBase):

    __tablename__ = "respuestas" 

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)   
    id_persona: Mapped[int] = mapped_column(ForeignKey("personas.id"))
    id_encuesta_asignatura: Mapped[Optional[int]] = mapped_column(ForeignKey("encuestas_asignaturas.id"))
    id_informe_asignatura: Mapped[Optional[int]] = mapped_column(ForeignKey("informes_asignaturas.id"))

    encuesta_asignatura = relationship("EncuestaAsignatura", back_populates="respuestas")
    informe_asignatura = relationship("InformeAsignatura", back_populates="respuesta")

    persona = relationship("Persona", back_populates="respuestas") 
    detalles = relationship("DetalleRespuesta", back_populates="respuesta")