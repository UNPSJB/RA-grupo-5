from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.config import schemas, services
from src.seguridad.deps import require_roles
from src.seguridad.models import RoleName

router = APIRouter(tags=["Configuración / Simulación de año"])


@router.get("/api/config/simular-anio", response_model=schemas.SimularAnioResponse)
@router.get("/config/simular-anio", response_model=schemas.SimularAnioResponse)
def consultar_anio_simulado():
    """Consulta el año actual simulado y el período de vigencia activo en el sistema."""
    anio = services.get_current_system_year()
    fecha = services.get_current_system_date()
    periodo = services.get_periodo_label(anio)
    return schemas.SimularAnioResponse(
        anio_simulado=anio,
        fecha_simulada=fecha,
        periodo_vigente=periodo,
        mensaje=f"Año del sistema actual: {anio} (Período {periodo})."
    )


@router.post("/api/config/simular-anio", response_model=schemas.SimularAnioResponse)
@router.post("/config/simular-anio", response_model=schemas.SimularAnioResponse)
def actualizar_anio_simulado(
    data: schemas.SimularAnioRequest,
    db: Session = Depends(get_db),
    _: None = Depends(require_roles(RoleName.admin)),
):
    """
    Actualiza en memoria el año simulado del sistema y ejecuta la transición
    automática de congelamiento/apertura de encuestas en la base de datos.
    """
    nuevo_anio = data.anio
    resumen = services.transicionar_sistema_al_anio(db, nuevo_anio)
    fecha = services.get_current_system_date()
    periodo = services.get_periodo_label(nuevo_anio)

    if nuevo_anio >= 2029:
        msg = (
            f"Año simulado cambiado a {nuevo_anio} (Período {periodo}). "
            f"Período 2025–2028 congelado ({resumen['encuestas_cerradas']} encuestas cerradas) "
            f"y versión 2029–2032 con IA activada ({resumen['encuestas_abiertas']} encuesta(s) abierta(s))."
        )
    else:
        msg = (
            f"Año simulado cambiado a {nuevo_anio} (Período {periodo}). "
            f"Período 2025–2028 activo ({resumen['encuestas_abiertas']} encuesta(s) abierta(s)) "
            f"y versión 2029–2032 cerrada."
        )

    return schemas.SimularAnioResponse(
        anio_simulado=nuevo_anio,
        fecha_simulada=fecha,
        periodo_vigente=periodo,
        mensaje=msg
    )
