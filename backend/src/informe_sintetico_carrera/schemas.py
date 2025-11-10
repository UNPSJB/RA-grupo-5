from pydantic import BaseModel, ConfigDict
from typing import List, Optional

from src.carreras.schemas import CarreraRead
from src.informes_asignaturas.schemas import InformeAsignaturaBase
from src.informes_sinteticos_base.schemas import InformeSinteticoBase
from src.respuestas.schemas import RespuestaRead
from src.informe_sintetico_carrera.models import EstadoInforme

class InformeCarreraEstado(BaseModel):
    id: int
    estado: EstadoInforme
    hasRespuesta: bool
    respuestaId: Optional[int] = None
    canResponder: bool
    
class InformeSinteticoCarreraBase(BaseModel):
    ciclo_lectivo: str
    comision_asesora: str
    sede: str
    integrantes: str
    id_carrera: int
    id_informe_sintetico_base: int
    estado: EstadoInforme

class InformeSinteticoCarreraCreate(InformeSinteticoCarreraBase):
    id_carrera: int
    id_informe_sintetico_base: int

class InformeSinteticoCarreraRead(InformeSinteticoCarreraBase):
    id: int
    carrera: CarreraRead
    informe_sintetico_base: InformeSinteticoBase
    informes_asignaturas: List[InformeAsignaturaBase] = []
    respuesta: Optional[RespuestaRead] = None
    model_config = ConfigDict(from_attributes=True)