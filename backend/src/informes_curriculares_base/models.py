from sqlalchemy import Integer, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class InformeCurricularBase(ModeloBase):
    __tablename__ = "informes_curriculares_base"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String, index=True)
    
    preguntas = relationship("Pregunta", back_populates="informe_curricular_base")
    informes_asignaturas = relationship("InformeAsignatura", back_populates="informe_curricular_base")