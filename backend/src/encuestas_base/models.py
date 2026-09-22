from typing import Optional, List
from sqlalchemy import Integer, String, Date, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from enum import Enum


class Ciclo(str, Enum):
    ciclo_basico = "ciclo basico"
    ciclo_superior = "ciclo superior"


class EncuestaBase(ModeloBase):
    __tablename__ = "encuestas_base"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    ciclo: Mapped[Ciclo] = mapped_column(SQLEnum(Ciclo), index=True)
    anio_inicio: Mapped[Optional[int]] = mapped_column(Integer)
    anio_fin: Mapped[Optional[int]] = mapped_column(Integer)
    variables = relationship("Variable", back_populates="encuesta_base")
    encuestas_asignaturas = relationship("EncuestaAsignatura", back_populates="encuesta_base")

    #nuevos campos para el versionado de anios
    variables = relationship ("Variable", back_populates="encuesta_base")
    encuestas_asignaturas = relationship("EncuestaAsignatura", back_populates="encuesta_base")
