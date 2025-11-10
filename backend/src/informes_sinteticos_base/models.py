from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import List # <-- Asegúrate de importar List


class InformeSinteticoBase(ModeloBase):
    __tablename__ = "informes_sinteticos_base"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    titulo: Mapped[str] = mapped_column(String, index=True)
    
    preguntas = relationship("Pregunta", back_populates="informe_sintetico_base")
    informes_sinteticos_carreras = relationship("InformeSinteticoCarrera", back_populates="informe_sintetico_base")

