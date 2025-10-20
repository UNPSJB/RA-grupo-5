#preguntas
from typing import Optional
from sqlalchemy import Integer, String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
import enum

class TipoPreguntaEnum(str, enum.Enum):
    single_choice = "single_choice"
    multiple_choice = "multiple_choice"
    open = "open"

class Pregunta(ModeloBase):
    __tablename__ = "preguntas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto_pregunta: Mapped[str] = mapped_column(String, index=True)
    tipo: Mapped[TipoPreguntaEnum] = mapped_column(Enum(TipoPreguntaEnum), nullable=False)
    obligatoria: Mapped[bool] = mapped_column(Boolean, default=False)

    #SI PERTENECE A UN INFORME
    id_informe_base: Mapped[Optional[int]] = mapped_column(ForeignKey("informe_base.id"), nullable=True)
    informe = relationship("Informe", back_populates="preguntas")

    #SI PERTENECE A UNA VARIABLE
    id_variable: Mapped[Optional[int]] = mapped_column(ForeignKey("variables.id"), nullable=True)
    variable = relationship("Variable", back_populates="preguntas")

    #SI CONTIENE PREGUNTAS DENTRO
    id_pregunta_padre: Mapped[Optional[int]] = mapped_column(ForeignKey("preguntas.id"), nullable=True)
    subpreguntas = relationship("Pregunta",back_populates="pregunta_padre",cascade="all, delete-orphan")
    pregunta_padre = relationship("Pregunta",remote_side="Pregunta.id",back_populates="subpreguntas")

    #OPCIONES DE RESPUESTAS
    opcionesRespuestas = relationship("OpcionRespuesta",back_populates="pregunta")