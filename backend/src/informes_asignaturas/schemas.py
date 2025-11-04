from pydantic import BaseModel, ConfigDict
from src.informes_asignaturas.models import EstadoInforme, Sede
from src.informes_base.schemas import InformeBaseRead
from src.asignaturas.schemas import AsignaturaRead
from src.respuestas.schemas import RespuestaRead
from datetime import date
from typing import List, Optional

class InformeAsignaturaBase(BaseModel):
    fecha_inicio: date
    fecha_fin: date
    estado: EstadoInforme
    sede: Sede 
    
    ciclo_lectivo: int 
    
    docente: str
    cant_alumnos_insc: int
    cant_comisiones_teoricas: int
    cant_comisiones_practicas: int

class InformeAsignaturaCreate(InformeAsignaturaBase):
    id_informe_base: int
    id_asignatura: int
    id_reporte: int
    id_informe_sintetico_carrera: Optional[int] = None

class InformeAsignaturaRead(InformeAsignaturaBase):
    id: int
    id_informe_base: int
    id_asignatura: int
    id_reporte: int
    id_informe_sintetico_carrera: Optional[int] = None
    
    informe_base: InformeBaseRead 
    asignatura: AsignaturaRead
    respuestas: List[RespuestaRead] = []
    
    model_config = ConfigDict(from_attributes=True)