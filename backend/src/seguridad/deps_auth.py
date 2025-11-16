from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from src.database import get_db
from src.personas import services as persona_services


def get_current_persona(
    db: Session = Depends(get_db),
    x_persona_id: int | None = Header(default=None, alias="X-Persona-Id"),
):
    # alias="X-Persona-Id" le dice a FastAPI:
    # "este parámetro viene del header X-Persona-Id"

    if x_persona_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Falta header X-Persona-Id (DEV)",
        )
    
    persona = persona_services.leer_persona(db, x_persona_id)
    return persona