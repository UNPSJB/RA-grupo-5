from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import select

# Variable global en memoria para simular el año del sistema (2026 por defecto para la demo)
_SIMULATED_YEAR: int = 2026


def get_current_system_year() -> int:
    """Devuelve el año actual del sistema configurado/simulado."""
    return _SIMULATED_YEAR


def set_current_system_year(anio: int) -> int:
    """Actualiza el año simulado del sistema en memoria."""
    global _SIMULATED_YEAR
    _SIMULATED_YEAR = anio
    return _SIMULATED_YEAR


def get_current_system_date() -> date:
    """
    Devuelve la fecha actual simulada del sistema manteniendo mes y día reales si es posible,
    ajustados al año simulado en memoria.
    """
    today = date.today()
    try:
        return today.replace(year=_SIMULATED_YEAR)
    except ValueError:
        # En caso de 29 de febrero en año no bisiesto
        return date(_SIMULATED_YEAR, 2, 28)


def get_periodo_label(anio: int) -> str:
    """Devuelve el rango de vigencia de encuestas asociado al año."""
    if 2025 <= anio <= 2028:
        return "2025–2028"
    elif 2029 <= anio <= 2032:
        return "2029–2032"
    return f"{anio}"


def transicionar_sistema_al_anio(db: Session, nuevo_anio: int) -> dict:
    """
    Sincroniza y congela/activa el estado de las encuestas en la BD según el año simulado:
    - Si nuevo_anio >= 2029:
        * Encuestas del período 2025–2028 (ciclo_lectivo <= 2028):
          Pasan a estado 'cerrada' (congelamiento histórico).
          Se asegura que tengan su Reporte generado si no lo tenían.
        * Encuestas del ciclo 2029 (período 2029–2032):
          La encuesta para Asignatura 2 pasa a estado 'abierta' (activación del nuevo período con IA).
    - Si nuevo_anio <= 2028 (ej. 2026):
        * Encuestas del ciclo 2026:
          Pasan a estado 'abierta'.
        * Encuestas del ciclo 2029:
          Pasan a estado 'cerrada' (período futuro).
    """
    set_current_system_year(nuevo_anio)

    from sqlalchemy.orm import joinedload
    from src.encuestas_asignaturas.models import EncuestaAsignatura, EstadoEncuesta
    from src.reportes.models import Reporte

    resumen = {
        "anio": nuevo_anio,
        "encuestas_cerradas": 0,
        "encuestas_abiertas": 0,
        "reportes_creados": 0,
    }

    # Normalizar fechas según el ciclo lectivo para evitar mostrar fechas incoherentes con el período
    from src.encuestas_base.models import EncuestaBase
    todas_encuestas = db.scalars(select(EncuestaAsignatura).options(joinedload(EncuestaAsignatura.encuesta_base))).all()
    for enc in todas_encuestas:
        if enc.encuesta_base and enc.encuesta_base.anio_inicio and enc.encuesta_base.anio_fin:
            enc.fecha_inicio = date(enc.encuesta_base.anio_inicio, 1, 1)
            enc.fecha_fin = date(enc.encuesta_base.anio_fin, 12, 31)
        elif enc.ciclo_lectivo and enc.ciclo_lectivo >= 2029:
            enc.fecha_inicio = date(enc.ciclo_lectivo, 1, 1)
            enc.fecha_fin = date(enc.ciclo_lectivo, 12, 31)
        elif enc.ciclo_lectivo and enc.ciclo_lectivo <= 2028:
            enc.fecha_inicio = date(enc.ciclo_lectivo, 1, 1)
            enc.fecha_fin = date(enc.ciclo_lectivo, 12, 31)
    db.flush()

    if nuevo_anio >= 2029:
        # 1. Congelar encuestas del ciclo 2026/período 2025-2028
        encuestas_historicas = db.scalars(
            select(EncuestaAsignatura).where(
                EncuestaAsignatura.ciclo_lectivo <= 2028,
                EncuestaAsignatura.estado == EstadoEncuesta.abierta,
            )
        ).all()

        for enc in encuestas_historicas:
            enc.estado = EstadoEncuesta.cerrada
            resumen["encuestas_cerradas"] += 1

        db.flush()

        # Generar reportes automáticos faltantes para encuestas congeladas
        cerradas_ids = [e.id for e in encuestas_historicas]
        if cerradas_ids:
            reportes_existentes = set(
                db.scalars(
                    select(Reporte.id_encuesta_asignatura).where(
                        Reporte.id_encuesta_asignatura.in_(cerradas_ids)
                    )
                ).all()
            )
            faltantes = [eid for eid in cerradas_ids if eid not in reportes_existentes]
            for fid in faltantes:
                db.add(Reporte(id_encuesta_asignatura=fid))
                resumen["reportes_creados"] += 1
            db.flush()

        # 2. Activar encuesta 2029 (Asignatura 2) para que esté pendiente con sus preguntas de IA
        encuestas_2029 = db.scalars(
            select(EncuestaAsignatura).where(
                EncuestaAsignatura.ciclo_lectivo == 2029,
                EncuestaAsignatura.id_asignatura == 2,
            )
        ).all()

        for enc in encuestas_2029:
            enc.estado = EstadoEncuesta.abierta
            enc.fecha_inicio = date(2029, 1, 1)
            enc.fecha_fin = date(2029, 12, 31)
            resumen["encuestas_abiertas"] += 1

    else:
        # 1. Reabrir encuestas de 2026
        encuestas_2026 = db.scalars(
            select(EncuestaAsignatura).where(
                EncuestaAsignatura.ciclo_lectivo == 2026,
                EncuestaAsignatura.id_asignatura.in_([1, 2]),
            )
        ).all()

        for enc in encuestas_2026:
            enc.estado = EstadoEncuesta.abierta
            enc.fecha_inicio = date(2026, 1, 1)
            enc.fecha_fin = date(2026, 12, 31)
            resumen["encuestas_abiertas"] += 1

        # 2. Cerrar encuestas de 2029
        encuestas_2029 = db.scalars(
            select(EncuestaAsignatura).where(EncuestaAsignatura.ciclo_lectivo == 2029)
        ).all()

        for enc in encuestas_2029:
            enc.estado = EstadoEncuesta.cerrada
            resumen["encuestas_cerradas"] += 1

    db.commit()
    return resumen
