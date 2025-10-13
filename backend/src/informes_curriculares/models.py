from enum import Enum
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column#, relationship
from src.models import ModeloBase

class EstadoInformeCurricular(str, Enum):
    abierto = "abierto"
    cerrado = "cerrado"

class InformeCurricular(ModeloBase):
    __tablename__ = "informes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sede: Mapped[str] = mapped_column(String, index=True)
    ciclo_lectivo: Mapped[str] = mapped_column(String, index=True)
    cod_act_curricular: Mapped[str] = mapped_column(String, index=True) #Esto puede ser una foranea a una tabla de carreras si es necesario
    doc_responsable: Mapped[str] = mapped_column(String, index=True) #Esto puede ser una foranea a una tabla de docente si es necesario
    cant_alu_inscriptos: Mapped[int] = mapped_column(Integer)
    cant_com_teoricas: Mapped[int] = mapped_column(Integer)
    cant_com_practicas: Mapped[int] = mapped_column(Integer)
    estado: Mapped[EstadoInformeCurricular] = mapped_column(String, index=True)
    
    # Aca van las foreign keys a las variables que se usen en el informe