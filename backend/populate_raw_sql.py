import sqlite3
import os
from datetime import date # Importamos 'date' para InformeAsignatura

# --- Configuración ---
DB_NAME = "database.db"

# Conectarse a la base de datos
# ASUME QUE database.db YA EXISTE Y TIENE LAS TABLAS CREADAS POR FASTAPI
if not os.path.exists(DB_NAME):
    print(f"Error: El archivo '{DB_NAME}' no existe.")
    print("Por favor, inicia tu aplicación FastAPI (uvicorn src.main:app)")
    print("para que se cree la base de datos vacía, y luego ejecuta este script.")
    exit()

conn = sqlite3.connect(DB_NAME, timeout=10)
cursor = conn.cursor()

print(f"Conectado a '{DB_NAME}'. Poblando la base de datos...")

try:
    # 👤 Insertar persona de prueba
    cursor.execute("""
        INSERT INTO personas (id, nombre, email)
        VALUES (?, ?, ?)
    """, (1, "PERSONA DE PRUEBA", "prueba@gmail.com"))
    persona_id = 1
    print(f"  [OK] Insertada Persona ID: {persona_id}")

    # --- MODIFICACIÓN 1: Añadir Carrera ---
    # (Necesario para 'asignaturas')
    cursor.execute("""
        INSERT INTO carreras (id, nombre, sede) VALUES (?, ?, ?)
    """, (1, "Analista Programador / Lic. En Sistemas", "Trelew"))
    carrera_id = 1
    print(f"  [OK] Insertada Carrera ID: {carrera_id}")

    # --- MODIFICACIÓN 2: Corregir Asignatura ---
    # (Cambiamos 'carrera' string por 'id_carrera' int)
    cursor.execute("""
        INSERT INTO asignaturas (id, nombre, año, nombre_docente, cursado, sede, id_carrera)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        1, "Desarrollo de Software", 3, "Leo Ordoñez y Bruno Pazos",
        "cuatrimestre2", "Trelew", carrera_id
    ))
    asignatura_id = 1
    print(f"  [OK] Insertada Asignatura ID: {asignatura_id}")


    # 📋 Insertar encuesta base
    cursor.execute("""
        INSERT INTO encuestas_base (id, nombre, ciclo)
        VALUES (?, ?)
    """, (1, "Encuesta-ciclo-básico-V1", "ciclo_basico"))
    encuesta_id = 1
    print(f"  [OK] Insertada EncuestaBase ID: {encuesta_id}")

    # 🧩 Insertar variables
    variables = [
        ("Información general", "A"), ("Comunicación y Desarrollo de la asignatura", "B"),
        ("Metodología", "C"), ("Evaluación", "D"),
        ("Actuación de los miembros de la Cátedra", "E"),
        ("Institucional. Valore", "F"), ("Opinión Global", "G")
    ]
    for nombre, codigo in variables:
        cursor.execute(
            "INSERT INTO variables (nombre, codigo, id_encuesta_base) VALUES (?, ?, ?)",
            (nombre, codigo, encuesta_id)
        )
    vars_dict = {codigo: var_id for var_id, codigo in cursor.execute("SELECT id, codigo FROM variables WHERE id_encuesta_base = ?", (encuesta_id,)).fetchall()}
    print(f"  [OK] Insertadas {len(variables)} variables.")

    # ❓ Preguntas de todas las variables (Encuesta Alumno)
    # (Se insertarán con IDs 1 a 31)
    preguntas = [
        # A (IDs 1-5)
        ("¿Asiste a clase?", "single_choice", True, vars_dict["A"], None),
        ("¿Cuántas veces te has inscripto...?", "single_choice", True, vars_dict["A"], None),
        ("¿Cuál ha sido... porcentaje de asistencia a teóricas?", "single_choice", True, vars_dict["A"], None),
        ("¿Cuál ha sido... porcentaje de asistencia a prácticas?", "single_choice", True, vars_dict["A"], None),
        ("Los conocimientos previos... fueron", "single_choice", True, vars_dict["A"], None),
        # B (IDs 6-8)
        ("¿El profesor brindó al inicio del curso información...?", "single_choice", True, vars_dict["B"], None),
        ("¿La bibliografía propuesta... estuvo disponible...?", "single_choice", True, vars_dict["B"], None),
        ("¿El profesor ofreció la posibilidad de establecer una buena comunicación...?", "single_choice", True, vars_dict["B"], None),
        # C (IDs 9-11)
        ("¿Se propusieron clases de apoyo y consulta?", "single_choice", True, vars_dict["C"], None),
        ("¿Los contenidos desarrollados en... teóricas se correspondieron con... prácticos?", "single_choice", True, vars_dict["C"], None),
        ("¿Las clases prácticas de laboratorio te resultaron de utilidad?", "single_choice", True, vars_dict["C"], None),
        # D (IDs 12-14)
        ("¿Hubo relación entre... teóricas y prácticas?", "single_choice", True, vars_dict["D"], None),
        ("¿Existió relación entre los temas desarrollados... y los temas evaluados?", "single_choice", True, vars_dict["D"], None),
        ("¿Te brindaron posibilidades para comentar y revisar los resultados...?", "single_choice", True, vars_dict["D"], None),
        # E (IDs 15-20)
        ("¿Se respetó la planificación de actividades programadas?", "single_choice", True, vars_dict["E"], None),
        ("¿Los profesores asisten con puntualidad...?", "single_choice", True, vars_dict["E"], None),
        ("¿Da a la asignatura un enfoque aplicado...?", "single_choice", True, vars_dict["E"], None),
        ("¿Los recursos didácticos utilizados te facilitaron el aprendizaje?", "single_choice", True, vars_dict["E"], None),
        ("¿Los profesores te ofrecen la posibilidad de plantear tus dudas...?", "single_choice", True, vars_dict["E"], None),
        ("¿Los docentes explican con claridad los temas...?", "single_choice", True, vars_dict["E"], None),
        # F (IDs 21-26)
        ("¿El personal administrativo... respondió a tus requerimientos?", "single_choice", True, vars_dict["F"], None),
        ("¿El personal administrativo... respondió cordialmente...?", "single_choice", True, vars_dict["F"], None),
        ("¿El servicio de Biblioteca... es adecuado...?", "single_choice", True, vars_dict["F"], None),
        ("¿El Sistema Sui Guaraní te facilitó...?", "single_choice", True, vars_dict["F"], None),
        ("¿Considerás que son adecuadas las aulas...?", "single_choice", True, vars_dict["F"], None),
        ("¿Te parecen suficientes los recursos informáticos...?", "single_choice", True, vars_dict["F"], None),
        # G (IDs 27-31)
        ("En general ¿cómo evaluás tu experiencia en esta asignatura?", "single_choice", True, vars_dict["G"], None),
        ("¿Qué aspectos valorás como positivos...?", "open", True, vars_dict["G"], None),
        ("¿Qué aspectos considerás que se pueden mejorar...?", "open", True, vars_dict["G"], None),
        ("¿Qué recomendaciones le harías a un compañero...?", "open", True, vars_dict["G"], None),
        ("Si en la pregunta respondiste 'no puedo opinar'...", "open", True, vars_dict["G"], None)
    ]
    cursor.executemany("INSERT INTO preguntas (texto_pregunta, tipo, obligatoria, id_variable, id_informe_base) VALUES (?, ?, ?, ?, ?)", preguntas)
    print(f"  [OK] Insertadas {len(preguntas)} preguntas de Encuesta Alumno.")

    # ✅ Insertar opciones únicas de respuesta
    opciones = [
        (1, "Si"), (2, "No"), (3, "Una"), (4, "Más de una"),
        (5, "Entre 0 y 50%"), (6, "Más de 50%"),
        (7, "Escasos"), (8, "Suficientes"), (9, "NPO | No puedo opinar"),
        (10, "1"), (11, "2"), (12, "3"), (13, "4")
    ]
    cursor.executemany("INSERT OR IGNORE INTO opciones_respuestas (id, texto_opcion) VALUES (?, ?)", opciones)
    print(f"  [OK] Insertadas {len(opciones)} opciones de respuesta.")

    # ✅ Insertar relaciones pregunta-opcion (tabla pivote)
    # (Se insertarán con IDs 1 a 81)
    pregunta_opcion = [
        (1, 1, 1), (2, 1, 2), (3, 2, 3), (4, 2, 4), (5, 3, 5), (6, 3, 6), (7, 4, 5), (8, 4, 6),
        (9, 5, 7), (10, 5, 8), (11, 6, 1), (12, 6, 2), (13, 6, 9), (14, 7, 1), (15, 7, 2),
        (16, 7, 9), (17, 8, 1), (18, 8, 2), (19, 8, 9), (20, 9, 1), (21, 9, 2), (22, 9, 9),
        (23, 10, 1), (24, 10, 2), (25, 10, 9), (26, 11, 1), (27, 11, 2), (28, 11, 9),
        (29, 12, 1), (30, 12, 2), (31, 12, 9), (32, 13, 1), (33, 13, 2), (34, 13, 9),
        (35, 14, 1), (36, 14, 2), (37, 14, 9), (38, 15, 1), (39, 15, 2), (40, 15, 9),
        (41, 16, 1), (42, 16, 2), (43, 16, 9), (44, 17, 1), (45, 17, 2), (46, 17, 9),
        (47, 18, 1), (48, 18, 2), (49, 18, 9), (50, 19, 1), (51, 19, 2), (52, 19, 9),
        (53, 20, 1), (54, 20, 2), (55, 20, 9), (56, 21, 1), (57, 21, 2), (58, 21, 9),
        (59, 22, 1), (60, 22, 2), (61, 22, 9), (62, 23, 1), (63, 23, 2), (64, 23, 9),
        (65, 24, 1), (66, 24, 2), (67, 24, 9), (68, 25, 1), (69, 25, 2), (70, 25, 9),
        (71, 26, 1), (72, 26, 2), (73, 26, 9), (74, 27, 10), (75, 27, 11), (76, 27, 12),
        (77, 27, 13), (78, 28, None), (79, 29, None), (80, 30, None), (81, 31, None)
    ]
    cursor.executemany("INSERT INTO pregunta_opcion (id, id_pregunta, id_opcion_respuesta) VALUES (?, ?, ?)", pregunta_opcion)
    print(f"  [OK] Insertadas {len(pregunta_opcion)} relaciones pregunta-opcion (Alumno).")

    # (El resto de tu script original)
    cursor.execute("""
        INSERT INTO encuestas_asignaturas (id, id_encuesta_base, id_asignatura, fecha_inicio, fecha_fin, estado)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (1, encuesta_id, asignatura_id, '2025-11-01', '2025-11-30', 'abierta'))
    encuesta_asignatura_id = 1
    print(f"  [OK] Insertada EncuestaAsignatura ID: {encuesta_asignatura_id}")

    # --- 🗣️ SECCIÓN RESPUESTA (Alumno) ---
    cursor.execute("""
        INSERT INTO respuestas (id, id_persona, id_encuesta_asignatura, id_informe_asignatura)
        VALUES (?, ?, ?, ?)
    """, (1, persona_id, encuesta_asignatura_id, None))
    respuesta_alumno_id = 1
    print(f"  [OK] Insertada Respuesta (Alumno) ID: {respuesta_alumno_id}")

    # --- ✍️ SECCIÓN DE DETALLES DE RESPUESTA (Alumno) ---
    detalles_a_insertar = [
        (1, respuesta_alumno_id, None), (3, respuesta_alumno_id, None), (5, respuesta_alumno_id, None),
        (7, respuesta_alumno_id, None), (9, respuesta_alumno_id, None), (11, respuesta_alumno_id, None),
        (14, respuesta_alumno_id, None), (17, respuesta_alumno_id, None), (20, respuesta_alumno_id, None),
        (23, respuesta_alumno_id, None), (26, respuesta_alumno_id, None), (29, respuesta_alumno_id, None),
        (32, respuesta_alumno_id, None), (35, respuesta_alumno_id, None), (38, respuesta_alumno_id, None),
        (41, respuesta_alumno_id, None), (44, respuesta_alumno_id, None), (47, respuesta_alumno_id, None),
        (50, respuesta_alumno_id, None), (53, respuesta_alumno_id, None), (56, respuesta_alumno_id, None),
        (59, respuesta_alumno_id, None), (62, respuesta_alumno_id, None), (65, respuesta_alumno_id, None),
        (68, respuesta_alumno_id, None), (71, respuesta_alumno_id, None), (74, respuesta_alumno_id, None),
        (78, respuesta_alumno_id, "Muy buenas clases prácticas, excelente predisposición."),
        (79, respuesta_alumno_id, "La parte teórica podría ser más ágil."),
        (80, respuesta_alumno_id, "Que repase los temas de la unidad 1 antes de empezar."),
        (81, respuesta_alumno_id, "Respondí NPO en la biblioteca porque nunca la usé.")
    ]
    cursor.executemany("INSERT INTO detalles_respuestas (id_pregunta_opcion, id_respuesta, texto_respuesta_abierta) VALUES (?, ?, ?)", detalles_a_insertar)
    print(f"  [OK] Insertados {len(detalles_a_insertar)} detalles de respuesta (Alumno).")

    # --- 📊 SECCIÓN REPORTE ---
    cursor.execute("INSERT INTO reportes (id, id_encuesta_asignatura) VALUES (?, ?)", (1, encuesta_asignatura_id))
    reporte_id = 1
    print(f"  [OK] Insertado Reporte ID: {reporte_id}")

    # --- 📜 SECCIÓN INFORME_BASE (Molde Docente) ---
    cursor.execute("INSERT INTO informes_base (id, titulo) VALUES (?, ?)", (1, "Informe Docente Ciclo 2025"))
    informe_base_id = 1
    print(f"  [OK] Insertado InformeBase (Molde Docente) ID: {informe_base_id}")

    preguntas_informe = [
        (32, "Indique en el caso que corresponda, las necesidades de equipamiento...", "open", True, informe_base_id, None, "EQUIPAMIENTO"),
        (33, "Consigne el porcentaje de horas de clases...", "open", True, informe_base_id, None, "HORAS_DICTADAS"),
        (34, "2-A- ¿Se logró desarrollar la totalidad de los contenidos...", "open", True, informe_base_id, None, "CONTENIDOS_ALCANZADOS"),
        (35, "2-B- Consigne los valores que figuran en el reporte de la Encuesta...", "open", True, informe_base_id, None, "VALORES_ENCUESTA"),
        (36, "2.C. ¿Cuáles fueron los principales aspectos positivos...", "open", True, informe_base_id, None, "ASPECTOS_POSITIVOS_OBSTACULOS")
    ]
    
    po_informe_ids_nulas = [] # (Guardará IDs 82, 83, 84, 85, 86)
    for id, texto, tipo, oblig, id_ib, id_var, codigo in preguntas_informe:
        cursor.execute(
            "INSERT INTO preguntas (id, texto_pregunta, tipo, obligatoria, id_informe_base, id_variable, codigo) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (id, texto, tipo, oblig, id_ib, id_var, codigo)
        )
        cursor.execute("INSERT INTO pregunta_opcion (id_pregunta, id_opcion_respuesta) VALUES (?, ?)", (id, None))
        po_informe_ids_nulas.append(cursor.lastrowid)
        
    print(f"  [OK] Insertadas {len(preguntas_informe)} preguntas (Informe Docente) con sus 'pregunta_opcion' nulas.")
    
    # ==========================================================
    # --- 3. SECCIÓN AÑADIDA: JERARQUÍA DE INFORMES SINTÉTICOS ---
    # ==========================================================

    # 🗂️ Insertar InformeSinteticoBase (Molde Depto)
    cursor.execute("""
        INSERT INTO informes_sinteticos (id, titulo, comision_asesora, sede, integrantes)
        VALUES (?, ?, ?, ?, ?)
    """, (1, "Informe Sintético General 2025", "Comisión Central", "Rectorado", 5))
    informe_sintetico_base_id = 1
    print(f"  [OK] Insertado InformeSinteticoBase (Molde Depto) ID: {informe_sintetico_base_id}")

    # 📁 Insertar InformeSinteticoCarrera (el "Padre")
    cursor.execute("""
        INSERT INTO informes_sinteticos_carreras (id, id_carrera, id_informe_sintetico, ciclo_lectivo, comision_asesora, sede, integrantes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (1, carrera_id, informe_sintetico_base_id, "2025", "Comisión APU", "Trelew", "Decano, Secretarios"))
    informe_sintetico_carrera_id = 1
    print(f"  [OK] Insertado InformeSinteticoCarrera (Padre) ID: {informe_sintetico_carrera_id}")

    # 📄 Insertar InformeAsignatura (el "Hijo")
    cursor.execute("""
        INSERT INTO informes_asignaturas (
            id, sede, ciclo_lectivo, docente, cant_alumnos_insc, cant_comisiones_teoricas, 
            cant_comisiones_practicas, fecha_inicio, fecha_fin, estado, 
            id_informe_base, id_asignatura, id_reporte, id_informe_sintetico_carrera
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        1, "tw", 2025, "Leonardo Ordoñez", 50, 1, 2, 
        date(2025, 8, 1), date(2025, 12, 1), 'abierto',
        informe_base_id,       # Molde docente (ID 1)
        asignatura_id,         # Asignatura (ID 1)
        reporte_id,            # Reporte (ID 1)
        informe_sintetico_carrera_id # Vínculo al Padre (ID 1)
    ))
    informe_asignatura_id = 1
    print(f"  [OK] Insertado InformeAsignatura (Hijo) ID: {informe_asignatura_id}")

    # --- 🗣️ SECCIÓN RESPUESTA (Docente) ---
    cursor.execute("""
        INSERT INTO respuestas (id, id_persona, id_encuesta_asignatura, id_informe_asignatura)
        VALUES (?, ?, ?, ?)
    """, (2, persona_id, None, informe_asignatura_id))
    respuesta_docente_id = 2
    print(f"  [OK] Insertada Respuesta (Docente) ID: {respuesta_docente_id}")

    # --- ✍️ SECCIÓN DE DETALLES DE RESPUESTA (Docente) ---
    # (Usamos los IDs de po_informe_ids_nulas: 82, 83, 84, 85, 86)
    detalles_docente = [
        (po_informe_ids_nulas[0], respuesta_docente_id, "Se necesitan 5 computadoras nuevas."),
        (po_informe_ids_nulas[1], respuesta_docente_id, "Se dictó el 95% de las horas."),
        (po_informe_ids_nulas[2], respuesta_docente_id, "Se logró el 100% de los contenidos."),
        (po_informe_ids_nulas[3], respuesta_docente_id, "Los alumnos valoraron B=3.5, C=4.0, D=3.8, E=4.2."),
        (po_informe_ids_nulas[4], respuesta_docente_id, "El principal obstáculo fue el bajo nivel...")
    ]
    cursor.executemany("INSERT INTO detalles_respuestas (id_pregunta_opcion, id_respuesta, texto_respuesta_abierta) VALUES (?, ?, ?)", detalles_docente)
    print(f"  [OK] Insertados {len(detalles_docente)} detalles de respuesta (Docente).")


    # 💾 Guardar cambios
    conn.commit()
    print("\n✅ Base de datos poblada correctamente.")

except sqlite3.Error as e:
    print(f"\n❌ Ocurrió un error de SQLite: {e}")
    print("Revertiendo cambios...")
    conn.rollback() # Revertir cambios si algo falla
finally:
    conn.close()
    print("Conexión cerrada.")