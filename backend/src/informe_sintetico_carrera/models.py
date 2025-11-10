from pydantic import BaseModel
from typing import List
from sqlalchemy import Integer, String, ForeignKey,  Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from enum import Enum

class EstadoInforme(str, Enum):
    abierto = "abierto"
    cerrado = "cerrado"

class InformeSinteticoCarrera(ModeloBase):
    __tablename__ = "informes_sinteticos_carreras"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    ciclo_lectivo: Mapped[str] = mapped_column(String, index=True)
    comision_asesora: Mapped[str] = mapped_column(String, index=True)
    sede: Mapped[str] = mapped_column(String, index=True)
    integrantes: Mapped[str] = mapped_column(String, index=True)
    estado: Mapped[EstadoInforme] = mapped_column(SQLEnum(EstadoInforme), nullable=False, default=EstadoInforme.abierto)
    
    id_carrera: Mapped[int] = mapped_column(ForeignKey("carreras.id"), nullable=False)
    id_informe_sintetico_base: Mapped[int] = mapped_column(ForeignKey("informes_sinteticos_base.id"), nullable=False)
    id_respuesta: Mapped[int] = mapped_column(ForeignKey("respuestas.id"), nullable=True)
    
    informes_asignaturas = relationship("InformeAsignatura", back_populates="informe_sintetico_carrera")
    carrera = relationship("Carrera", back_populates="informes_sinteticos_carreras")
    informe_sintetico_base = relationship("InformeSinteticoBase", back_populates="informes_sinteticos_carreras")
    
    respuesta = relationship(
        "Respuesta",
        back_populates="informe_sintetico_carrera",
        foreign_keys="Respuesta.id_informe_sintetico_carrera",
        uselist=False,   # 👈 igual, solo una respuesta
    )