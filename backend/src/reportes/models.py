from datetime import date
from typing import Optional
from sqlalchemy import Date, ForeignKey, Integer, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from enum import Enum

class Cursado(str, Enum):
    cuatrimestre1 = "cuatrimestre 1"
    cuatrimestre2 = "cuatrimestre 2"
    anual= "anual"

class Reporte(ModeloBase):
    __tablename__ = "reportes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    carrera: Mapped[str] = mapped_column(String, index=True)
    asignatura: Mapped[str] = mapped_column(String, index=True)
    año: Mapped[int] = mapped_column(Integer, index=True)
    sede: Mapped[str] = mapped_column(String, index=True)
    cursado: Mapped[Cursado] = mapped_column(SQLEnum(Cursado), nullable=False)
    
    #a priori esto es lo unico que tiene un reporte:
    id_encuesta_asignatura: Mapped[int] = mapped_column(ForeignKey("encuestas_asignaturas.id"), nullable=False) 
    encuesta_asignatura = relationship("EncuestaAsignatura")
