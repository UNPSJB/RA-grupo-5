from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.reportes import schemas, services

router = APIRouter(prefix="/reportes", tags=["reportes"])

@router.get("/", response_model=list[schemas.Reporte])
def read_reportes(db=Depends(get_db)):
    return services.listar_reportes(db)

@router.get("/{reporte_id}", response_model=schemas.Reporte)
def read_reporte(reporte_id: int, db=Depends(get_db)):  
    return services.leer_reporte(db, reporte_id)    

@router.post("/", response_model=schemas.Reporte)
def create_reporte(reporte: schemas.ReporteCreate, db=Depends(get_db)):
    return services.crear_reporte(db, reporte)

@router.delete("/{reporte_id}", response_model=dict)
def delete_reporte(reporte_id: int, db=Depends(get_db)):
    return services.eliminar_reporte(db, reporte_id)    

@router.put("/{reporte_id}", response_model=schemas.Reporte)
def update_reporte(reporte_id: int, reporte: schemas.ReporteUpdate, db=Depends(get_db)):
    return services.actualizar_reporte(db, reporte_id, reporte)

