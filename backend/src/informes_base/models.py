from sqlalchemy import Integer, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from enum import Enum


class InformeBase(ModeloBase):
    __tablename__ = "informes_base"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String, index=True)
    
    preguntas = relationship("Pregunta", back_populates="informe_base")
    informes_asignaturas = relationship("InformeAsignatura", back_populates="informe_base")