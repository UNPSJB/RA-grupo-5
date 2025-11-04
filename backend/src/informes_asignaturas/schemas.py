from pydantic import BaseModel
from src.informes_asignaturas.models import EstadoInforme
from src.informes_curriculares_base.schemas import InformeCurricularBase
from src.asignaturas.schemas import AsignaturaRead
from src.respuestas.schemas import RespuestaRead
from datetime import date
from typing import Optional

class InformeAsignaturaEstado(BaseModel):
    id: int
    estado: EstadoInforme
    hasRespuesta: bool
    respuestaId: Optional[int] = None
    canResponder: bool

class InformeAsignaturaBase(BaseModel):
    fecha_inicio: date
    fecha_fin: date
    estado: EstadoInforme
    sede: str
    ciclo_lectivo: int
    docente: str
    cant_alumnos_insc: int
    cant_comisiones_teoricas: int
    cant_comisiones_practicas: int

class InformeAsignaturaCreate(InformeAsignaturaBase):
    id_informe_curricular_base: int
    id_asignatura: int
    id_reporte: int

class InformeAsignaturaRead(InformeAsignaturaBase):
    id: int
    id_informe_curricular_base: int
    id_asignatura: int
    id_reporte: int
    informe_curricular_base: "InformeCurricularBase"
    asignatura: "AsignaturaRead"
    respuestas: list["RespuestaRead"] = []
    
    #Podríamos agregar datos del reporte para mostrarlos también

    model_config = {"from_attributes": True}