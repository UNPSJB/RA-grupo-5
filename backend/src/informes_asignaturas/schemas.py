from pydantic import BaseModel
from src.informes_asignaturas.models import EstadoInforme
from src.informes_base.schemas import InformeBaseBase
from src.asignaturas.schemas import AsignaturaRead
from datetime import date

class InformeAsignaturaBase(BaseModel):
    fecha_inicio: date
    fecha_fin: date
    estado: EstadoInforme

class InformeAsignaturaCreate(InformeAsignaturaBase):
    id_informe_base: int
    id_asignatura: int

class InformeAsignaturaRead(InformeAsignaturaBase):
    id: int
    id_informe_base: int
    id_asignatura: int
    informe_base: InformeBaseBase
    asignatura: AsignaturaRead
    model_config = {"from_attributes": True}