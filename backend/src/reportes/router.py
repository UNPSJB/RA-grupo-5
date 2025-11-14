from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.reportes import schemas, services

# permissions
from src.seguridad.deps import require_permissions
from src.seguridad.models import PermissionName

router = APIRouter(
    prefix="/reportes",
    tags=["reportes"],
    dependencies=[Depends(require_permissions(PermissionName.VER_REPORTES))],
)

@router.get("/", response_model=list[schemas.Reporte])
def read_reportes(db: Session = Depends(get_db)):
    return services.listar_reportes(db)

@router.get(
    "/disponibles",
    response_model=list[schemas.ReporteListadoItem],
)
def read_reportes_disponibles(db: Session = Depends(get_db)):
    return services.listar_reportes_disponibles(db)

# Endpoint para pedir el informe y usar "Ver Informe" a partir del id del reporte
@router.get("/{reporte_id}/informe", response_model=dict | None)
def read_informe_por_reporte(reporte_id: int, db: Session = Depends(get_db)):
    rep = services.leer_reporte(db, reporte_id)
    # seleccionar informe más reciente (si hay varios)
    informes = rep.informes_asignaturas or []
    informe_sel = max(informes, key=lambda x: x.id) if informes else None
    if not informe_sel:
        return None
    return {"id": informe_sel.id, "estado": informe_sel.estado.name}

@router.get("/{reporte_id}", response_model=schemas.Reporte)
def read_reporte(reporte_id: int, db: Session = Depends(get_db)):  
    return services.leer_reporte(db, reporte_id)    

@router.post("/", response_model=schemas.Reporte)
def create_reporte(reporte: schemas.ReporteCreate, db: Session = Depends(get_db)):
    return services.crear_reporte(db, reporte)

@router.delete("/{reporte_id}", response_model=dict)
def delete_reporte(reporte_id: int, db: Session = Depends(get_db)):
    return services.eliminar_reporte(db, reporte_id)    

@router.put("/{reporte_id}", response_model=schemas.Reporte)
def update_reporte(reporte_id: int, reporte: schemas.ReporteUpdate, db: Session = Depends(get_db)):
    return services.actualizar_reporte(db, reporte_id, reporte)

@router.get("/generar/{reporte_id}", response_model=dict)
def resumir_variable(reporte_id: int, db: Session = Depends(get_db)):
    return services.generar_resumen_variable(db, reporte_id)
