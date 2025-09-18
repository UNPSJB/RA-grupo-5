from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.variables.models import Variable
from src.variables import schemas, exceptions

# operaciones CRUD para Variables

def crear_variable(db: Session, variable: schemas.VariableCreate) -> schemas.Variable:
    _variable = Variable(**variable.model_dump())
    db.add(_variable)
    db.commit()
    db.refresh(_variable)
    return _variable


def listar_variables(db: Session) -> List[schemas.Variable]:
    return db.scalars(select(Variable)).all()


def leer_variable(db: Session, variable_id: int) -> schemas.Variable:
    db_variable = db.scalar(select(Variable).where(Variable.id == variable_id))
    if db_variable is None:
        raise exceptions.VariableNoEncontrada()
    return db_variable


def modificar_variable(
    db: Session, variable_id: int, variable: schemas.VariableUpdate
) -> Variable:
    db_variable = leer_variable(db, variable_id)
    db.execute(
        update(Variable).where(Variable.id == variable_id).values(**variable.model_dump())
    )
    db.commit()
    db.refresh(db_variable)
    return db_variable


def eliminar_variable(db: Session, variable_id: int) -> schemas.Variable:
    db_variable = leer_variable(db, variable_id)
    if len(db_variable.variable) > 0:
        raise exceptions.VariableAsociadaAEncuesta()
    db.execute(delete(Variable).where(Variable.id == variable_id))
    db.commit()
    return db_variable