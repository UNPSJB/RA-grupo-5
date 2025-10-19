from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class DetalleRespuesta(ModeloBase):
    __tablename__ = "detalles_respuestas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_opciones_respuesta: Mapped[int] = mapped_column(ForeignKey("opciones_respuestas.id"), index=True)
    id_respuesta: Mapped[int] = mapped_column(ForeignKey("respuestas.id"), index=True)
    
    opcion_respuesta = relationship("OpcionRespuesta", back_populates="detalles_respuestas")
    respuesta = relationship("Respuesta", back_populates="detalles")
    
    