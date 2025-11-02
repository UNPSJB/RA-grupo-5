from pydantic import BaseModel
from typing import List
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class InformeSinteticoCarrera(ModeloBase):
    __tablename__ = "informes_sinteticos_carreras"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    id_carrera: Mapped[int] = mapped_column(ForeignKey("carreras.id"), nullable=False)
    id_informe_sintetico: Mapped[int] = mapped_column(ForeignKey("informes_sinteticos.id"), nullable=False)
    ciclo_lectivo: Mapped[str] = mapped_column(String, index=True)
    comision_asesora: Mapped[str] = mapped_column(String, index=True)
    sede: Mapped[str] = mapped_column(String, index=True)
    integrantes: Mapped[str] = mapped_column(String, index=True)


    informes_asignaturas = relationship("InformeAsignatura", back_populates="informe_sintetico_carrera")
    carrera = relationship("Carrera", back_populates="informes_sinteticos_carreras")
    informe_sintetico = relationship("InformeSinteticoBase", back_populates="informes_sinteticos_carreras")