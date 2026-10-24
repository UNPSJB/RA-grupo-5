from datetime import date
import sqlite3
import os
import sys

# Asegurar que 'backend' está en sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import select
import src.main  # noqa: F401 - registra todos los modelos SQLAlchemy
from src.database import SessionLocal
from src.encuestas_base.models import EncuestaBase
from src.variables.models import Variable
from src.preguntas.models import Pregunta, TipoPreguntaEnum
from src.pregunta_opcion.models import PreguntaOpcion
from src.encuestas_asignaturas.models import EncuestaAsignatura, EstadoEncuesta
from src.cursadas.models import Cursada
from src.personas.models import Persona
from src.reportes.models import Reporte


def poblar_version_2029(db):
    print("Iniciando verificación/poblado de la versión 2029–2032...")

    # 1. Verificar EncuestaBase 3 (2029-2032)
    base_v1 = db.get(EncuestaBase, 1)
    base_v2 = db.get(EncuestaBase, 3)

    if not base_v1 or not base_v2:
        print("Error: Se requieren EncuestaBase ID 1 y 3.")
        return

    base_v2.anio_inicio = 2029
    base_v2.anio_fin = 2032
    db.flush()

    # 2. Replicar variables A-G de V1 hacia V2 si no existen
    vars_v1 = {v.codigo: v for v in base_v1.variables}
    vars_v2 = {v.codigo: v for v in base_v2.variables}

    for codigo, var_v1 in vars_v1.items():
        if codigo not in vars_v2:
            nueva_var = Variable(
                nombre=var_v1.nombre,
                codigo=f"{codigo}",
                id_encuesta_base=base_v2.id,
            )
            db.add(nueva_var)
            db.flush()
            vars_v2[codigo] = nueva_var

            # Replicar preguntas de esta variable
            for p_v1 in var_v1.preguntas:
                nueva_p = Pregunta(
                    texto_pregunta=p_v1.texto_pregunta,
                    tipo=p_v1.tipo,
                    obligatoria=p_v1.obligatoria,
                    id_variable=nueva_var.id,
                )
                db.add(nueva_p)
                db.flush()

                # Replicar pregunta_opcion
                for po_v1 in p_v1.pregunta_opcion:
                    nueva_po = PreguntaOpcion(
                        id_pregunta=nueva_p.id,
                        id_opcion_respuesta=po_v1.id_opcion_respuesta,
                    )
                    db.add(nueva_po)
            print(f"  [OK] Variable '{codigo}' clonada a V2 con {len(var_v1.preguntas)} preguntas.")

    # 3. Asegurar Variable H: 'Competencias Digitales / IA' en V2
    var_h = vars_v2.get("H")
    if not var_h:
        var_h = Variable(
            nombre="Competencias Digitales e Inteligencia Artificial",
            codigo="H",
            id_encuesta_base=base_v2.id,
        )
        db.add(var_h)
        db.flush()
        vars_v2["H"] = var_h
    else:
        var_h.nombre = "Competencias Digitales e Inteligencia Artificial"
        db.flush()

    # 4. Preguntas específicas de IA para la variable H
    preguntas_ia_existentes = list(var_h.preguntas)
    if len(preguntas_ia_existentes) == 0:
        print("  Insertando preguntas de Inteligencia Artificial para la versión 2029...")
        preguntas_ia = [
            (
                "¿Utilizó herramientas de Inteligencia Artificial Generativa (ej. ChatGPT, Claude, Copilot) como apoyo en el estudio de esta asignatura?",
                TipoPreguntaEnum.single_choice,
                True,
                [1, 2],  # Si, No
            ),
            (
                "¿El equipo docente promovió o brindó pautas claras sobre el uso ético y adecuado de la Inteligencia Artificial?",
                TipoPreguntaEnum.single_choice,
                True,
                [10, 11, 12, 13],  # Escala 1-4
            ),
            (
                "¿En qué medida considera que las herramientas de IA favorecieron su comprensión y aprendizaje de los contenidos?",
                TipoPreguntaEnum.single_choice,
                True,
                [10, 11, 12, 13],  # Escala 1-4
            ),
            (
                "¿Qué herramientas de IA utilizó en la cursada y qué aspectos positivos o dificultades observó?",
                TipoPreguntaEnum.open,
                False,
                [None],
            ),
        ]

        for texto, tipo, oblig, opciones in preguntas_ia:
            p = Pregunta(
                texto_pregunta=texto,
                tipo=tipo,
                obligatoria=oblig,
                id_variable=var_h.id,
            )
            db.add(p)
            db.flush()

            for op_id in opciones:
                po = PreguntaOpcion(
                    id_pregunta=p.id,
                    id_opcion_respuesta=op_id,
                )
                db.add(po)
        print("  [OK] Preguntas de Inteligencia Artificial insertadas.")

    # 5. Asegurar cursadas 2026 y 2029 para el Alumno Demo (DNI 99000001)
    alumno = db.scalar(select(Persona).where(Persona.dni == 99000001))
    if alumno:
        for anio in (2026, 2029):
            for asig_id in (1, 2):
                cursada = db.scalar(
                    select(Cursada).where(
                        Cursada.id_persona == alumno.id,
                        Cursada.id_asignatura == asig_id,
                        Cursada.ciclo_lectivo == anio,
                    )
                )
                if not cursada:
                    db.add(Cursada(id_persona=alumno.id, id_asignatura=asig_id, ciclo_lectivo=anio))
        db.flush()
        print("  [OK] Cursadas de Alumno Demo aseguradas para 2026 y 2029.")

    # 6. Asegurar EncuestaAsignatura para 2029 en Asignatura 2 (PENDIENTE para la demo en 2029)
    encuesta_2029_asig2 = db.scalar(
        select(EncuestaAsignatura).where(
            EncuestaAsignatura.id_encuesta_base == base_v2.id,
            EncuestaAsignatura.id_asignatura == 2,
            EncuestaAsignatura.ciclo_lectivo == 2029,
        )
    )
    if not encuesta_2029_asig2:
        encuesta_2029_asig2 = EncuestaAsignatura(
            id_encuesta_base=base_v2.id,
            id_asignatura=2,
            ciclo_lectivo=2029,
            estado=EstadoEncuesta.cerrada,  # Inicialmente cerrada hasta que el reloj viaje a 2029
            fecha_inicio=date(2029, 1, 1),
            fecha_fin=date(2029, 12, 31),
        )
        db.add(encuesta_2029_asig2)
        db.flush()
        print("  [OK] Encuesta 2029 Asignatura 2 creada (pendiente para demo 2029).")

    db.commit()
    print("Versión 2029–2032 poblada exitosamente.")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        poblar_version_2029(db)
    finally:
        db.close()
