from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database import get_db
from src.respuestas import schemas, services

from src.seguridad.deps_auth import get_current_persona
from src.seguridad.models import PermissionName

router = APIRouter(prefix="/respuestas", tags=["respuestas"])


def validar_permiso_respuesta(payload: schemas.RespuestaCreate, persona_actual):
    """
    Determina qué permiso necesita el usuario según el tipo de respuesta enviada
    (encuesta, informe curricular o informe sintético) y valida que lo tenga.
    """

    # Construimos el set de permisos que tiene la persona
    permisos_persona: set[PermissionName] = {
        perm.name
        for role in persona_actual.roles
        for perm in role.permissions
    }

    # 1️⃣ Alumno responde ENCUESTA
    if payload.id_encuesta_asignatura is not None:
        if PermissionName.RESPONDER_ENCUESTA not in permisos_persona:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene permiso para responder encuestas",
            )
        return

    # 2️⃣ Docente responde INFORME CURRICULAR
    if payload.id_informe_asignatura is not None:
        if PermissionName.RESPONDER_INFORME_CURRICULAR not in permisos_persona:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene permiso para responder informes curriculares",
            )
        return

    # 3️⃣ Departamento responde INFORME SINTÉTICO
    if payload.id_informe_sintetico_carrera is not None:   # 👈 corregido aquí
        if PermissionName.GENERAR_INFORMES_SINTETICOS not in permisos_persona:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene permiso para generar informes sintéticos",
            )
        return

    # Si no vino ninguno de los ids esperados:
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="No se reconoce el tipo de respuesta enviada",
    )


@router.post("/", response_model=schemas.RespuestaRead)
def create_respuesta(
    respuesta: schemas.RespuestaCreate,
    db: Session = Depends(get_db),
    persona_actual=Depends(get_current_persona),
):
    # 🔐 Verificación automática según el tipo de respuesta
    validar_permiso_respuesta(respuesta, persona_actual)

    # ✔ Crear respuesta
    return services.crear_respuesta(db, respuesta)
