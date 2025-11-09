import sqlite3 #mio (kuky)
import os
from datetime import date #para InformeAsignatura

DB_NAME = "mi-db-sqlite.db"

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

    for nombre, sede in carreras:
        cursor.execute("""
            INSERT INTO carreras (nombre, sede)
            VALUES (?, ?)
        """, (nombre, sede))

    # 📘 Insertar asignatura
    cursor.execute("""
        INSERT INTO asignaturas (nombre, año, nombre_docente, cursado, sede, id_carrera)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        "Desarrollo de Software", 3, "Leo Ordinez y Bruno Pazos",
        "cuatrimestre2", "Trelew", 1
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

    # --- 🗣️ SECCIÓN AÑADIDA PARA RESPUESTA ---
    # Asumimos que la Persona 1 (id=1) responde la EncuestaAsignatura 1 (id=1)
    cursor.execute("""
        INSERT INTO respuestas (id_persona, id_encuesta_asignatura)
        VALUES (?, ?)
    """, (
        1, # id_persona
        1  # id_encuesta_asignatura
    ))
    respuesta_id = cursor.lastrowid # Guardamos el ID de la respuesta (será 1)


    # --- ✍️ SECCIÓN DE DETALLES DE RESPUESTA (COMPLETA) ---
    # (id_pregunta_opcion, id_respuesta, texto_abierto)
    # Respondemos a las 31 preguntas obligatorias
    detalles_a_insertar = [
        # A (Se elige la primera opción de cada pregunta)
        (1, respuesta_id, None),  # Q1: Si
        (3, respuesta_id, None),  # Q2: Una
        (5, respuesta_id, None),  # Q3: Entre 0 y 50%
        (7, respuesta_id, None),  # Q4: Entre 0 y 50%
        (9, respuesta_id, None),  # Q5: Escasos
        # B
        (11, respuesta_id, None), # Q6: Si
        (14, respuesta_id, None), # Q7: Si
        (17, respuesta_id, None), # Q8: Si
        # C
        (20, respuesta_id, None), # Q9: Si
        (23, respuesta_id, None), # Q10: Si
        (26, respuesta_id, None), # Q11: Si
        # D
        (29, respuesta_id, None), # Q12: Si
        (32, respuesta_id, None), # Q13: Si
        (35, respuesta_id, None), # Q14: Si
        # E
        (38, respuesta_id, None), # Q15: Si
        (41, respuesta_id, None), # Q16: Si
        (44, respuesta_id, None), # Q17: Si
        (47, respuesta_id, None), # Q18: Si
        (50, respuesta_id, None), # Q19: Si
        (53, respuesta_id, None), # Q20: Si
        # F
        (56, respuesta_id, None), # Q21: Si
        (59, respuesta_id, None), # Q22: Si
        (62, respuesta_id, None), # Q23: Si
        (65, respuesta_id, None), # Q24: Si
        (68, respuesta_id, None), # Q25: Si
        (71, respuesta_id, None), # Q26: Si
        # G (Cerrada)
        (74, respuesta_id, None), # Q27: 1
        # G (Abiertas)
        (78, respuesta_id, "Muy buenas clases prácticas, excelente predisposición."), # Q28
        (79, respuesta_id, "La parte teórica podría ser más ágil."), # Q29
        (80, respuesta_id, "Que repase los temas de la unidad 1 antes de empezar."), # Q30
        (81, respuesta_id, "Respondí NPO en la biblioteca porque nunca la usé.")  # Q31
    ]

    for id_po, id_resp, texto in detalles_a_insertar:
        cursor.execute("""
            INSERT INTO detalles_respuestas (id_pregunta_opcion, id_respuesta, texto_respuesta_abierta)
            VALUES (?, ?, ?)
        """, (id_po, id_resp, texto))

    # --- 📊REPORTE ---
    # reporte para la EncuestaAsignatura 1 (id=1)
    cursor.execute("""
        INSERT INTO reportes (id_encuesta_asignatura)
        VALUES (?)
    """, (1,)) # id_encuesta_asignatura = 1


    # --- 📜 INFORMES_CURRICULARES_BASE Y SUS PREGUNTAS ---
    cursor.execute("""
        INSERT INTO informes_curriculares_base (titulo)
        VALUES (?)
    """, ("Informe Docente Ciclo 2025",))
    informes_curriculares_base_id = cursor.lastrowid # (ID será 1)

    preguntas_informe_curricular = [
        (
            "Indique en el caso que corresponda, las necesidades de equipamiento y actualización de bibliografía que considere prioritarias para su actuación docente. Asimismo, en caso de corresponder, indique los insumos básicos necesarios para el desarrollo de actividades prácticas, renovación o incorporación de equipamientos informáticos requeridos para el desarrollo de clases.",
            "open", True, None, informes_curriculares_base_id, None
        ),
        (
            "Consigne el porcentaje de horas de clases (teóricas y prácticas) dictadas respecto del total establecido en el plan de estudios y si es necesario justifique.",
            "open", True, None, informes_curriculares_base_id, None
        ),
        (
            "2-A- ¿Se logró desarrollar la totalidad de los contenidos planificados? Consigne el porcentaje de contenidos planificados alcanzados. En caso de ser necesario mencione las estrategias que planificará para el próximo dictado a fin de ajustar el cronograma.",
            "open", True, None, informes_curriculares_base_id, None
        ),
        (
            "2-B- Consigne los valores que figuran en el reporte de la Encuesta a alumnos correspondientes a: B: “Comunicación y desarrollo de la asignatura”, C: “Metodología”, D “ Evaluación”, E “Actuación de los miembros de la Cátedra”. Emita un juicio de valor en el caso que lo considere oportuno.",
            "open", True, None, informes_curriculares_base_id, None
        ),
        (
            "2.C. ¿Cuáles fueron los principales aspectos positivos y los obstáculos que se manifestaron durante el desarrollo del espacio curricular? Centrándose específicamente en los procesos de enseñanza y/o aprendizaje",
            "open", True, None, informes_curriculares_base_id, None
        )
    ]

    print("Creando preguntas de Informe Base y sus 'pregunta_opcion' nulas...")

    # Insertamos las preguntas del INFORME (IDs 32-36)
    # Y creamos su 'pregunta_opcion' nula
    for texto, tipo, obligatoria, id_var, id_icb, id_isb in preguntas_informe_curricular:
        # 1. Insertar la pregunta
        cursor.execute("""
            INSERT INTO preguntas (texto_pregunta, tipo, obligatoria, id_variable, id_informe_curricular_base, id_informe_sintetico_base)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (texto, tipo, obligatoria, id_var, id_icb, id_isb))
        
        # 2. Obtener el ID de la pregunta que acabamos de crear (serán 32, 33, 34, 35, 36)
        pregunta_id_nueva = cursor.lastrowid 

        # 3. Crear su entrada en 'pregunta_opcion' con 'id_opcion_respuesta' = NULL
        # (Estas serán las 'pregunta_opcion' IDs 82, 83, 84, 85, 86)
        cursor.execute("""
            INSERT INTO pregunta_opcion (id_pregunta, id_opcion_respuesta)
            VALUES (?, ?)
        """, (pregunta_id_nueva, None))
            
    print("Preguntas de Informe Curricular Base y sus 'pregunta_opcion' creadas.")



    # --- 📜 INFORMES_SINTETICOS_BASE Y SUS PREGUNTAS ---
    cursor.execute("""
        INSERT INTO informes_sinteticos_base (titulo)
        VALUES (?)
    """, ("Informe Sintetico Ciclo 2025",))
    informes_sinteticos_base_id = cursor.lastrowid # (ID será 1)

    preguntas_informe_sintetico = [
        (
            "0. Información general",
            "open", True, None, None, informes_sinteticos_base_id
        ),
        (
            "1. Necesidades de equipamiento y bibliografía. En el siguiente cuadro, informar sobre la necesidad de actualización de bibliografía (hasta dos títulos por actividad curricular). De corresponder, indicar los insumos básicos necesarios para el desarrollo de actividades prácticas, renovación o incorporación de equipamiento informático, requerimientos de nuevos equipos para el desarrollo de clases, etc.",
            "open", True, None, None, informes_sinteticos_base_id
        ),
        (
            "2. Consigne el porcentaje de horas de clases (teóricas y prácticas) dictadas respecto del total establecido en el plan de estudios y si es necesario justifique.",
            "open", True, None, None, informes_sinteticos_base_id
        ),
        (
            "2.A. Consigne el porcentaje de contenidos planificados alcanzados por cada espacio curricular. Mencione en caso de corresponder, las estrategias propuestas por el equipo de cátedra para el próximo dictado a fin de ajustar el cronograma.", "open", True, None, None, informes_sinteticos_base_id
        ),
        (
            "2.C. Complete los aspectos positivos, obstáculos y de mencionarse en el Informe de Actividad Curricular, las estrategias a implementar en el proceso de enseñanza y/o del proceso de aprendizaje de cada espacio curricular." ,
            "open", True, None, None, informes_sinteticos_base_id
        ),
        (
            "3. Señale con una cruz si ha desarrollado actividades de Capacitación, Investigación, Extensión y Gestión en el ámbito de la Facultad de Ingeniería por cada uno los integrantes de la cátedra (Profesor Responsable, Profesores, JTP y Auxiliares) en el periodo evaluado. Explicite las observaciones y comentarios que considere pertinentes.",
            "open", True, None, None, informes_sinteticos_base_id
        ),
        (
            "4.- Señale con una cruz las valoraciones del desempeño de los auxiliares de cátedra consignadas en el informe de actividad curricular. Indique la justificación informada de la valoración." ,
            "open", True, None, None, informes_sinteticos_base_id
        ),
        (
            "5.- Observaciones o comentarios que desee expresar la Comisión Asesora en relación al conjunto de actividades desarrolladas por los docentes de los diferentes espacios curriculares. a) La cobertura lograda en las asignaturas y la percepción de logros alcanzados en el proceso de aprendizaje se considera muy buena. b) Las encuestas de alumnos han arrojado resultados tendientes a Bueno - Muy Bueno (Satisfactorio – Muy Satisfactorio), de todas maneras hay aspectos mejorables que han sido detectados por las cátedras en los informes y para los cuales la mayoría propone estrategias alternativas para abordar los problemas. c) Es URGENTE que se designe a un JTP para la asignatura Análisis y Diseño de Sistemas. c) Las calificaciones de los auxiliares se consideran muy buenas en general. d) Se deja constancia que solo una minoría de docentes no realizan actividades diferentes a la docencia. e) El 64% de los docentes del Departamento ha realizado tareas de capacitación. Se considera un muy buen porcentaje pero ha disminuido con respecto al año anterior, El 84% de los docentes ha participado de proyectos de investigación durante 2018/2019, y es un porcentaje que se considera muy bueno teniendo en cuenta que hay muy pocas dedicaciones exclusivas o semi-exclusivas. Hubo un incremento con respecto al año anterior. El 48% ha realizado actividades de extensión. Respecto de tareas de gestión, el 36% ha realizado tareas genuinas ocupando cargos en la Facultad o integrando comisiones. Cabe aclarar que este análisis solo se realiza sobre los docentes que dictaron las materias en el primer cuatrimestre. f) Se sugiere agregar al Informe Anual de cátedra, que se informe la cantidad de horas dedicadas a capacitación, investigación, extensión y gestión." ,
            "open", True, None, None, informes_sinteticos_base_id
        )
    ]

    print("Creando preguntas de Informe Sintetico Base y sus 'pregunta_opcion' nulas...")

    # Insertamos las preguntas del INFORME SINTETICO
    # Y creamos su 'pregunta_opcion' nula
    for texto, tipo, obligatoria, id_var, id_icb, id_isb in preguntas_informe_sintetico:
        # 1. Insertar la pregunta
        cursor.execute("""
            INSERT INTO preguntas (texto_pregunta, tipo, obligatoria, id_variable, id_informe_curricular_base, id_informe_sintetico_base)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (texto, tipo, obligatoria, id_var, id_icb, id_isb))
        
        # 2. Obtener el ID de la pregunta que acabamos de crear
        pregunta_id_nueva = cursor.lastrowid 

        # 3. Crear su entrada en 'pregunta_opcion' con 'id_opcion_respuesta' = NULL
        cursor.execute("""
            INSERT INTO pregunta_opcion (id_pregunta, id_opcion_respuesta)
            VALUES (?, ?)
        """, (pregunta_id_nueva, None))
            
    print("Preguntas de Informe Sintético Base y sus 'pregunta_opcion' creadas.")

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
