from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt

from src.database import get_db
from src.personas import services as persona_services
from src.auth.services import SECRET, ALGORITHM  # usamos los valores reales del módulo auth

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_persona(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Extrae el persona_id desde el JWT y devuelve la Persona correspondiente.
    """
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        persona_id: int | None = payload.get("persona_id")

        if persona_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: falta persona_id",
            )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado",
        )

    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )

    persona = persona_services.leer_persona(db, persona_id)

    if not persona:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Persona no encontrada",
        )

    return persona
