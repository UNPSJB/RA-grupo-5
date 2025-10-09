from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class Detalle_respuesta(ModeloBase):
    __tablename__ = "detalle_respuesta"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_opc_respuesta: Mapped[int] = mapped_column(ForeignKey("opc_respuesta.id"), index=True)
    opc_respuesta = relationship("Opc_respuesta", back_populates="det_respuesta")
    id_opc_respuesta: Mapped[int] = mapped_column(ForeignKey("respuesta.id"), index=True)
    respuesta = relationship("Respuesta", back_populates="det_respuesta")   
    texto_resp_abierta: Mapped[str] = mapped_column(String, index=True, nullable=True) # Para respuestas abiertas

    