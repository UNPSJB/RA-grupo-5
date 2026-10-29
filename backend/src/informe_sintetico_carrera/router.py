from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from . import schemas, services

from src.seguridad.deps import require_permissions
from src.seguridad.models import PermissionName
from src.seguridad.deps_auth import get_current_persona

router = APIRouter(
    prefix="/informe-sintetico-carrera",
    tags=["informe-sintetico-carrera"],
)

@router.get(
    "/",
    response_model=list[schemas.InformeSinteticoCarreraRead],
    dependencies=[Depends(require_permissions(PermissionName.VER_MIS_SINTETICOS))],
)
def read_informes_sinteticos_carrera(
    db: Session = Depends(get_db),
    persona_actual = Depends(get_current_persona),
):
    """
    Listado de informes sintéticos visibles para la persona actual.
    Por ahora devolvemos todos; más adelante podemos filtrar por persona_actual.id.
    """
    return services.listar_informes_sinteticos_carrera(db)

@router.post(
    "/",
    response_model=schemas.InformeSinteticoCarreraRead,
    dependencies=[Depends(require_permissions(PermissionName.GENERAR_INFORMES_SINTETICOS))],
)
def create_informe_sintetico_carrera(
    informe: schemas.InformeSinteticoCarreraCreate,
    db: Session = Depends(get_db),
):
    return services.crear_informe_sintetico_carrera(db, informe)

@router.get(
    "/mis-enviados",
    response_model=list[schemas.InformeSinteticoCarreraRead],
    dependencies=[Depends(require_permissions(PermissionName.VER_MIS_SINTETICOS))],
)
def read_mis_informes_sinteticos_enviados(
    db: Session = Depends(get_db),
    persona_actual = Depends(get_current_persona),
):
    """
    Informes sintéticos enviados por la persona autenticada.

    Un informe se considera enviado cuando tiene una Respuesta asociada.
    No se filtra por ciclo para no ocultar envíos históricos con datos
    inconsistentes; el filtro de ciclo sólo se aplica a los listados de
    disponibilidad/agrupamiento.
    """
    return services.listar_informes_respondidos_departamento(
        db, persona_actual.id
    )

@router.get(
    "/{informe_id}",
    response_model=schemas.InformeSinteticoCarreraRead,
    dependencies=[Depends(require_permissions(PermissionName.VER_MIS_SINTETICOS))],
)
def read_informe_sintetico_carrera(
    informe_id: int,
    db: Session = Depends(get_db),
    persona_actual = Depends(get_current_persona),
):
    # Opcional: validar que el informe pertenezca a persona_actual
    return services.leer_informe_sintetico_carrera(db, informe_id)

@router.get("/departamento/{persona_id}", response_model=list[schemas.InformeSinteticoCarreraRead])
def read_informes_respondidos_departamento(persona_id: int, db: Session = Depends(get_db)):
    """
    Endpoint histórico. Se mantiene por compatibilidad; las vistas nuevas
    deben usar /mis-enviados para que el backend resuelva la persona del token.
    """
    return services.listar_informes_respondidos_departamento(db, persona_id)
