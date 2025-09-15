from typing import Optional, List
from sqlalchemy import Integer, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
from src.models import ModeloBase
from enum import Enum



class EstadoEncuesta(str, Enum):
    abierta = "abierta"
    cerrada = "cerrada"

class Encuesta(ModeloBase):
    __tablename__ = "encuestas"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    carrera: Mapped[str] = mapped_column(String, index=True)
    actividad_curricular: Mapped[str] = mapped_column(String, index=True)
    sede: Mapped[str] = mapped_column(String, index=True)    
    fecha_inicio: Mapped[str] = mapped_column(String, index=True)
    fecha_fin: Mapped[str] = mapped_column(String, index=True) 
    estado: Mapped[EstadoEncuesta] = mapped_column(SQLEnum(EstadoEncuesta), nullable=False, default=EstadoEncuesta.abierta)
    
