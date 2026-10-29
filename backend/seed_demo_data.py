#!/usr/bin/env python3
"""
Seed de datos de DEMO para el docente Sebastian Schanz.

- NO borra la base ni registros preexistentes.
- Solo limpia/reemplaza los registros creados por este mismo seed en ejecuciones
  anteriores (marcados por la asignatura/fechas/docente de demo).
- Crea: asignatura demo, cursadas del docente, encuestas por año, reportes,
  respuestas de alumnos (2025-2029) con detalles, informes curriculares
  respondidos por el docente y sus textos.
- El reporte 2026 queda PENDIENTE de respuesta docente para poder completarlo
  en vivo durante la demo.

Ejecutar desde backend/:  python seed_demo_data.py
"""
import os
import sqlite3
import random
import math
from collections import defaultdict
from passlib.hash import pbkdf2_sha256

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database.db")
random.seed(20251984)

DOCENTE = "Sebastian Schanz"
DOCENTE_ID = 35
ASIG_NOMBRE = "Ingeniería de Software I"
# Alumno demo para validar el cambio de período (time travel).
ALUMNO_DNI = 44555666
ALUMNO_PASSWORD = "1234"
ALUMNO_EMAIL = "alumno.demo@test.com"
ALUMNO_ASIG_ID = 2  # Lógica y Discreta: tiene encuestas de ambos períodos
ALUMNO_ASIG_NOMBRE = "Logica y Discreta"
BASE_2025_2028 = 1   # Encuesta-ciclo-basico-V1 (2025-2028)
BASE_2029_2032 = 3   # Encuesta-ciclo-basico-V2 (2029-2032, incluye variable H de IA)
# 2025 es un ciclo base solo para que la comparativa histórica del primer
# reporte (2026) tenga contra qué compararse. No genera reporte ni informe.
BASELINE_YEAR = 2025
PENDIENTE_DOCENTE_YEAR = 2026
YEARS = {2025: 12, 2026: 15, 2027: 18, 2028: 20, 2029: 12}

COMENTARIOS_POS = [
    "Excelente docente, muy claro en sus explicaciones.",
    "Las clases prácticas fueron muy útiles para fijar los contenidos.",
    "Muy buen enfoque aplicado de la materia.",
    "Los ejemplos y casos reales ayudaron mucho a comprender los temas.",
    "Buena predisposición del equipo docente para responder dudas.",
    "El material de la cátedra está muy bien organizado.",
    "Se nota el compromiso y la dedicación con la cursada.",
]
COMENTARIOS_MEJORA = [
    "La parte teórica podría ser más ágil y dinámica.",
    "Sería útil contar con más ejercicios resueltos antes de los parciales.",
    "Los tiempos de entrega de algunos trabajos fueron ajustados.",
    "Convendría profundizar en los temas de arquitectura de software.",
    "Faltó coordinación entre algunas clases teóricas y prácticas.",
]
COMENTARIOS_AI = [
    "Usé ChatGPT para repasar conceptos y me resultó muy útil.",
    "Probé Copilot para ejemplos de código; sirve para tareas repetitivas.",
    "La IA ayudó a entender mejor los patrones de diseño con ejemplos.",
    "A veces la IA generaba código incorrecto; hay que revisar siempre.",
    "Me gustaría que se den más pautas sobre el uso ético de estas herramientas.",
    "Sirve mucho para estudiar, pero no reemplaza el razonamiento propio.",
]

INTRO_INFORME = [
    "El dictado se desarrolló con normalidad, alcanzando un alto porcentaje de los contenidos planificados.",
    "Se completó el cronograma previsto con ajustes menores en las últimas unidades.",
    "La cursada se desarrolló según lo planificado, con buena participación del alumnado.",
    "Se logró dictar la totalidad de los contenidos, incorporando actividades prácticas adicionales.",
]


