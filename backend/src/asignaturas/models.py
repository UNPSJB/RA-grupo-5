from sqlalchemy import Integer, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from enum import Enum

class Cursado(str, Enum):
    cuatrimestre1 = "cuatrimestre 1"
    cuatrimestre2 = "cuatrimestre 2"
    anual= "anual"

class Asignatura(ModeloBase):
    __tablename__ = "asignaturas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    año: Mapped[int] = mapped_column(Integer, index=True)
    nombre_docente: Mapped[str] = mapped_column(String, unique=True, index=True)
    cursado: Mapped[Cursado] = mapped_column(SQLEnum(Cursado), nullable=False)
    carrera: Mapped[str] = mapped_column(String, index=True)
    sede: Mapped[str] = mapped_column(String, index=True)
    encuestas_asignaturas = relationship("EncuestaAsignatura", back_populates="asignatura")
    informes_asignaturas = relationship("InformeAsignatura", back_populates="asignatura")