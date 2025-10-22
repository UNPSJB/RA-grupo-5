from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.informes_base import schemas, services

router = APIRouter(prefix="/informes-base", tags=["informes-base"])

@router.get("/", response_model=list[schemas.InformeBaseRead])
def read_informes_base(db: Session = Depends(get_db)):
    return services.listar_informes_base(db)

@router.post("/",response_model=schemas.InformeBaseRead)
def create_informe_base(informe_base: schemas.InformeBaseCreate,  db: Session = Depends(get_db)):
    return services.crear_informe_base(db,informe_base)

@router.get("/{informe_base_id}", response_model=schemas.InformeBaseRead)
def read_informe_base(informe_base_id: int, db:Session = Depends(get_db)):
    return services.leer_informe_base(db, informe_base_id)

@router.put("/{informe_base_id}", response_model=schemas.InformeBaseRead)
def update_informe_base(
    informe_base_id: int, informe_base: schemas.InformeBaseUpdate, db: Session = Depends(get_db)):
    return services.modificar_informe_base(db, informe_base_id, informe_base)
