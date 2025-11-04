import sqlite3
import os
from datetime import date

# --- Configuración ---
DB_NAME = "database.db"

# Conectarse a la base de datos
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

    # 1. Añadir Carrera
    cursor.execute("""
        INSERT INTO carreras (id, nombre, sede) VALUES (?, ?, ?)
    """, (1, "Analista Programador / Lic. En Sistemas", "Trelew"))
    carrera_id = 1
    print(f"  [OK] Insertada Carrera ID: {carrera_id}")

    # 2. Añadir Asignaturas (DOS)
    cursor.execute("""
        INSERT INTO asignaturas (id, nombre, año, nombre_docente, cursado, sede, id_carrera)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        1, "Desarrollo de Software", 3, "Leo Ordoñez y Bruno Pazos",
        "cuatrimestre2", "Trelew", carrera_id
    ))
    asignatura_id_1 = 1
    
    cursor.execute("""
        INSERT INTO asignaturas (id, nombre, año, nombre_docente, cursado, sede, id_carrera)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        2, "Bases de Datos", 2, "Docente de BD",
        "cuatrimestre1", "Trelew", carrera_id
    ))
    asignatura_id_2 = 2
    print(f"  [OK] Insertadas 2 Asignaturas (IDs: 1 y 2)")

    # 📋 Insertar encuesta base
    cursor.execute("""
    INSERT INTO encuestas_base (id, nombre, ciclo)
    VALUES (?, ?, ?)
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

    # ❓ Preguntas de Encuesta Alumno (IDs 1-31)
    # (Quitada la columna 'codigo' del INSERT)
    preguntas_encuesta = [
        # A (IDs 1-5)
        (1, "¿Asiste a clase?", "single_choice", True, vars_dict["A"], None),
        (2, "¿Cuántas veces te has inscripto...?", "single_choice", True, vars_dict["A"], None),
        (3, "¿Cuál ha sido... porcentaje de asistencia a teóricas?", "single_choice", True, vars_dict["A"], None),
        (4, "¿Cuál ha sido... porcentaje de asistencia a prácticas?", "single_choice", True, vars_dict["A"], None),
        (5, "Los conocimientos previos... fueron", "single_choice", True, vars_dict["A"], None),
        # B (IDs 6-8)
        (6, "¿El profesor brindó al inicio del curso información...?", "single_choice", True, vars_dict["B"], None),
        (7, "¿La bibliografía propuesta... estuvo disponible...?", "single_choice", True, vars_dict["B"], None),
        (8, "¿El profesor ofreció la posibilidad de establecer una buena comunicación...?", "single_choice", True, vars_dict["B"], None),
        # C (IDs 9-11)
        (9, "¿Se propusieron clases de apoyo y consulta?", "single_choice", True, vars_dict["C"], None),
        (10, "¿Los contenidos desarrollados en... teóricas se correspondieron con... prácticos?", "single_choice", True, vars_dict["C"], None),
        (11, "¿Las clases prácticas de laboratorio te resultaron de utilidad?", "single_choice", True, vars_dict["C"], None),
        # D (IDs 12-14)
        (12, "¿Hubo relación entre... teóricas y prácticas?", "single_choice", True, vars_dict["D"], None),
        (13, "¿Existió relación entre los temas desarrollados... y los temas evaluados?", "single_choice", True, vars_dict["D"], None),
        (14, "¿Te brindaron posibilidades para comentar y revisar los resultados...?", "single_choice", True, vars_dict["D"], None),
        # E (IDs 15-20)
        (15, "¿Se respetó la planificación de actividades programadas?", "single_choice", True, vars_dict["E"], None),
        (16, "¿Los profesores asisten con puntualidad...?", "single_choice", True, vars_dict["E"], None),
        (17, "¿Da a la asignatura un enfoque aplicado...?", "single_choice", True, vars_dict["E"], None),
        (18, "¿Los recursos didácticos utilizados te facilitaron el aprendizaje?", "single_choice", True, vars_dict["E"], None),
        (19, "¿Los profesores te ofrecen la posibilidad de plantear tus dudas...?", "single_choice", True, vars_dict["E"], None),
        (20, "¿Los docentes explican con claridad los temas...?", "single_choice", True, vars_dict["E"], None),
        # F (IDs 21-26)
        (21, "¿El personal administrativo... respondió a tus requerimientos?", "single_choice", True, vars_dict["F"], None),
        (22, "¿El personal administrativo... respondió cordialmente...?", "single_choice", True, vars_dict["F"], None),
        (23, "¿El servicio de Biblioteca... es adecuado...?", "single_choice", True, vars_dict["F"], None),
        (24, "¿El Sistema Sui Guaraní te facilitó...?", "single_choice", True, vars_dict["F"], None),
        (25, "¿Considerás que son adecuadas las aulas...?", "single_choice", True, vars_dict["F"], None),
        (26, "¿Te parecen suficientes los recursos informáticos...?", "single_choice", True, vars_dict["F"], None),
        # G (IDs 27-31)
        (27, "En general ¿cómo evaluás tu experiencia en esta asignatura?", "single_choice", True, vars_dict["G"], None),
        (28, "¿Qué aspectos valorás como positivos...?", "open", True, vars_dict["G"], None),
        (29, "¿Qué aspectos considerás que se pueden mejorar...?", "open", True, vars_dict["G"], None),
        (30, "¿Qué recomendaciones le harías a un compañero...?", "open", True, vars_dict["G"], None),
        (31, "Si en la pregunta respondiste 'no puedo opinar'...", "open", True, vars_dict["G"], None)
    ]
    cursor.executemany("INSERT INTO preguntas (id, texto_pregunta, tipo, obligatoria, id_variable, id_informe_base) VALUES (?, ?, ?, ?, ?, ?)", preguntas_encuesta)
    print(f"  [OK] Insertadas {len(preguntas_encuesta)} preguntas de Encuesta Alumno.")

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

    # ---------------------------------------------------------------
    # --- ECOSISTEMA DE ASIGNATURA 1 (Desarrollo de Software) ---
    # ---------------------------------------------------------------
    
    # Encuesta Asignatura 1
    cursor.execute("""
        INSERT INTO encuestas_asignaturas (id, id_encuesta_base, id_asignatura, fecha_inicio, fecha_fin, estado)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (1, encuesta_id, asignatura_id_1, '2025-11-01', '2025-11-30', 'abierta'))
    ea_id_1 = 1
    
    # Reporte 1
    cursor.execute("INSERT INTO reportes (id, id_encuesta_asignatura) VALUES (?, ?)", (1, ea_id_1))
    reporte_id_1 = 1
    
    # Respuesta Alumno 1
    cursor.execute("INSERT INTO respuestas (id, id_persona, id_encuesta_asignatura, id_informe_asignatura) VALUES (?, ?, ?, ?)", (1, persona_id, ea_id_1, None))
    resp_alumno_id_1 = 1
    
    # Detalles Alumno 1 (Tu lista completa)
    detalles_a_insertar = [
        (1, resp_alumno_id_1, None), (3, resp_alumno_id_1, None), (5, resp_alumno_id_1, None),
        (7, resp_alumno_id_1, None), (9, resp_alumno_id_1, None), (11, resp_alumno_id_1, None),
        (14, resp_alumno_id_1, None), (17, resp_alumno_id_1, None), (20, resp_alumno_id_1, None),
        (23, resp_alumno_id_1, None), (26, resp_alumno_id_1, None), (29, resp_alumno_id_1, None),
        (32, resp_alumno_id_1, None), (35, resp_alumno_id_1, None), (38, resp_alumno_id_1, None),
        (41, resp_alumno_id_1, None), (44, resp_alumno_id_1, None), (47, resp_alumno_id_1, None),
        (50, resp_alumno_id_1, None), (53, resp_alumno_id_1, None), (56, resp_alumno_id_1, None),
        (59, resp_alumno_id_1, None), (62, resp_alumno_id_1, None), (65, resp_alumno_id_1, None),
        (68, resp_alumno_id_1, None), (71, resp_alumno_id_1, None), (74, resp_alumno_id_1, None),
        (78, resp_alumno_id_1, "Muy buenas clases prácticas, excelente predisposición."),
        (79, resp_alumno_id_1, "La parte teórica podría ser más ágil."),
        (80, resp_alumno_id_1, "Que repase los temas de la unidad 1 antes de empezar."),
        (81, resp_alumno_id_1, "Respondí NPO en la biblioteca porque nunca la usé.")
    ]
    cursor.executemany("INSERT INTO detalles_respuestas (id_pregunta_opcion, id_respuesta, texto_respuesta_abierta) VALUES (?, ?, ?)", detalles_a_insertar)
    print(f"  [OK] Creado Ecosistema (Encuesta, Reporte, Respuesta) para Asignatura 1 (ID: {asignatura_id_1})")

    # ---------------------------------------------------------------
    # --- ECOSISTEMA DE ASIGNATURA 2 (Bases de Datos) ---
    # ---------------------------------------------------------------
    
    # Encuesta Asignatura 2
    cursor.execute("""
        INSERT INTO encuestas_asignaturas (id, id_encuesta_base, id_asignatura, fecha_inicio, fecha_fin, estado)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (2, encuesta_id, asignatura_id_2, '2025-11-01', '2025-11-30', 'abierta'))
    ea_id_2 = 2
    
    # Reporte 2
    cursor.execute("INSERT INTO reportes (id, id_encuesta_asignatura) VALUES (?, ?)", (2, ea_id_2))
    reporte_id_2 = 2
    
    # Respuesta Alumno 2
    cursor.execute("INSERT INTO respuestas (id, id_persona, id_encuesta_asignatura, id_informe_asignatura) VALUES (?, ?, ?, ?)", (2, persona_id, ea_id_2, None))
    resp_alumno_id_2 = 2
    
    # Detalles Alumno 2 (Copiamos algunas respuestas de ejemplo)
    detalles_alumno_2 = [
        (1, resp_alumno_id_2, None), # P1: Si
        (3, resp_alumno_id_2, None), # P2: Una
        (78, resp_alumno_id_2, "Muy buena la práctica de SQL.") # P28: Abierta
    ]
    cursor.executemany("INSERT INTO detalles_respuestas (id_pregunta_opcion, id_respuesta, texto_respuesta_abierta) VALUES (?, ?, ?)", detalles_alumno_2)
    print(f"  [OK] Creado Ecosistema (Encuesta, Reporte, Respuesta) para Asignatura 2 (ID: {asignatura_id_2})")


    # ---------------------------------------------------------------
    # --- SECCIÓN INFORMES (Moldes) ---
    # ---------------------------------------------------------------

    # --- Molde Docente ---
    cursor.execute("INSERT INTO informes_base (id, titulo) VALUES (?, ?)", (1, "Informe Docente Ciclo 2025"))
    informe_base_id = 1
    print(f"  [OK] Insertado InformeBase (Molde Docente) ID: {informe_base_id}")

    # Preguntas de Informe Docente (IDs 32-36)
    # (Quitada la columna 'codigo' del INSERT)
    preguntas_informe = [
        (32, "Indique en el caso que corresponda, las necesidades de equipamiento...", "open", True, informe_base_id, None),
        (33, "Consigne el porcentaje de horas de clases...", "open", True, informe_base_id, None),
        (34, "2-A- ¿Se logró desarrollar la totalidad de los contenidos...", "open", True, informe_base_id, None),
        (35, "2-B- Consigne los valores que figuran en el reporte de la Encuesta...", "open", True, informe_base_id, None),
        (36, "2.C. ¿Cuáles fueron los principales aspectos positivos...", "open", True, informe_base_id, None)
    ]
    
    po_informe_ids_nulas = [] # (Guardará IDs 82-86)
    for id, texto, tipo, oblig, id_ib, id_var in preguntas_informe:
        cursor.execute(
            "INSERT INTO preguntas (id, texto_pregunta, tipo, obligatoria, id_informe_base, id_variable) VALUES (?, ?, ?, ?, ?, ?)",
            (id, texto, tipo, oblig, id_ib, id_var)
        )
        cursor.execute("INSERT INTO pregunta_opcion (id_pregunta, id_opcion_respuesta) VALUES (?, ?)", (id, None))
        po_informe_ids_nulas.append(cursor.lastrowid)
    print(f"  [OK] Insertadas {len(preguntas_informe)} preguntas (Informe Docente).")
    
    # --- Molde Depto ---
    cursor.execute("""
        INSERT INTO informes_sinteticos (id, titulo, comision_asesora, sede, integrantes)
        VALUES (?, ?, ?, ?, ?)
    """, (1, "Informe Sintético General 2025", "Comisión Central", "Rectorado", 5))
    informe_sintetico_base_id = 1
    print(f"  [OK] Insertado InformeSintetico (Molde Depto) ID: {informe_sintetico_base_id}")

    # --- Padre ---
    cursor.execute("""
        INSERT INTO informes_sinteticos_carreras (id, id_carrera, id_informe_sintetico, ciclo_lectivo, comision_asesora, sede, integrantes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (1, carrera_id, informe_sintetico_base_id, "2025", "Comisión APU", "Trelew", "Decano, Secretarios"))
    informe_sintetico_carrera_id = 1
    print(f"  [OK] Insertado InformeSinteticoCarrera (Padre) ID: {informe_sintetico_carrera_id}")


    # ---------------------------------------------------------------
    # --- VINCULACIÓN DE "HIJOS" AL "PADRE" ---
    # ---------------------------------------------------------------

    # 📄 Hijo 1 (Desarrollo de Software)
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
        asignatura_id_1,       # Asignatura 1
        reporte_id_1,          # Reporte 1
        informe_sintetico_carrera_id # Vínculo al Padre (ID 1)
    ))
    informe_asignatura_id_1 = 1
    
    # Respuesta Docente 1
    cursor.execute("INSERT INTO respuestas (id, id_persona, id_informe_asignatura) VALUES (?, ?, ?)", (3, persona_id, informe_asignatura_id_1))
    respuesta_docente_id_1 = 3
    # Detalles Docente 1 (Usando los IDs de po_informe_ids_nulas: 82-86)
    detalles_docente_1 = [
        (po_informe_ids_nulas[0], respuesta_docente_id_1, "Se necesitan 5 computadoras nuevas."),
        (po_informe_ids_nulas[1], respuesta_docente_id_1, "Se dictó el 95% de las horas."),
        (po_informe_ids_nulas[2], respuesta_docente_id_1, "Se logró el 100% de los contenidos."),
        (po_informe_ids_nulas[3], respuesta_docente_id_1, "Los alumnos valoraron B=3.5, C=4.0, D=3.8, E=4.2."),
        (po_informe_ids_nulas[4], respuesta_docente_id_1, "El principal obstáculo fue el bajo nivel...")
    ]
    cursor.executemany("INSERT INTO detalles_respuestas (id_pregunta_opcion, id_respuesta, texto_respuesta_abierta) VALUES (?, ?, ?)", detalles_docente_1)
    print(f"  [OK] Insertado InformeAsignatura (Hijo 1) ID: {informe_asignatura_id_1} con sus respuestas.")


    # 📄 Hijo 2 (Bases de Datos)
    cursor.execute("""
        INSERT INTO informes_asignaturas (
            id, sede, ciclo_lectivo, docente, cant_alumnos_insc, cant_comisiones_teoricas, 
            cant_comisiones_practicas, fecha_inicio, fecha_fin, estado, 
            id_informe_base, id_asignatura, id_reporte, id_informe_sintetico_carrera
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        2, "tw", 2025, "Docente de BD", 70, 1, 3, 
        date(2025, 3, 1), date(2025, 6, 30), 'abierto',
        informe_base_id,       # Molde docente (ID 1)
        asignatura_id_2,       # Asignatura 2
        reporte_id_2,          # Reporte 2
        informe_sintetico_carrera_id # Vínculo al Padre (ID 1)
    ))
    informe_asignatura_id_2 = 2
    
    # Respuesta Docente 2
    cursor.execute("INSERT INTO respuestas (id, id_persona, id_informe_asignatura) VALUES (?, ?, ?)", (4, persona_id, informe_asignatura_id_2))
    respuesta_docente_id_2 = 4
    # Detalles Docente 2 (con respuestas diferentes)
    detalles_docente_2 = [
        (po_informe_ids_nulas[0], respuesta_docente_id_2, "El proyector del aula 25 funciona mal."),
        (po_informe_ids_nulas[1], respuesta_docente_id_2, "Se dictó el 100% de las horas."),
        (po_informe_ids_nulas[2], respuesta_docente_id_2, "Se completaron todos los contenidos."),
    ]
    cursor.executemany("INSERT INTO detalles_respuestas (id_pregunta_opcion, id_respuesta, texto_respuesta_abierta) VALUES (?, ?, ?)", detalles_docente_2)
    print(f"  [OK] Insertado InformeAsignatura (Hijo 2) ID: {informe_asignatura_id_2} con sus respuestas.")

    # 💾 Guardar cambios
    conn.commit()
    print("\n✅ Base de datos poblada correctamente con 2 informes de asignatura.")

except sqlite3.Error as e:
    print(f"\n❌ Ocurrió un error de SQLite: {e}")
    print("Revertiendo cambios...")
    conn.rollback() # Revertir cambios si algo falla
finally:
    conn.close()
    print("Conexión cerrada.")