from datetime import date
from typing import Optional
from sqlalchemy import Date, ForeignKey, Integer, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from enum import Enum


class Reporte(ModeloBase):
    __tablename__ = "reportes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_encuesta_asignatura: Mapped[int] = mapped_column(ForeignKey("encuestas_asignaturas.id"), nullable=False)

    encuesta_asignatura = relationship("EncuestaAsignatura", back_populates="reportes")