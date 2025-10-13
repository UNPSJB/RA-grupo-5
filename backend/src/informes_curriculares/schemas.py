from pydantic import BaseModel
from src.informes_curriculares.models import EstadoInformeCurricular

class InformeCurricularBase(BaseModel):
    sede: str
    ciclo_lectivo: str
    cod_act_curricular: str
    doc_responsable: str
    cant_alu_inscriptos: int
    cant_com_teoricas: int
    cant_com_practicas: int
    estado: EstadoInformeCurricular

    #referencia a la foránea de la tabla con la que se relaciona

class InformeCurricularCreate(InformeCurricularBase):
    pass

class InformeCurricularUpdate(InformeCurricularBase):
    pass

class InformeCurricular(InformeCurricularBase):
    id: int
    model_config = {"from_attributes": True}