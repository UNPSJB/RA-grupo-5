from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.variables import schemas, services

router = APIRouter(prefix="/variables", tags=["variables"])

# Rutas para Variables


@router.post("/", response_model=schemas.VariableRead)
def create_variable(variable: schemas.VariableCreate, db: Session = Depends(get_db)):
    return services.crear_variable(db, variable)


@router.get("/", response_model=List[schemas.VariableRead])
def get_variables(db: Session = Depends(get_db)):
    return services.listar_variables(db)


@router.get("/{variable_id}", response_model=schemas.VariableRead)
def get_variable(variable_id: int, db: Session = Depends(get_db)):
    return services.leer_variable(db, variable_id)


@router.put("/{variable_id}", response_model=schemas.VariableRead)
def update_variable(
    variable_id: int, variable: schemas.VariableUpdate, db: Session = Depends(get_db)
):
    return services.modificar_variable(db, variable_id, variable)


@router.delete("/{variable_id}", response_model=schemas.VariableRead)
def delete_variable(variable_id: int, db: Session = Depends(get_db)):
    return services.eliminar_variable(db, variable_id)