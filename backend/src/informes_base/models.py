from sqlalchemy import Integer, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from enum import Enum

class Sede(str, Enum):
    cr = "Comodoro Rivadavia"
    tw = "Trelew"
    pm = "Puerto Madryn"
    esq = "Esquel"

class InformeBase(ModeloBase):
    __tablename__ = "informes_base"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sede: Mapped[Sede] = mapped_column(SQLEnum(Sede), index=True)
    ciclo_lectivo: Mapped[int] = mapped_column(Integer, index=True)
    docente: Mapped[str] = mapped_column(String, )
    cant_alumnos_insc: Mapped[int] = mapped_column(Integer, index=True)
    cant_comisiones_teoricas: Mapped[int] = mapped_column(Integer, index=True)
    cant_comisiones_practicas: Mapped[int] = mapped_column(Integer, index=True)
    
    informes_asignaturas = relationship("InformeAsignatura", back_populates="informe_base")
    preguntas = relationship("Pregunta", back_populates="informe_base")