from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.personas.models import Persona
from src.personas import schemas, exceptions

# operaciones CRUD para Personas

def crear_persona(db: Session, persona: schemas.PersonaCreate) -> schemas.Persona:
    _persona = Persona(**persona.model_dump())
    db.add(_persona)
    db.commit()
    db.refresh(_persona)
    return _persona


def listar_personas(db: Session) -> List[schemas.Persona]:
    return db.scalars(select(Persona)).all()


def leer_persona(db: Session, persona_id: int) -> schemas.Persona:
    db_persona = db.scalar(select(Persona).where(Persona.id == persona_id))
    if db_persona is None:
        raise exceptions.PersonaNoEncontrada()
    return db_persona


def modificar_persona(
    db: Session, persona_id: int, persona: schemas.PersonaUpdate
) -> Persona:
    db_persona = leer_persona(db, persona_id)
    db.execute(
        update(Persona).where(Persona.id == persona_id).values(**persona.model_dump())
    )
    db.commit()
    db.refresh(db_persona)
    return db_persona


def eliminar_persona(db: Session, persona_id: int) -> schemas.Persona:
    db_persona = leer_persona(db, persona_id)
    if len(db_persona.mascotas) > 0:
        raise exceptions.PersonaTieneMascotas()
    db.execute(delete(Persona).where(Persona.id == persona_id))
    db.commit()
    return db_persona
