from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from src.database import get_db
from src.estadisticas.services import EstadisticaService
from src.estadisticas.schemas import DashboardDTO
from src.config.services import get_current_system_year
from typing import Optional

router = APIRouter(prefix="/estadisticas", tags=["Estadísticas"])


@router.get("/dashboard", response_model=DashboardDTO)
def obtener_dashboard(
    ciclo: Optional[int] = Query(None),
    cuatrimestre: Optional[str] = Query(None),
    nivel: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    if ciclo is None:
        ciclo = get_current_system_year()

    service = EstadisticaService(db)

    # Limpiamos "todos" para enviar None al servicio
    c_filtro = cuatrimestre if cuatrimestre and cuatrimestre != "todos" else None
    n_filtro = nivel if nivel and nivel != "todos" else None

    return service.get_dashboard_data(ciclo, c_filtro, n_filtro)
