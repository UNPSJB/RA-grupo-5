from pydantic import BaseModel
from src.informes_asignaturas.models import EstadoInforme
from src.informes_base.schemas import InformeBaseBase
from src.asignaturas.schemas import AsignaturaRead
from src.respuestas.schemas import RespuestaRead
from datetime import date

class InformeAsignaturaBase(BaseModel):
    fecha_inicio: date
    fecha_fin: date
    estado: EstadoInforme
    sede: str
    ciclo_lectivo: str
    docente: str
    cant_alumnos_insc: int
    cant_comisiones_teoricas: int
    cant_comisiones_practicas: int

class InformeAsignaturaCreate(InformeAsignaturaBase):
    id_informe_base: int
    id_asignatura: int
    id_reporte: int

class InformeAsignaturaRead(InformeAsignaturaBase):
    id: int
    id_informe_base: int
    id_asignatura: int
    id_reporte: int
    informe_base: "InformeBaseBase"
    asignatura: "AsignaturaRead"
    respuestas: list["RespuestaRead"] = []
    
    #Podríamos agregar datos del reporte para mostrarlos también

    model_config = {"from_attributes": True}