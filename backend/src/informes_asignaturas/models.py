from datetime import date
from sqlalchemy import Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class EstadoInforme(str, Enum):
    abierta = "abierto"
    cerrada = "cerrado"

class InformeAsignatura(ModeloBase):
    tablename__ = "informes_asignaturas"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_informe_base: Mapped[int] = mapped_column(Integer, index=True)
    id_asignatura: Mapped[str] = mapped_column(String, index=True)
    fecha_inicio: Mapped[date] = mapped_column(String, index=True)
    fecha_fin: Mapped[date] = mapped_column(String, index=True)
    estado: Mapped[EstadoInforme] = mapped_column(Enum(EstadoInforme), nullable=False, default=EstadoInforme.abierta)

    informe_base = relationship("InformeBase", back_populates="informes_asignaturas")
    asignatura = relationship("Asignatura", back_populates="informes_asignaturas")
    respuesta = relationship("Respuesta", back_populates="informe_asignatura")
