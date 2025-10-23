from typing import List, Optional
from sqlalchemy import Column, ForeignKey, Table, Integer, String
from sqlalchemy.orm import relationship, Mapped, mapped_column
from src.models import ModeloBase


class PreguntaOpcion(ModeloBase):
    __tablename__ = "pregunta_opcion"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_pregunta: Mapped[int] = mapped_column(ForeignKey("preguntas.id"))
    id_opcion_respuesta: Mapped[Optional[int]] = mapped_column(ForeignKey("opciones_respuestas.id"), nullable=True)

    pregunta = relationship("Pregunta", back_populates="pregunta_opcion")
    opcion_respuesta = relationship("OpcionRespuesta", back_populates="pregunta_opcion")
    
    detalles_respuesta = relationship("DetalleRespuesta", back_populates="pregunta_opcion")