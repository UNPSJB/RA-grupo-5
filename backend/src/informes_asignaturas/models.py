from datetime import date
from sqlalchemy import Integer, String, Date, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from enum import Enum

class EstadoInforme(str, Enum):
    abierto = "abierto"
    cerrado = "cerrado"

class InformeAsignatura(ModeloBase):
    __tablename__ = "informes_asignaturas"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_informe_base: Mapped[int] = mapped_column(ForeignKey("informes_base.id"), nullable=False)
    id_asignatura: Mapped[str] = mapped_column(ForeignKey("asignaturas.id"), nullable=False)
    fecha_inicio: Mapped[date] = mapped_column(Date, index=True)
    fecha_fin: Mapped[date] = mapped_column(Date, index=True)
    estado: Mapped[EstadoInforme] = mapped_column(SQLEnum(EstadoInforme), nullable=False, default=EstadoInforme.abierto)

    informe_base = relationship("InformeBase", back_populates="informes_asignaturas")
    asignatura = relationship("Asignatura", back_populates="informes_asignaturas")
    respuesta = relationship("Respuesta", back_populates="informe_asignatura")
