from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import List # <-- Asegúrate de importar List


class InformeSinteticoBase(ModeloBase):
    __tablename__ = "informes_sinteticos"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    titulo: Mapped[str] = mapped_column(String, index=True)
    
    comision_asesora: Mapped[str] = mapped_column(String, index=True)
    sede: Mapped[str] = mapped_column(String, index=True)
    integrantes: Mapped[int] = mapped_column(Integer, index=True)
        
    informes_sinteticos_carreras = relationship("InformeSinteticoCarrera", back_populates="informe_sintetico")