def _score_opcion(texto: str) -> float:
    t = (texto or "").lower().strip()
    # Primero las negativas: "Malo, No Satisfactorio" contiene "satisfactorio".
    if "npo" in t or "no puedo" in t:
        return 0.5
    if "malo" in t or "insuficiente" in t or "no satisfactorio" in t:
        return 0.05
    if "regular" in t or "poco" in t:
        return 0.35
    if "muy bueno" in t or "muy satisfactorio" in t or "excelente" in t:
        return 1.0
    if "bueno" in t or "satisfactorio" in t:
        return 0.8
    if t == "no" or "nunca" in t or "escasos" in t:
        return 0.05
    if t.startswith("si") or "siempre" in t or "suficientes" in t:
        return 1.0
    if "más de 50" in t or "mas de 50" in t:
        return 0.75
    if "entre 0 y 50" in t:
        return 0.25
    if t == "4":
        return 1.0
    if t == "3":
        return 0.8
    if t == "2":
        return 0.4
    if t == "1":
        return 0.1
    if "una" in t:
        return 0.5
    return 0.5


def main():
    if not os.path.exists(DB_PATH):
        raise SystemExit(f"No existe la base en {DB_PATH}")

    conn = sqlite3.connect(DB_PATH, timeout=60)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("PRAGMA busy_timeout = 60000")

    def q(sql, args=()):
        cur.execute(sql, args)
        return cur.fetchall()

    def one(sql, args=()):
        cur.execute(sql, args)
        return cur.fetchone()

    print("=== SEED DEMO: Sebastian Schanz ===")

    # ------------------------------------------------------------------
    # 0) Docente
    # ------------------------------------------------------------------
    doc = one("SELECT id, nombre, apellido FROM personas WHERE id=?", (DOCENTE_ID,))
    if not doc:
        raise SystemExit("No existe la persona id 35 (Sebastian Schanz).")
    docente_full = f"{doc['nombre']} {doc['apellido']}"
    print(f"Docente: {docente_full} (id={DOCENTE_ID})")

    # ------------------------------------------------------------------
    # 0.b) Normalización de datos legacy
    #      Algunas asignaturas preexistentes tienen valores que no pertenecen
    #      al enum Cursado y rompen los listados/estadísticas. Solo se
    #      normaliza el texto, sin borrar ni alterar el resto del registro.
    # ------------------------------------------------------------------
    cur.execute(
        "UPDATE asignaturas SET cursado='cuatrimestre2' WHERE cursado='2do cuatrimestre'"
    )
    cur.execute(
        "UPDATE asignaturas SET cursado='cuatrimestre1' WHERE cursado='1er cuatrimestre'"
    )
    # email-validator rechaza el TLD reservado .test y rompe los listados que
    # incluyen personas (por ejemplo /cursadas). Normalizamos solo esos demos.
    cur.execute(
        """UPDATE personas
           SET email = replace(email, '@example.test', '@demo.com')
           WHERE email LIKE '%@example.test'"""
    )
    conn.commit()

    # ------------------------------------------------------------------
    # 1) Limpieza de intentos previos de ESTE seed
    #    (no toca datos ajenos: se identifican por fechas/asignatura/docente demo)
    # ------------------------------------------------------------------
    old_encuestas = q(
        """SELECT id FROM encuestas_asignaturas
           WHERE (
                   id_asignatura IN
                   (SELECT id FROM asignaturas WHERE nombre=?)
                   AND ciclo_lectivo IN (2025,2026,2027,2028,2029)
                 )
              OR (
                   id_asignatura=4
                   AND fecha_inicio LIKE '%-03-01'
                   AND ciclo_lectivo IN (2026,2027,2028,2029)
                 )""",
        (ASIG_NOMBRE,),
    )
    old_enc_ids = [r["id"] for r in old_encuestas]

    old_informes = q(
        """SELECT id FROM informes_asignaturas
           WHERE docente=? AND ciclo_lectivo IN (2026,2027,2028,2029)
             AND (id_asignatura=4 OR id_asignatura IN
                  (SELECT id FROM asignaturas WHERE nombre=?))""",
        (DOCENTE, ASIG_NOMBRE),
    )
    old_inf_ids = [r["id"] for r in old_informes]

    if old_enc_ids:
        ph = ",".join("?" * len(old_enc_ids))
        old_resp = q(f"SELECT id FROM respuestas WHERE id_encuesta_asignatura IN ({ph})", old_enc_ids)
        old_resp_ids = [r["id"] for r in old_resp]
        if old_resp_ids:
            ph2 = ",".join("?" * len(old_resp_ids))
            cur.execute(f"DELETE FROM detalles_respuestas WHERE id_respuesta IN ({ph2})", old_resp_ids)
            cur.execute(f"DELETE FROM respuestas WHERE id IN ({ph2})", old_resp_ids)
        cur.execute(f"DELETE FROM reportes WHERE id_encuesta_asignatura IN ({ph})", old_enc_ids)
        cur.execute(f"DELETE FROM encuestas_asignaturas WHERE id IN ({ph})", old_enc_ids)

    if old_inf_ids:
        ph = ",".join("?" * len(old_inf_ids))
        old_resp = q(f"SELECT id FROM respuestas WHERE id_informe_asignatura IN ({ph})", old_inf_ids)
        old_resp_ids = [r["id"] for r in old_resp]
        if old_resp_ids:
            ph2 = ",".join("?" * len(old_resp_ids))
            cur.execute(f"DELETE FROM detalles_respuestas WHERE id_respuesta IN ({ph2})", old_resp_ids)
            cur.execute(f"DELETE FROM respuestas WHERE id IN ({ph2})", old_resp_ids)
        cur.execute(f"DELETE FROM informes_asignaturas WHERE id IN ({ph})", old_inf_ids)

    # Preguntas IA duplicadas creadas por el seed anterior (con id_variable NULL)
    for row in q("SELECT id FROM preguntas WHERE id IN (113,114,115,116)"):
        qid = row["id"]
        cur.execute(
            """DELETE FROM detalles_respuestas WHERE id_pregunta_opcion IN
               (SELECT id FROM pregunta_opcion WHERE id_pregunta=?)""",
            (qid,),
        )
        cur.execute("DELETE FROM pregunta_opcion WHERE id_pregunta=?", (qid,))
        cur.execute("DELETE FROM preguntas WHERE id=?", (qid,))

    conn.commit()
    print("Limpieza de intentos previos OK.")

    # ------------------------------------------------------------------
    # 2) Asignatura demo + cursadas del docente
    # ------------------------------------------------------------------
    asig = one("SELECT id FROM asignaturas WHERE nombre=? ORDER BY id LIMIT 1", (ASIG_NOMBRE,))
    if asig:
        asig_id = asig["id"]
        cur.execute(
            "UPDATE asignaturas SET nombre_docente=?, cursado=? WHERE id=?",
            (docente_full, "cuatrimestre2", asig_id),
        )
    else:
        cur.execute(
            """INSERT INTO asignaturas (nombre, año, nombre_docente, cursado, sede, id_carrera)
               VALUES (?,?,?,?,?,?)""",
            (ASIG_NOMBRE, 2, docente_full, "cuatrimestre2", "Trelew", 1),
        )
        asig_id = cur.lastrowid
    conn.commit()
    print(f"Asignatura demo: {ASIG_NOMBRE} (id={asig_id})")

    for year in YEARS:
        exists = one(
            "SELECT id FROM cursadas WHERE id_persona=? AND id_asignatura=? AND ciclo_lectivo=?",
            (DOCENTE_ID, asig_id, year),
        )
        if not exists:
            cur.execute(
                "INSERT INTO cursadas (id_persona, id_asignatura, ciclo_lectivo) VALUES (?,?,?)",
                (DOCENTE_ID, asig_id, year),
            )
    conn.commit()

    # ------------------------------------------------------------------
    # 2.b) Alumno demo para probar ambos períodos (time travel)
    #      Queda inscripto en una materia con encuestas 2026 y 2029.
    # ------------------------------------------------------------------
    asig_alumno = one(
        "SELECT id FROM asignaturas WHERE id=? OR nombre=? ORDER BY id LIMIT 1",
        (ALUMNO_ASIG_ID, ALUMNO_ASIG_NOMBRE),
    )
    if not asig_alumno:
        raise SystemExit(
            f"No existe la asignatura {ALUMNO_ASIG_ID} / {ALUMNO_ASIG_NOMBRE}."
        )
    asig_alumno_id = asig_alumno["id"]

    password_hash = pbkdf2_sha256.hash(ALUMNO_PASSWORD)
    alumno = one("SELECT id FROM personas WHERE dni=?", (ALUMNO_DNI,))
    if alumno:
        alumno_id = alumno["id"]
        cur.execute(
            """UPDATE personas
               SET nombre=?, apellido=?, telefono=?, email=?,
                   contacto_emergencia=?, password_hash=?
               WHERE id=?""",
            (
                "Alumno",
                "Demo Time Travel",
                "4455566600",
                ALUMNO_EMAIL,
                "N/A",
                password_hash,
                alumno_id,
            ),
        )
    else:
        cur.execute(
            """INSERT INTO personas
               (apellido, nombre, dni, telefono, email, contacto_emergencia, password_hash)
               VALUES (?,?,?,?,?,?,?)""",
            (
                "Demo Time Travel",
                "Alumno",
                ALUMNO_DNI,
                "4455566600",
                ALUMNO_EMAIL,
                "N/A",
                password_hash,
            ),
        )
        alumno_id = cur.lastrowid

    rol_alumno = one("SELECT id FROM roles WHERE name='alumno'")
    if not rol_alumno:
        raise SystemExit("No existe el rol 'alumno'.")
    if not one(
        "SELECT id FROM personas_roles WHERE persona_id=? AND role_id=?",
        (alumno_id, rol_alumno["id"]),
    ):
        cur.execute(
            "INSERT INTO personas_roles (persona_id, role_id) VALUES (?,?)",
            (alumno_id, rol_alumno["id"]),
        )

    for ciclo in (2026, 2029):
        if not one(
            "SELECT id FROM cursadas WHERE id_persona=? AND id_asignatura=? AND ciclo_lectivo=?",
            (alumno_id, asig_alumno_id, ciclo),
        ):
            cur.execute(
                "INSERT INTO cursadas (id_persona, id_asignatura, ciclo_lectivo) VALUES (?,?,?)",
                (alumno_id, asig_alumno_id, ciclo),
            )

    # Aseguramos una encuesta abierta por período para esa materia.
    encuestas_alumno = (
        (BASE_2025_2028, 2026, "2026-01-01", "2026-12-31"),
        (BASE_2029_2032, 2029, "2029-01-01", "2029-12-31"),
    )
    for base_id, ciclo, inicio, fin in encuestas_alumno:
        encuesta = one(
            """SELECT id FROM encuestas_asignaturas
               WHERE id_asignatura=? AND id_encuesta_base=? AND ciclo_lectivo=?
               ORDER BY id LIMIT 1""",
            (asig_alumno_id, base_id, ciclo),
        )
        if encuesta:
            cur.execute(
                """UPDATE encuestas_asignaturas
                   SET estado='abierta', fecha_inicio=?, fecha_fin=?
                   WHERE id=?""",
                (inicio, fin, encuesta["id"]),
            )
        else:
            cur.execute(
                """INSERT INTO encuestas_asignaturas
                   (id_encuesta_base, id_asignatura, fecha_inicio, fecha_fin,
                    ciclo_lectivo, estado)
                   VALUES (?,?,?,?,?,?)""",
                (base_id, asig_alumno_id, inicio, fin, ciclo, "abierta"),
            )
    conn.commit()
    print(
        f"Alumno demo: DNI {ALUMNO_DNI} / {ALUMNO_PASSWORD} "
        f"(id={alumno_id}, asignatura={ALUMNO_ASIG_NOMBRE})"
    )

    # ------------------------------------------------------------------
    # 3) Personas alumnas (reutiliza las personas demo existentes)
    # ------------------------------------------------------------------
    alumnos = [
        r["id"]
        for r in q(
            "SELECT id FROM personas WHERE email LIKE 'demo%@test.com' ORDER BY id"
        )
    ]
    if len(alumnos) < max(YEARS.values()):
        extra = q(
            """SELECT p.id FROM personas p
               JOIN personas_roles pr ON pr.persona_id=p.id
               JOIN roles r ON r.id=pr.role_id
               WHERE r.name='alumno' AND p.id<>? ORDER BY p.id""",
            (DOCENTE_ID,),
        )
        for r in extra:
            if r["id"] not in alumnos:
                alumnos.append(r["id"])
    print(f"Alumnos disponibles para respuestas: {len(alumnos)}")

    # ------------------------------------------------------------------
    # 4) Preguntas por encuesta base
    # ------------------------------------------------------------------
    def preguntas_por_base(base_id):
        rows = q(
            """
            SELECT p.id AS pregunta_id, p.tipo, p.id_variable,
                   po.id AS po_id, o.texto_opcion
            FROM preguntas p
            JOIN pregunta_opcion po ON po.id_pregunta = p.id
            LEFT JOIN opciones_respuestas o ON o.id = po.id_opcion_respuesta
            WHERE p.id_variable IN (SELECT id FROM variables WHERE id_encuesta_base=?)
            ORDER BY p.id, po.id
            """,
            (base_id,),
        )
        cerradas = defaultdict(list)   # pregunta_id -> [(po_id, texto)]
        abiertas = {}                  # pregunta_id -> po_id
        for r in rows:
            if r["tipo"] == "single_choice" and r["texto_opcion"] is not None:
                cerradas[r["pregunta_id"]].append((r["po_id"], r["texto_opcion"]))
            elif r["tipo"] == "open" and r["po_id"] is not None:
                abiertas[r["pregunta_id"]] = r["po_id"]
        return cerradas, abiertas

    preguntas_base = {
        BASE_2025_2028: preguntas_por_base(BASE_2025_2028),
        BASE_2029_2032: preguntas_por_base(BASE_2029_2032),
    }

    # Preguntas del informe curricular del docente (ids 32..38)
    informe_preguntas = q(
        """SELECT p.id AS pregunta_id, po.id AS po_id
           FROM preguntas p
           JOIN pregunta_opcion po ON po.id_pregunta = p.id
           WHERE p.id BETWEEN 32 AND 38
           ORDER BY p.id"""
    )
    informe_po = {r["pregunta_id"]: r["po_id"] for r in informe_preguntas}

    # ------------------------------------------------------------------
    # 5) Generación por año
    # ------------------------------------------------------------------
    resumen = []
    for year, cant in YEARS.items():
        base_id = BASE_2029_2032 if year >= 2029 else BASE_2025_2028
        cerradas, abiertas = preguntas_base[base_id]
        k = {2025: 0.55, 2026: 0.9, 2027: 1.35, 2028: 1.85, 2029: 2.1}[year]

        # EncuestaAsignatura
        cur.execute(
            """INSERT INTO encuestas_asignaturas
               (id_encuesta_base, id_asignatura, fecha_inicio, fecha_fin, ciclo_lectivo, estado)
               VALUES (?,?,?,?,?,?)""",
            (base_id, asig_id, f"{year}-03-01", f"{year}-12-15", year, "cerrada"),
        )
        ea_id = cur.lastrowid

        es_baseline = year == BASELINE_YEAR

        # Reporte de esa encuesta (el ciclo base 2025 no lleva reporte)
        reporte_id = None
        if not es_baseline:
            cur.execute("INSERT INTO reportes (id_encuesta_asignatura) VALUES (?)", (ea_id,))
            reporte_id = cur.lastrowid

        # Respuestas de alumnos + detalles
        puntajes = []
        usados = alumnos[:cant]
        for persona_id in usados:
            cur.execute(
                """INSERT INTO respuestas
                   (id_persona, id_encuesta_asignatura, id_informe_asignatura,
                    id_informe_sintetico_carrera)
                   VALUES (?,?,NULL,NULL)""",
                (persona_id, ea_id),
            )
            resp_id = cur.lastrowid

            for pregunta_id, opciones in cerradas.items():
                scores = [_score_opcion(t) for _, t in opciones]
                # Las preguntas de IA se generan con una ponderación más suave
                # para que el gráfico muestre una distribución heterogénea
                # (no un 100% de respuestas afirmativas).
                k_pregunta = 1.1 if pregunta_id in (109, 110, 111) else k
                weights = [math.exp(k_pregunta * s) for s in scores]
                po_id, _ = random.choices(opciones, weights=weights, k=1)[0]
                puntajes.append(_score_opcion(dict(opciones)[po_id]))
                cur.execute(
                    """INSERT INTO detalles_respuestas
                       (id_pregunta_opcion, id_respuesta, texto_respuesta_abierta)
                       VALUES (?,?,NULL)""",
                    (po_id, resp_id),
                )

            # Preguntas abiertas de la encuesta
            for pregunta_id, po_id in abiertas.items():
                if random.random() < 0.35:
                    if pregunta_id == 112:
                        texto = random.choice(COMENTARIOS_AI)
                    elif pregunta_id in (29, 106):
                        texto = random.choice(COMENTARIOS_MEJORA)
                    elif pregunta_id in (30, 107):
                        texto = "Cursen con tiempo y practiquen los ejercicios de la guía."
                    else:
                        texto = random.choice(COMENTARIOS_POS)
                    cur.execute(
                        """INSERT INTO detalles_respuestas
                           (id_pregunta_opcion, id_respuesta, texto_respuesta_abierta)
                           VALUES (?,?,?)""",
                        (po_id, resp_id, texto),
                    )

        # El ciclo base 2025 solo sirve para la comparativa: no genera informe.
        if es_baseline:
            conn.commit()
            promedio = round(sum(puntajes) / len(puntajes) * 100, 1) if puntajes else 0
            resumen.append((year, cant, base_id, ea_id, None, None, promedio))
            print(f"  {year}: {cant} respuestas | encuesta={ea_id} | "
                  f"ciclo base (sin reporte) | score promedio={promedio}%")
            continue

        # El reporte 2026 se deja pendiente para completarlo en vivo.
        if year == PENDIENTE_DOCENTE_YEAR:
            conn.commit()
            promedio = round(sum(puntajes) / len(puntajes) * 100, 1) if puntajes else 0
            resumen.append((year, cant, base_id, ea_id, reporte_id, None, promedio))
            print(f"  {year}: {cant} respuestas | encuesta={ea_id} | "
                  f"reporte={reporte_id} | informe PENDIENTE | "
                  f"score promedio={promedio}%")
            continue

        # Informe curricular docente (respondido)
        cur.execute(
            """INSERT INTO informes_asignaturas
               (sede, ciclo_lectivo, docente, cant_alumnos_insc,
                cant_comisiones_teoricas, cant_comisiones_practicas, estado,
                id_informe_curricular_base, id_asignatura, id_respuesta,
                id_reporte, id_informe_sintetico_carrera)
               VALUES (?,?,?,?,?,?,?,?,?,NULL,?,NULL)""",
            (
                "tw", year, docente_full, cant + 6, 2, 2, "cerrado",
                1, asig_id, reporte_id,
            ),
        )
        informe_id = cur.lastrowid

        cur.execute(
            """INSERT INTO respuestas
               (id_persona, id_encuesta_asignatura, id_informe_asignatura,
                id_informe_sintetico_carrera)
               VALUES (?,NULL,?,NULL)""",
            (DOCENTE_ID, informe_id),
        )
        resp_docente_id = cur.lastrowid
        cur.execute(
            "UPDATE informes_asignaturas SET id_respuesta=? WHERE id=?",
            (resp_docente_id, informe_id),
        )

        textos = {
            32: "Se requiere actualización del laboratorio y bibliografía específica de ingeniería de software.",
            33: f"Se dictó el 95% de las horas teóricas y el 100% de las prácticas previstas para {year}.",
            34: "Se desarrolló el 100% de los contenidos planificados. Se incorporaron casos prácticos adicionales.",
            35: "Los resultados de las encuestas muestran una valoración general positiva y sostenida en el tiempo.",
            36: random.choice(INTRO_INFORME),
            37: "El equipo participó en jornadas de capacitación docente y en proyectos de extensión de la facultad.",
            38: "La valoración del desempeño de los auxiliares es MB, por su compromiso y acompañamiento a los estudiantes.",
        }
        for pregunta_id, po_id in informe_po.items():
            cur.execute(
                """INSERT INTO detalles_respuestas
                   (id_pregunta_opcion, id_respuesta, texto_respuesta_abierta)
                   VALUES (?,?,?)""",
                (po_id, resp_docente_id, textos.get(pregunta_id, "Sin observaciones.")),
            )

        conn.commit()
        promedio = round(sum(puntajes) / len(puntajes) * 100, 1) if puntajes else 0
        resumen.append((year, cant, base_id, ea_id, reporte_id, informe_id, promedio))
        print(f"  {year}: {cant} respuestas | encuesta={ea_id} | reporte={reporte_id} "
              f"| informe={informe_id} | score promedio={promedio}%")

    # ------------------------------------------------------------------
    # 6) Verificación
    # ------------------------------------------------------------------
    print("\n=== VERIFICACIÓN ===")
    for year, cant, base_id, ea_id, reporte_id, informe_id, promedio in resumen:
        n = one("SELECT COUNT(*) n FROM respuestas WHERE id_encuesta_asignatura=?", (ea_id,))["n"]
        d = one(
            """SELECT COUNT(*) n FROM detalles_respuestas d
               JOIN respuestas r ON r.id=d.id_respuesta
               WHERE r.id_encuesta_asignatura=?""",
            (ea_id,),
        )["n"]
        print(f"  {year}: respuestas={n} (esperado {cant}), detalles={d}, score={promedio}%")

    n_ia = one(
        """SELECT COUNT(*) n FROM detalles_respuestas d
           JOIN respuestas r ON r.id=d.id_respuesta
           JOIN pregunta_opcion po ON po.id=d.id_pregunta_opcion
           WHERE r.id_encuesta_asignatura=?
             AND po.id_pregunta IN (109,110,111)""",
        (resumen[-1][3],),
    )["n"]
    print(f"  Respuestas a preguntas de IA (2029): {n_ia} (esperado {YEARS[2029]*3})")

    inf = one(
        "SELECT COUNT(*) n FROM informes_asignaturas WHERE docente=? AND id_asignatura=?",
        (docente_full, asig_id),
    )["n"]
    print(f"  Informes curriculares respondidos del docente: {inf}")

    conn.close()
    print("\n=== LISTO ===")
    print(f"Docente demo: DNI 99999999 / contraseña demo123  ({docente_full})")
    print(f"Asignatura: {ASIG_NOMBRE} (id={asig_id})")


if __name__ == "__main__":
    main()
