from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class OpcionRespuesta(ModeloBase):
    __tablename__ = "opcionesRespuestas"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    texto_opcion: Mapped[str] = mapped_column(String, index=True)
    id_pregunta: Mapped[int] = mapped_column(ForeignKey("preguntas.id"), nullable=False)
    pregunta = relationship("Pregunta", back_populates="opcionesRespuestas")
    
    
    