from sqlalchemy import Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from src.models import ModeloBase

class Respuesta(ModeloBase):

    __tablename__ = "respuestas" 

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)   
    id_persona: Mapped[int] = mapped_column(ForeignKey("personas.id"))
    id_encuesta_asignatura: Mapped[Optional[int]] = mapped_column(ForeignKey("encuestas_asignaturas.id"), nullable=True)
    id_informe_asignatura: Mapped[Optional[int]] = mapped_column(ForeignKey("informes_asignaturas.id"), nullable=True)
    id_informe_sintetico_carrera: Mapped[Optional[int]] = mapped_column(ForeignKey("informes_sinteticos_carreras.id"), nullable=True)
    
    
    persona = relationship("Persona", back_populates="respuestas") 
    encuesta_asignatura = relationship("EncuestaAsignatura", back_populates="respuestas")
    detalles = relationship("DetalleRespuesta", back_populates="respuesta")

    informe_asignatura = relationship(
        "InformeAsignatura",
        back_populates="respuesta",
        foreign_keys=[id_informe_asignatura],
    )

    informe_sintetico_carrera = relationship(
        "InformeSinteticoCarrera",
        back_populates="respuesta",
        foreign_keys=[id_informe_sintetico_carrera],
    )
    
    __table_args__ = ( 
        UniqueConstraint('id_informe_asignatura', name='uq_respuestas_informe_doc'),
        UniqueConstraint('id_informe_sintetico_carrera', name='uq_respuestas_informe_carrera'),
    )