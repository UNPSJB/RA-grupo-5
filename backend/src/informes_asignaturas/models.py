from datetime import date
from sqlalchemy import Integer, Date, String, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from enum import Enum

class EstadoInforme(str, Enum):
    abierto = "abierto"
    cerrado = "cerrado"

class Sede(str, Enum):
    cr = "Comodoro Rivadavia"
    tw = "Trelew"
    pm = "Puerto Madryn"
    esq = "Esquel"

class InformeAsignatura(ModeloBase):
    __tablename__ = "informes_asignaturas"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sede: Mapped[Sede] = mapped_column(SQLEnum(Sede), index=True)
    ciclo_lectivo: Mapped[int] = mapped_column(Integer, index=True)
    docente: Mapped[str] = mapped_column(String, index=True)
    cant_alumnos_insc: Mapped[int] = mapped_column(Integer, index=True)
    cant_comisiones_teoricas: Mapped[int] = mapped_column(Integer, index=True)
    cant_comisiones_practicas: Mapped[int] = mapped_column(Integer, index=True)
    fecha_inicio: Mapped[date] = mapped_column(Date, index=True)
    fecha_fin: Mapped[date] = mapped_column(Date, index=True)
    estado: Mapped[EstadoInforme] = mapped_column(SQLEnum(EstadoInforme), nullable=False, default=EstadoInforme.abierto)

    id_informe_base: Mapped[int] = mapped_column(ForeignKey("informes_base.id"), nullable=False)
    id_asignatura: Mapped[int] = mapped_column(ForeignKey("asignaturas.id"), nullable=False)
    id_reporte: Mapped[int] =  mapped_column(ForeignKey("reportes.id"), nullable=False)

    informe_base = relationship("InformeBase", back_populates="informes_asignaturas")
    asignatura = relationship("Asignatura", back_populates="informes_asignaturas")
    respuestas = relationship("Respuesta", back_populates="informe_asignatura")
    reporte = relationship("Reporte", back_populates="informes_asignaturas")