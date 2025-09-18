from typing import Optional
from sqlalchemy import Integer, String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
import enum

class TipoPreguntaEnum(str, enum.Enum):
    boolean = "boolean"
    single_choice = "single_choice"
    multiple_choice = "multiple_choice"
    open = "open"

class Pregunta(ModeloBase):
    __tablename__ = "preguntas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto_pregunta: Mapped[str] = mapped_column(String, index=True)
    tipo: Mapped[TipoPreguntaEnum] = mapped_column(Enum(TipoPreguntaEnum), nullable=False)
    obligatoria: Mapped[bool] = mapped_column(Boolean, default=False)
    condicion: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    id_variable: Mapped[int] = mapped_column(ForeignKey("variables.id"), nullable=False)
    variable = relationship("Variable", back_populates="preguntas")