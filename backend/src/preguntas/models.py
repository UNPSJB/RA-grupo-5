from typing import Optional, List , TYPE_CHECKING
from sqlalchemy import Integer, String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.associationproxy import association_proxy
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

    #SI PERTENECE A UNA VARIABLE
    id_variable: Mapped[Optional[int]] = mapped_column(ForeignKey("variables.id"), nullable=True)
    variable = relationship("Variable", back_populates="preguntas")
    
    #SI PERTENECE A UN INFORME CURRICULAR
    id_informe_curricular_base: Mapped[Optional[int]] = mapped_column(ForeignKey("informes_curriculares_base.id"), nullable=True)
    informe_curricular_base = relationship("InformeCurricularBase", back_populates="preguntas")

    #SI PERTENECE A UN INFORME SINTETICO
    id_informe_sintetico_base: Mapped[Optional[int]] = mapped_column(ForeignKey("informes_sinteticos_base.id"), nullable=True)
    informe_sintetico_base = relationship("InformeSinteticoBase", back_populates="preguntas")

    #OPCIONES DE RESPUESTAS
    pregunta_opcion = relationship("PreguntaOpcion", back_populates="pregunta")
