# Para probar sin login, se acepta un header X-Persona-Id.
# Más adelante (con el login) cambiar a JWT sin tocar el resto.

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.personas import services as PersonaService
def get_current_persona(
    db: Session = Depends(get_db),
    x_persona_id: int | None = Header(None, convert_underscores=False),
):
    # DEV: si viene el header X-Persona-Id lo usamos
    if x_persona_id is None:
        raise HTTPException(status_code=401, detail="Falta X-Persona-Id (DEV) o implementar JWT")
    persona = PersonaService(db).leer_persona(x_persona_id)
    if not persona:
        raise HTTPException(status_code=401, detail="Persona no encontrada")
    return persona