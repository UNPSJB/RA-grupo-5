from __future__ import annotations
from typing import Optional
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class DetalleRespuesta(ModeloBase):
    __tablename__ = "detalles_respuestas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_pregunta_opcion: Mapped[int] = mapped_column(ForeignKey("pregunta_opcion.id"))
    id_respuesta: Mapped[int] = mapped_column(ForeignKey("respuestas.id"))
    texto_respuesta_abierta: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    respuesta = relationship("Respuesta", back_populates="detalles")
    pregunta_opcion = relationship("PreguntaOpcion", back_populates="detalles_respuesta")    
    