from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase


class Variable(ModeloBase):
    __tablename__ = "variables"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    codigo: Mapped[str] = mapped_column(String, unique=True, index=True)
    id_encuesta: Mapped[int] = mapped_column(ForeignKey("encuestas.id"), nullable=False)
    encuesta = relationship("Encuesta", back_populates="variables")
    
    preguntas = relationship("Pregunta", back_populates="variable")