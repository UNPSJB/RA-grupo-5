import sqlite3 #mio (kuky)
import os
from datetime import date # Importamos 'date' para InformeAsignatura

DB_NAME = "mi-db-sqlite.db"

# Conectarse a la base de datos
# ASUME QUE DB_NAME YA EXISTE Y TIENE LAS TABLAS CREADAS POR FASTAPI
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
        INSERT INTO personas (nombre, email)
        VALUES (?, ?)
    """, ("PERSONA DE PRUEBA", "prueba@gmail.com"))

    # 🧾 Insertar carreras (nuevo)
    carreras = [
        ("Analista Programador Universitario", "Trelew"),
        ("Licenciatura en sistemas", "Trelew"),
        ("Analista Ingeniería Civil", "Trelew"),
    ]

    # 2. Corregir Asignatura
    cursor.execute("""
        INSERT INTO asignaturas (nombre, año, nombre_docente, cursado, sede, id_carrera)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        "Desarrollo de Software", 3, "Leo Ordinez y Bruno Pazos",
        "cuatrimestre2", "Trelew", 1
    ))
    asignatura_id = 1
    print(f"  [OK] Insertada Asignatura ID: {asignatura_id}")


    # 📋 Insertar encuesta base
    cursor.execute("""
        INSERT INTO encuestas_base (nombre, ciclo)
        VALUES (?, ?)
    """, (
        "Encuesta-ciclo-básico-V1", "ciclo_basico"
    ))
    encuesta_id = cursor.lastrowid


    # 🧩 Insertar variables
    variables = [
        ("Información general", "A"),
        ("Comunicación y Desarrollo de la asignatura", "B"),
        ("Metodología", "C"),
        ("Evaluación", "D"),
        ("Actuación de los miembros de la Cátedra", "E"),
        ("Institucional. Valore", "F"),
        ("Opinión Global", "G")
    ]

    for nombre, codigo in variables:
        cursor.execute("""
            INSERT INTO variables (nombre, codigo, id_encuesta_base)
            VALUES (?, ?, ?)
        """, (nombre, codigo, encuesta_id))

    # ❓ Preguntas de todas las variables (Encuesta Alumno)
    # (Se insertarán con IDs 1 a 31)
    preguntas = [
        # (texto, tipo, obligatoria, id_variable, id_informe_curricular_base, id_informe_sintetico_base)
        # A (IDs 1-5)
        ("¿Asiste a clase?", "single_choice", True, vars_dict["A"], None, None),
        ("¿Cuántas veces te has inscripto...?", "single_choice", True, vars_dict["A"], None, None),
        ("¿Cuál ha sido... porcentaje de asistencia a teóricas?", "single_choice", True, vars_dict["A"], None, None),
        ("¿Cuál ha sido... porcentaje de asistencia a prácticas?", "single_choice", True, vars_dict["A"], None, None),
        ("Los conocimientos previos... fueron", "single_choice", True, vars_dict["A"], None, None),
        # B (IDs 6-8)
        ("¿El profesor brindó al inicio del curso información...?", "single_choice", True, vars_dict["B"], None, None),
        ("¿La bibliografía propuesta... estuvo disponible...?", "single_choice", True, vars_dict["B"], None, None),
        ("¿El profesor ofreció la posibilidad de establecer una buena comunicación...?", "single_choice", True, vars_dict["B"], None, None),
        # C (IDs 9-11)
        ("¿Se propusieron clases de apoyo y consulta?", "single_choice", True, vars_dict["C"], None, None),
        ("¿Los contenidos desarrollados en... teóricas se correspondieron con... prácticos?", "single_choice", True, vars_dict["C"], None, None),
        ("¿Las clases prácticas de laboratorio te resultaron de utilidad?", "single_choice", True, vars_dict["C"], None, None),
        # D (IDs 12-14)
        ("¿Hubo relación entre... teóricas y prácticas?", "single_choice", True, vars_dict["D"], None, None),
        ("¿Existió relación entre los temas desarrollados... y los temas evaluados?", "single_choice", True, vars_dict["D"], None, None),
        ("¿Te brindaron posibilidades para comentar y revisar los resultados...?", "single_choice", True, vars_dict["D"], None, None),
        # E (IDs 15-20)
        ("¿Se respetó la planificación de actividades programadas?", "single_choice", True, vars_dict["E"], None, None),
        ("¿Los profesores asisten con puntualidad...?", "single_choice", True, vars_dict["E"], None, None),
        ("¿Da a la asignatura un enfoque aplicado...?", "single_choice", True, vars_dict["E"], None, None),
        ("¿Los recursos didácticos utilizados te facilitaron el aprendizaje?", "single_choice", True, vars_dict["E"], None, None),
        ("¿Los profesores te ofrecen la posibilidad de plantear tus dudas...?", "single_choice", True, vars_dict["E"], None, None),
        ("¿Los docentes explican con claridad los temas...?", "single_choice", True, vars_dict["E"], None, None),
        # F (IDs 21-26)
        ("¿El personal administrativo... respondió a tus requerimientos?", "single_choice", True, vars_dict["F"], None, None),
        ("¿El personal administrativo... respondió cordialmente...?", "single_choice", True, vars_dict["F"], None, None),
        ("¿El servicio de Biblioteca... es adecuado...?", "single_choice", True, vars_dict["F"], None, None),
        ("¿El Sistema Sui Guaraní te facilitó...?", "single_choice", True, vars_dict["F"], None, None),
        ("¿Considerás que son adecuadas las aulas...?", "single_choice", True, vars_dict["F"], None, None),
        ("¿Te parecen suficientes los recursos informáticos...?", "single_choice", True, vars_dict["F"], None, None),
        # G (IDs 27-31)
        ("En general ¿cómo evaluás tu experiencia en esta asignatura?", "single_choice", True, vars_dict["G"], None, None),
        ("¿Qué aspectos valorás como positivos...?", "open", True, vars_dict["G"], None, None),
        ("¿Qué aspectos considerás que se pueden mejorar...?", "open", True, vars_dict["G"], None, None),
        ("¿Qué recomendaciones le harías a un compañero...?", "open", True, vars_dict["G"], None, None),
        ("Si en la pregunta respondiste 'no puedo opinar'...", "open", True, vars_dict["G"], None, None)
    ]
    # *** CAMBIO 1: Añadida 'id_informe_sintetico_base' a la consulta ***
    cursor.executemany("INSERT INTO preguntas (texto_pregunta, tipo, obligatoria, id_variable, id_informe_curricular_base, id_informe_sintetico_base) VALUES (?, ?, ?, ?, ?, ?)", preguntas)
    print(f"  [OK] Insertadas {len(preguntas)} preguntas de Encuesta Alumno.")

    for texto, tipo, obligatoria, id_var in preguntas:
        cursor.execute("""
            INSERT INTO preguntas (texto_pregunta, tipo, obligatoria, id_variable)
            VALUES (?, ?, ?, ?)
        """, (texto, tipo, obligatoria, id_var))

    # ✅ Insertar opciones únicas de respuesta (si no están ya cargadas)
    opciones = [
        "Si", "No", "Una", "Más de una",
        "Entre 0 y 50%", "Más de 50%",
        "Escasos", "Suficientes", "NPO | No puedo opinar",
        "1", "2", "3", "4"
    ]

    for texto in opciones:
        cursor.execute("""
            INSERT OR IGNORE INTO opciones_respuestas (texto_opcion)
            VALUES (?)
        """, (texto,))

    # ✅ Insertar relaciones pregunta-opcion (tabla pivote)
    pregunta_opcion = [
        (1, 1), (1, 2),
        (2, 3), (2, 4),
        (3, 5), (3, 6),
        (4, 5), (4, 6),
        (5, 7), (5, 8),
        (6, 1), (6, 2), (6, 9),
        (7, 1), (7, 2), (7, 9),
        (8, 1), (8, 2), (8, 9),
        (9, 1), (9, 2), (9, 9),
        (10, 1), (10, 2), (10, 9),
        (11, 1), (11, 2), (11, 9),
        (12, 1), (12, 2), (12, 9),
        (13, 1), (13, 2), (13, 9),
        (14, 1), (14, 2), (14, 9),
        (15, 1), (15, 2), (15, 9),
        (16, 1), (16, 2), (16, 9),
        (17, 1), (17, 2), (17, 9),
        (18, 1), (18, 2), (18, 9),
        (19, 1), (19, 2), (19, 9),
        (20, 1), (20, 2), (20, 9),
        (21, 1), (21, 2), (21, 9),
        (22, 1), (22, 2), (22, 9),
        (23, 1), (23, 2), (23, 9),
        (24, 1), (24, 2), (24, 9),
        (25, 1), (25, 2), (25, 9),
        (26, 1), (26, 2), (26, 9),
        (27, 10), (27, 11), (27, 12), (27, 13),
        # Preguntas abiertas (sin opciones)
        (28, None),
        (29, None),
        (30, None),
        (31, None)
    ]

    # (El resto de tu script original)
    cursor.execute("""
        INSERT INTO encuestas_asignaturas (id, id_encuesta_base, id_asignatura, fecha_inicio, fecha_fin, estado)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (1, encuesta_id, asignatura_id, '2025-11-01', '2025-11-30', 'abierta'))
    encuesta_asignatura_id = 1
    print(f"  [OK] Insertada EncuestaAsignatura ID: {encuesta_asignatura_id}")

    # --- 🗣️ SECCIÓN RESPUESTA (Alumno) ---
    # *** CAMBIO 2: Añadida 'id_informe_sintetico_carrera' (NULL) ***
    cursor.execute("""
        INSERT INTO respuestas (id, id_persona, id_encuesta_asignatura, id_informe_asignatura, id_informe_sintetico_carrera)
        VALUES (?, ?, ?, ?, ?)
    """, (1, persona_id, encuesta_asignatura_id, None, None))
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

    # --- 📜 SECCIÓN INFORME_CURRICULARES_BASE (Molde Docente) *** ---
    cursor.execute("INSERT INTO informes_curriculares_base (id, titulo) VALUES (?, ?)", (1, "Informe Docente Ciclo 2025"))
    informe_curricular_base_id = 1
    print(f"  [OK] Insertado InformeCurricularesBase (Molde Docente) ID: {informe_curricular_base_id}")

    preguntas_informe = [
    # (Usamos la variable informe_curricular_base_id)
    # *** CAMBIO 3: Añadida 'id_informe_sintetico_base' (NULL) ***
    (32, "Indique en el caso que corresponda, las necesidades de equipamiento...", "open", True, informe_curricular_base_id, None, None),
    (33, "Consigne el porcentaje de horas de clases...", "open", True, informe_curricular_base_id, None, None),
    (34, "2-A- ¿Se logró desarrollar la totalidad de los contenidos...", "open", True, informe_curricular_base_id, None, None),
    (35, "2-B- Consigne los valores que figuran en el reporte de la Encuesta...", "open", False, informe_curricular_base_id, None, None),
    (36, "2.C. ¿Cuáles fueron los principales aspectos positivos...", "open", True, informe_curricular_base_id, None, None),
]
    
    po_informe_ids_nulas = []
    # *** CAMBIO 4: Añadida 'id_informe_sintetico_base' al loop y al INSERT ***
    for id, texto, tipo, oblig, id_icb, id_var, id_isb in preguntas_informe:
        cursor.execute(
            "INSERT INTO preguntas (id, texto_pregunta, tipo, obligatoria, id_informe_curricular_base, id_variable, id_informe_sintetico_base) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (id, texto, tipo, oblig, id_icb, id_var, id_isb)
    )
        cursor.execute("INSERT INTO pregunta_opcion (id_pregunta, id_opcion_respuesta) VALUES (?, ?)", (id, None))
        po_informe_ids_nulas.append(cursor.lastrowid)
        
    print(f"  [OK] Insertadas {len(preguntas_informe)} preguntas (Informe Docente) con sus 'pregunta_opcion' nulas.")
    
    # ==========================================================
    # --- 3. SECCIÓN: JERARQUÍA DE INFORMES SINTÉTICOS ---
    # ==========================================================

    # 🗂️ SECCIÓN InformeSinteticoBase (Molde Depto)
    cursor.execute("""
        INSERT INTO informes_sinteticos_base (id, titulo)
        VALUES (?, ?)
    """, (1, "Informe Sintético General 2025"))
    informe_sintetico_base_id = 1
    print(f"  [OK] Insertado InformeSinteticoBase (Molde Depto) ID: {informe_sintetico_base_id}")

    # --- *** NUEVO BLOQUE (Pregunta para SinteticoBase) *** ---
    po_sintetico_ids_nulas = []
    pregunta_sintetico_texto = """Observaciones o comentarios que desee expresar la Comisión Asesora en relación al
conjunto de actividades desarrolladas por los docentes de los diferentes espacios curriculares.."""
    
    pregunta_sintetico = (
        37, pregunta_sintetico_texto, # ID Pregunta 37
        "open", True, None, None, informe_sintetico_base_id
    )
    cursor.execute(
        "INSERT INTO preguntas (id, texto_pregunta, tipo, obligatoria, id_variable, id_informe_curricular_base, id_informe_sintetico_base) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (pregunta_sintetico[0], pregunta_sintetico[1], pregunta_sintetico[2], pregunta_sintetico[3], pregunta_sintetico[4], pregunta_sintetico[5], pregunta_sintetico[6])
    )
    # Crear su PO nula (ID 87)
    cursor.execute("INSERT INTO pregunta_opcion (id_pregunta, id_opcion_respuesta) VALUES (?, ?)", (pregunta_sintetico[0], None))
    po_sintetico_ids_nulas.append(cursor.lastrowid) # Guardamos el ID 87
    print(f"  [OK] Insertada 1 pregunta (Informe Sintetico) con su 'pregunta_opcion' nula.")
    # --- *** FIN NUEVO BLOQUE *** ---

    
    # --- *** BLOQUE RE-AÑADIDO (InformeSinteticoCarrera) *** ---
    # 📁 Insertar InformeSinteticoCarrera (el "Padre")
    cursor.execute("""
        INSERT INTO informes_sinteticos_carreras (id, id_carrera, id_informe_sintetico_base, ciclo_lectivo, comision_asesora, sede, integrantes, estado, id_respuesta)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (1, carrera_id, informe_sintetico_base_id, "2025", "Comisión APU", "Trelew", "Decano, Secretarios", "abierto", None))
    informe_sintetico_carrera_id = 1
    print(f"  [OK] Insertado InformeSinteticoCarrera (Padre) ID: {informe_sintetico_carrera_id}")
    
    # 📄 *** CAMBIO 5: Insertar InformeAsignatura (el "Hijo") ***
    # (Añadido 'id_respuesta'=NULL, y 'id_informe_sintetico_carrera' AHORA TIENE VALOR)
    cursor.execute("""
        INSERT INTO informes_asignaturas (
            id, sede, ciclo_lectivo, docente, cant_alumnos_insc, cant_comisiones_teoricas, 
            cant_comisiones_practicas, fecha_inicio, fecha_fin, estado, 
            id_informe_curricular_base, id_asignatura, id_reporte, id_informe_sintetico_carrera, id_respuesta
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        1, "tw", 2025, "Leonardo Ordoñez", 50, 1, 2, 
        date(2025, 8, 1), date(2025, 12, 1), 'abierto',
        informe_curricular_base_id, # Molde docente (ID 1)
        asignatura_id,                # Asignatura (ID 1)
        reporte_id,                   # Reporte (ID 1)
        informe_sintetico_carrera_id, # Vínculo al Padre (ID 1)
        None                          # id_respuesta (se actualiza después)
    ))
    informe_asignatura_id = 1
    print(f"  [OK] Insertado InformeAsignatura (Hijo) ID: {informe_asignatura_id}")

    # --- 🗣️ SECCIÓN RESPUESTA (Docente) ---
    # *** CAMBIO 6: Añadida 'id_informe_sintetico_carrera' (NULL) ***
    cursor.execute("""
        INSERT INTO respuestas (id, id_persona, id_encuesta_asignatura, id_informe_asignatura, id_informe_sintetico_carrera)
        VALUES (?, ?, ?, ?, ?)
    """, (2, persona_id, None, informe_asignatura_id, None))
    respuesta_docente_id = 2
    print(f"  [OK] Insertada Respuesta (Docente) ID: {respuesta_docente_id}")
    
    # --- 🔗 *** CAMBIO 7: VINCULAR InformeAsignatura CON Respuesta (Docente) *** ---
    # (Establece la relación 1 a 1)
    cursor.execute("""
        UPDATE informes_asignaturas 
        SET id_respuesta = ? 
        WHERE id = ?
    """, (respuesta_docente_id, informe_asignatura_id))
    print(f"  [OK] Vinculado InformeAsignatura ID {informe_asignatura_id} con Respuesta ID {respuesta_docente_id}.")


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
    print("\n✅ Base de datos poblada correctamente con la nueva estructura.")

except sqlite3.Error as e:
    print(f"\n❌ Ocurrió un error de SQLite: {e}")
    print("Revertiendo cambios...")
    conn.rollback() # Revertir cambios si algo falla
finally:
    conn.close()
    print("Conexión cerrada.")
