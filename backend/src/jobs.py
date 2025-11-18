import logging
from datetime import date
from sqlalchemy import select, update
from sqlalchemy.orm import Session
from src.database import SessionLocal
from src.encuestas_asignaturas.models import EncuestaAsignatura, EstadoEncuesta
from src.reportes.models import Reporte

# Configurar un logger básico para ver los resultados del job
log = logging.getLogger(__name__)

def check_deadlines():
    """
    Job principal que se ejecuta periódicamente para cerrar encuestas y generar reportes automáticamente.
    """
    
    db: Session = SessionLocal()
    try:
        today = date.today()
        #today = date(2025, 11, 18) simular otra fecha
        log.info(f"Ejecutando check_deadlines (Fecha: {today})...")
        
        # Obtenemos IDs de encuestas 'abiertas' cuya fecha_fin ya pasó
        encuestas_a_cerrar_ids = db.scalars(
            select(EncuestaAsignatura.id)
            .where(
                EncuestaAsignatura.estado == EstadoEncuesta.abierta,
                EncuestaAsignatura.fecha_fin < today
            )
        ).all()
        
        if encuestas_a_cerrar_ids:
            log.info(f"Cerrando {len(encuestas_a_cerrar_ids)} encuestas...")
            # 1.1. Cerramos todas las encuestas vencidas en un solo update
            db.execute(
                update(EncuestaAsignatura)
                .where(EncuestaAsignatura.id.in_(encuestas_a_cerrar_ids))
                .values(estado=EstadoEncuesta.cerrada)
            )
            
            # 1.2. Verificamos cuáles de estas YA tienen un reporte
            reportes_existentes_ids = set(db.scalars(
                select(Reporte.id_encuesta_asignatura)
                .where(Reporte.id_encuesta_asignatura.in_(encuestas_a_cerrar_ids))
            ).all())
            
            # 1.3. Creamos reportes solo para las que NO tenían uno
            ids_para_crear_reporte = [
                enc_id for enc_id in encuestas_a_cerrar_ids 
                if enc_id not in reportes_existentes_ids
            ]
            
            if ids_para_crear_reporte:
                log.info(f"Creando {len(ids_para_crear_reporte)} reportes automáticos...")
                nuevos_reportes = [
                    Reporte(id_encuesta_asignatura=enc_id) 
                    for enc_id in ids_para_crear_reporte
                ]
                db.add_all(nuevos_reportes)
            
            db.commit()
        else:
            log.info("No hay encuestas para cerrar.")

            
    except Exception as e:
        log.error(f"Error durante check_deadlines: {e}")
        db.rollback()
    finally:
        db.close()
        log.info("check_deadlines finalizado.")