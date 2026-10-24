from datetime import date
from pydantic import BaseModel, Field


class SimularAnioRequest(BaseModel):
    anio: int = Field(..., ge=2020, le=2040, description="Año a simular en el sistema (ej. 2026 o 2029)")


class SimularAnioResponse(BaseModel):
    anio_simulado: int
    fecha_simulada: date
    periodo_vigente: str
    mensaje: str

