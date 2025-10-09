from pydantic import BaseModel
from src.informes.models import EstadoInforme

class InformeBase(BaseModel):
    sede: str
    ciclo_lectivo: str
    cod_act_curricular: str
    doc_responsable: str
    cant_alu_inscriptos: int
    cant_com_teoricas: int
    cant_com_practicas: int
    estado: EstadoInforme

    #referencia a la foránea de la tabla con la que se relaciona

class InformeCreate(InformeBase):
    pass

class InformeUpdate(InformeBase):
    pass

class Informe(InformeBase):
    id: int
    model_config = {"from_attributes": True}