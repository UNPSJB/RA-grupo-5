from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.variables.models import Variable
from src.variables import schemas, exceptions


def crear_variable(db: Session, variable: schemas.VariableCreate) -> Variable:
    _variable = Variable(**variable.model_dump())
    db.add(_variable)
    db.commit()
    db.refresh(_variable)
    return _variable


def listar_variables(db: Session) -> List[Variable]:
    return db.scalars(select(Variable)).all()


def leer_variable(db: Session, variable_id: int) -> Variable:
    db_variable = db.scalar(select(Variable).where(Variable.id == variable_id))
    if db_variable is None:
        raise exceptions.VariableNoEncontrada()
    return db_variable


def modificar_variable(db: Session, variable_id: int, variable: schemas.VariableUpdate) -> Variable:
    db_variable = leer_variable(db, variable_id)
    for key, value in variable.model_dump(exclude_unset=True).items():
        setattr(db_variable, key, value)
    db.commit()
    db.refresh(db_variable)
    return db_variable


def eliminar_variable(db: Session, variable_id: int) -> Variable:
    db_variable = leer_variable(db, variable_id)
    db.delete(db_variable)
    db.commit()
    return db_variable
