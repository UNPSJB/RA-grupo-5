from typing import Optional, List
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from src.models import ModeloBase


class Variable(ModeloBase):
    __tablename__ = "variables"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    codigo: Mapped[str] = mapped_column(String, unique=True, index=True)
    id_encuesta: Mapped[Optional[List["src.encuestas.models.Encuesta"]]] = relationship(
        "src.encuestas.models.Encuesta", back_populates="campo"
    )