from datetime import date
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import src.main  # noqa: F401
from sqlalchemy import select
from src.database import SessionLocal
from src.personas.models import Persona
from src.asignaturas.models import Asignatura
from src.carreras.models import Carrera
from src.cursadas.models import Cursada
from src.encuestas_base.models import EncuestaBase
from src.encuestas_asignaturas.models import EncuestaAsignatura, EstadoEncuesta


def main():
    db = SessionLocal()
    try:
        # Alumno demo
        alumno = db.scalar(select(Persona).where(Persona.dni == 99000001))
        if not alumno:
            print("No se encontró el alumno demo con DNI 99000001")
            return

        # Carrera (usar la primera existente)
        carrera = db.scalar(select(Carrera))
        if not carrera:
            print("No hay carreras cargadas")
            return

        # Encuesta base vigente para 2026 (preferir ciclo basico si existe)
        encuesta_base = db.scalar(
            select(EncuestaBase).where(EncuestaBase.anio_inicio <= 2026, EncuestaBase.anio_fin >= 2026)
        )
        if not encuesta_base:
            encuesta_base = db.scalar(select(EncuestaBase).order_by(EncuestaBase.id))
        if not encuesta_base:
            print("No hay encuestas base cargadas")
            return

        materias = [
            {"nombre": "Bases de Datos I", "docente": "Gabriel Ingravallo", "cursado": "2do cuatrimestre"},
            {"nombre": "Estadística", "docente": "Alfredo Holley", "cursado": "2do cuatrimestre"},
            {"nombre": "Desarrollo de Software", "docente": "Leonardo Ordíñez", "cursado": "2do cuatrimestre"},
        ]

        for m in materias:
            asignatura = db.scalar(select(Asignatura).where(Asignatura.nombre == m["nombre"]))
            if not asignatura:
                asignatura = Asignatura(
                    nombre=m["nombre"],
                    nombre_docente=m["docente"],
                    cursado=m["cursado"],
                    id_carrera=carrera.id,
                    año=2025,
                    sede="Trelew",
                )
                db.add(asignatura)
                db.flush()
                print(f"Creada asignatura: {m['nombre']}")
            else:
                # Actualizar datos si ya existe
                asignatura.nombre_docente = m["docente"]
                asignatura.cursado = m["cursado"]
                asignatura.id_carrera = carrera.id
                db.flush()

            # Cursada 2026
            cursada = db.scalar(
                select(Cursada).where(
                    Cursada.id_persona == alumno.id,
                    Cursada.id_asignatura == asignatura.id,
                    Cursada.ciclo_lectivo == 2026,
                )
            )
            if not cursada:
                cursada = Cursada(
                    id_persona=alumno.id,
                    id_asignatura=asignatura.id,
                    ciclo_lectivo=2026,
                )
                db.add(cursada)
                db.flush()
                print(f"Creada cursada 2026 para {m['nombre']}")

            # Encuesta asignatura 2026 abierta
            encuesta_asig = db.scalar(
                select(EncuestaAsignatura).where(
                    EncuestaAsignatura.id_encuesta_base == encuesta_base.id,
                    EncuestaAsignatura.id_asignatura == asignatura.id,
                    EncuestaAsignatura.ciclo_lectivo == 2026,
                )
            )
            if not encuesta_asig:
                encuesta_asig = EncuestaAsignatura(
                    id_encuesta_base=encuesta_base.id,
                    id_asignatura=asignatura.id,
                    ciclo_lectivo=2026,
                    estado=EstadoEncuesta.abierta,
                    fecha_inicio=date(2026, 1, 1),
                    fecha_fin=date(2026, 12, 31),
                )
                db.add(encuesta_asig)
                db.flush()
                print(f"Creada encuesta asignatura 2026 (abierta) para {m['nombre']}")
            else:
                encuesta_asig.estado = EstadoEncuesta.abierta
                encuesta_asig.fecha_inicio = date(2026, 1, 1)
                encuesta_asig.fecha_fin = date(2026, 12, 31)
                db.flush()
                print(f"Actualizada encuesta asignatura 2026 (abierta) para {m['nombre']}")

        db.commit()
        print("\nListo. Las 3 encuestas quedaron pendientes para el alumno demo (DNI 99000001).")
    except Exception as e:
        db.rollback()
        print("Error:", e)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
