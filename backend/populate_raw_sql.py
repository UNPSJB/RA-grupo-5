import sqlite3

# Conectar a la base de datos existente
conn = sqlite3.connect("database.db", timeout=10)
cursor = conn.cursor()

# 👤 Insertar persona de prueba
cursor.execute("""
    INSERT INTO personas (nombre, email)
    VALUES (?, ?)
""", ("PERSONA DE PRUEBA", "prueba@gmail.com"))

# 📘 Insertar asignatura
cursor.execute("""
    INSERT INTO asignaturas (nombre, año, nombre_docente, cursado, carrera, sede)
    VALUES (?, ?, ?, ?, ?, ?)
""", (
    "Desarrollo de Software", 3, "Leo Ordoñez y Bruno Pazos",
    "cuatrimestre2", "Analista Programador / Lic. En Sistemas", "Trelew"
))

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

# Obtener IDs de variables para asociar preguntas
cursor.execute("SELECT id, codigo FROM variables WHERE id_encuesta_base = ?", (encuesta_id,))
vars_dict = {codigo: var_id for var_id, codigo in cursor.fetchall()}

# ❓ Preguntas de todas las variables
preguntas = [
    # A
    ("¿Asiste a clase?", "single_choice", True, vars_dict["A"]),
    ("¿Cuántas veces te has inscripto para cursar esta asignatura?", "single_choice", True, vars_dict["A"]),
    ("¿Cuál ha sido aproximadamente tu porcentaje de asistencia a clases teóricas?", "single_choice", True, vars_dict["A"]),
    ("¿Cuál ha sido aproximadamente tu porcentaje de asistencia a clases prácticas?", "single_choice", True, vars_dict["A"]),
    ("Los conocimientos previos para comprender los contenidos de la asignatura fueron", "single_choice", True, vars_dict["A"]),

    # B
    ("¿El profesor brindó al inicio del curso información referida al desarrollo de la asignatura (programa, cronograma, régimen de cursada y criterios de evaluación)?", "single_choice", True, vars_dict["B"]),
    ("¿La bibliografía propuesta por la cátedra estuvo disponible en la biblioteca o centros de documentación?", "single_choice", True, vars_dict["B"]),
    ("¿El profesor ofreció la posibilidad de establecer una buena comunicación en diferentes aspectos de la vida universitaria?", "single_choice", True, vars_dict["B"]),

    # C
    ("¿Se propusieron clases de apoyo y consulta?", "single_choice", True, vars_dict["C"]),
    ("¿Los contenidos desarrollados en las clases teóricas se correspondieron con los trabajos prácticos?", "single_choice", True, vars_dict["C"]),
    ("¿Las clases prácticas de laboratorio te resultaron de utilidad?", "single_choice", True, vars_dict["C"]),

    # D
    ("¿Hubo relación entre el desarrollo de las clases teóricas y prácticas?", "single_choice", True, vars_dict["D"]),
    ("¿Existió relación entre los temas desarrollados en clase y los temas evaluados?", "single_choice", True, vars_dict["D"]),
    ("¿Te brindaron posibilidades para comentar y revisar los resultados de los exámenes parciales?", "single_choice", True, vars_dict["D"]),

    # E
    ("¿Se respetó la planificación de actividades programadas?", "single_choice", True, vars_dict["E"]),
    ("¿Los profesores asisten con puntualidad en el horario establecido?", "single_choice", True, vars_dict["E"]),
    ("¿Da a la asignatura un enfoque aplicado ofreciendo ejemplos, demostraciones, formas de transferencias a la vida cotidiana y profesional?", "single_choice", True, vars_dict["E"]),
    ("¿Los recursos didácticos utilizados te facilitaron el aprendizaje?", "single_choice", True, vars_dict["E"]),
    ("¿Los profesores te ofrecen la posibilidad de plantear tus dudas y dificultades en clase?", "single_choice", True, vars_dict["E"]),
    ("¿Los docentes explican con claridad los temas desarrollados?", "single_choice", True, vars_dict["E"]),

    # F
    ("¿El personal administrativo de la Facultad respondió a tus requerimientos?", "single_choice", True, vars_dict["F"]),
    ("¿El personal administrativo respondió cordialmente las consultas que realizaste?", "single_choice", True, vars_dict["F"]),
    ("¿El servicio de Biblioteca de la sede es adecuado a tus necesidades?", "single_choice", True, vars_dict["F"]),
    ("¿El Sistema Sui Guaraní te facilitó la realización de trámites administrativos?", "single_choice", True, vars_dict["F"]),
    ("¿Considerás que son adecuadas las aulas y el equipamiento de los laboratorios?", "single_choice", True, vars_dict["F"]),
    ("¿Te parecen suficientes los recursos informáticos que te ofrece la institución (pc, pe con internet, wifi, etc.)?", "single_choice", True, vars_dict["F"]),

    # G
    ("En general ¿cómo evaluás tu experiencia en esta asignatura?", "single_choice", True, vars_dict["G"]),
    ("¿Qué aspectos valorás como positivos del cursado de la asignatura? Menciona los que consideres más importantes", "open", True, vars_dict["G"]),
    ("¿Qué aspectos considerás que se pueden mejorar? Menciona los que consideres más importantes", "open", True, vars_dict["G"]),
    ("¿Qué recomendaciones le harías a un compañero que cursará el año que viene la asignatura?", "open", True, vars_dict["G"]),
    ("Si en la pregunta respondiste 'no puedo opinar' ¿Querés aclarar por qué?", "open", True, vars_dict["G"])
]

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

for id_pregunta, id_opcion_respuesta in pregunta_opcion:
    cursor.execute("""
        INSERT INTO pregunta_opcion (id_pregunta, id_opcion_respuesta)
        VALUES (?, ?)
    """, (id_pregunta, id_opcion_respuesta))


#añado encuesta_asignatura:
cursor.execute("""
    INSERT INTO encuestas_asignaturas (id_encuesta_base, id_asignatura, fecha_inicio, fecha_fin, estado)
    VALUES (?, ?, ?, ?, ?)
""", (
    1,             # id_encuesta_base
    1,             # id_asignatura
    '2025-11-01',  # fecha_inicio (1/11)
    '2025-11-30',  # fecha_fin (30/11)
    'abierta'     # estado
))

# 💾 Guardar cambios
conn.commit()
conn.close()

print("✅ Base de datos cargada correctamente con persona y todas las preguntas.")
