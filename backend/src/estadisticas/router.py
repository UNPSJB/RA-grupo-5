from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.estadisticas.services import EstadisticaService
from src.estadisticas.schemas import DashboardDTO

router = APIRouter(prefix="/estadisticas", tags=["Estadísticas"])

@router.get("/dashboard", response_model=DashboardDTO)
def obtener_dashboard(ciclo: int = 2025, db: Session = Depends(get_db)):
    """
    Retorna todas las estadísticas calculadas para el Dashboard del Departamento.
    Permite filtrar por ciclo lectivo (query param ?ciclo=2024).
    """
    service = EstadisticaService(db)
    return service.get_dashboard_data(ciclo)