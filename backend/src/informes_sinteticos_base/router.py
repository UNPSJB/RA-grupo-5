from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db 
from src.informes_sinteticos_base import schemas, services


router = APIRouter(prefix="/informes-sinteticos-base", tags=["informes-sinteticos-base"])


@router.get("/", response_model=list[schemas.InformeSinteticoBaseRead])
def read_informes_sinteticos(db: Session = Depends(get_db)):
    return services.listar_informes_sinteticos(db)

@router.get("/{informe_id}", response_model=schemas.InformeSinteticoBaseRead)
def read_informe_sintetico(informe_id: int, db: Session = Depends(get_db)):
    return services.leer_informe_sintetico(db, informe_id)

@router.post("/", response_model=schemas.InformeSinteticoBaseRead)
def create_informe_sintetico(informe: schemas.InformeSinteticoBaseCreate, db: Session = Depends(get_db)):
    return services.crear_informe_sintetico(db, informe)

# # OBTENER EL "ACTUAL"
@router.get("/actual", response_model=schemas.InformeSinteticoBaseRead)
def read_informe_base_actual(db: Session = Depends(get_db)):
    informe_base = services.leer_informe_base_actual(db)
    if informe_base is None:
        raise HTTPException(
             status_code=404,
             detail="No hay informe sintetico base disponible"
         )
    return informe_base
 
# @router.get("/actual", response_model=schemas.InformeSinteticoBaseRead)
# def read_informe_base_actual(db: Session = Depends(get_db)):
#     informe_base = services.leer_informe_base_actual(db)
#     if not informe_base:
#         raise HTTPException(status_code=404, detail="No hay informe sintetico base disponible")

#     return {
#         "id": informe_base.id,
#         "titulo": informe_base.titulo,
#         "preguntas": [
#             {
#                 "id": p.id,
#                 "texto_pregunta": p.texto_pregunta,
#                 "tipo": getattr(p, "tipo", ""),
#             }
#             for p in (informe_base.preguntas or [])
#         ]
#     }

