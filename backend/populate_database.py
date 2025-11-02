import sqlite3
import os
from datetime import date

# --- Configuración ---
DB_NAME = "database.db"

# Conectarse a la base de datos
# ASUME QUE database.db YA EXISTE Y TIENE LAS TABLAS CREADAS POR FASTAPI
if not os.path.exists(DB_NAME):
    print(f"Error: El archivo '{DB_NAME}' no existe.")
    print("Por favor, inicia tu aplicación FastAPI primero para que se cree la base de datos.")
    exit()

conn = sqlite3.connect(DB_NAME, timeout=10)
cursor = conn.cursor()

print(f"Conectado a '{DB_NAME}'. Poblando la base de datos...")

try:
    # ==========================================================
    # 1. SETUP INICIAL (Entidades sin dependencias)
    # ==========================================================
    
    # 👤 Insertar Persona
    # (Tu modelo Persona no tiene 'email', pero tu PreguntaOpcion sí.
    # Asumo que Persona SÍ debe tener email, como en tu script viejo)
    cursor.execute("""
        INSERT INTO personas (nombre, email) VALUES (?, ?)
    """, ("Usuario de Prueba", "prueba@unp.edu.ar"))
    persona_id = cursor.lastrowid
    print(f"  [OK] Insertada Persona ID: {persona_id}")

    # 🎓 Insertar Carrera
    cursor.execute("""
        INSERT INTO carreras (nombre, sede) VALUES (?, ?)
    """, ("Analista Programador Universitario", "Trelew"))
    carrera_id = cursor.lastrowid
    print(f"  [OK] Insertada Carrera ID: {carrera_id}")

    # 📚 Insertar Asignatura (depende de Carrera)
    cursor.execute("""
        INSERT INTO asignaturas (nombre, año, nombre_docente, cursado, sede, id_carrera)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        "Desarrollo de Software", 3, "Leonardo Ordoñez",
        "cuatrimestre2", "Trelew", carrera_id
    ))
    asignatura_id = cursor.lastrowid
    print(f"  [OK] Insertada Asignatura ID: {asignatura_id}")

    # 📋 Insertar EncuestaBase (Molde para Alumnos)
    cursor.execute("""
        INSERT INTO encuestas_base (nombre, ciclo)
        VALUES (?, ?)
    """, ("Encuesta Estudiantil 2025 - V1", "ciclo_superior"))
    encuesta_base_id = cursor.lastrowid
    print(f"  [OK] Insertada EncuestaBase ID: {encuesta_base_id}")

    # 🧾 Insertar InformeBase (Molde para Docentes)
    cursor.execute("""
        INSERT INTO informes_base (titulo)
        VALUES (?)
    """, ("Informe Docente Ciclo 2025",))
    informe_base_id = cursor.lastrowid
    print(f"  [OK] Insertado InformeBase ID: {informe_base_id}")

    # 🗂️ Insertar InformeSinteticoBase (Molde para Depto)
    cursor.execute("""
        INSERT INTO informes_sinteticos (titulo, comision_asesora, sede, integrantes)
        VALUES (?, ?, ?, ?)
    """, ("Informe Sintético General 2025", "Comisión Central", "Rectorado", 5))
    informe_sintetico_base_id = cursor.lastrowid
    print(f"  [OK] Insertado InformeSinteticoBase ID: {informe_sintetico_base_id}")

    # 🔘 Insertar Opciones de Respuesta
    opciones = [
        (1, "Si"), (2, "No"), (3, "Una"), (4, "Más de una"),
        (5, "Entre 0 y 50%"), (6, "Más de 50%"),
        (7, "Escasos"), (8, "Suficientes"), (9, "NPO | No puedo opinar"),
        (10, "1"), (11, "2"), (12, "3"), (13, "4")
    ]
    cursor.executemany("INSERT OR IGNORE INTO opciones_respuestas (id, texto_opcion) VALUES (?, ?)", opciones)
    print(f"  [OK] Insertadas {len(opciones)} opciones de respuesta.")

    # ==========================================================
    # 2. SECCIÓN ENCUESTA DE ALUMNOS (Variables, Preguntas)
    # ==========================================================
    
    # 🧩 Insertar Variables
    variables_data = [
        ("Información general", "A", encuesta_base_id),
        ("Comunicación", "B", encuesta_base_id)
    ]
    cursor.executemany("INSERT INTO variables (nombre, codigo, id_encuesta_base) VALUES (?, ?, ?)", variables_data)
    vars_dict = {
        "A": cursor.execute("SELECT id FROM variables WHERE codigo='A'").fetchone()[0],
        "B": cursor.execute("SELECT id FROM variables WHERE codigo='B'").fetchone()[0]
    }
    print(f"  [OK] Insertadas {len(vars_dict)} variables.")

    # ❓ Insertar Preguntas de Encuesta
    preguntas_encuesta = [
        (1, "¿Asiste a clase?", "single_choice", True, vars_dict["A"], None),
        (2, "¿Cuántas veces te has inscripto?", "single_choice", True, vars_dict["A"], None),
        (3, "¿El profesor brindó información clara?", "single_choice", True, vars_dict["B"], None)
    ]
    cursor.executemany(
        "INSERT INTO preguntas (id, texto_pregunta, tipo, obligatoria, id_variable, id_informe_base) VALUES (?, ?, ?, ?, ?, ?)",
        preguntas_encuesta
    )
    print(f"  [OK] Insertadas {len(preguntas_encuesta)} preguntas de encuesta.")

    # 🔗 Insertar PreguntaOpcion (Encuesta)
    po_encuesta_data = [
        (1, 1, 1), (2, 1, 2), # P1: Si/No
        (3, 2, 3), (4, 2, 4), # P2: Una/Más de una
        (5, 3, 1), (6, 3, 2), (7, 3, 9) # P3: Si/No/NPO
    ]
    cursor.executemany("INSERT INTO pregunta_opcion (id, id_pregunta, id_opcion_respuesta) VALUES (?, ?, ?)", po_encuesta_data)
    print(f"  [OK] Insertadas {len(po_encuesta_data)} relaciones pregunta-opcion (Encuesta).")

    # ==========================================================
    # 3. SECCIÓN INFORME DOCENTE (Preguntas)
    # ==========================================================

    # ❓ Insertar Preguntas de Informe
    preguntas_informe = [
        (32, "Necesidades de equipamiento...", "open", True, None, informe_base_id),
        (33, "Porcentaje de horas dictadas...", "open", True, None, informe_base_id),
        (34, "¿Se logró desarrollar la totalidad...", "open", True, None, informe_base_id)
    ]
    po_informe_ids = [] # Guardamos los IDs de pregunta_opcion
    for id, texto, tipo, obligatoria, id_var, id_ib in preguntas_informe:
        cursor.execute(
            "INSERT INTO preguntas (id, texto_pregunta, tipo, obligatoria, id_variable, id_informe_base) VALUES (?, ?, ?, ?, ?, ?)",
            (id, texto, tipo, obligatoria, id_var, id_ib)
        )
        # 🔗 Insertar PreguntaOpcion nula (para preguntas abiertas)
        cursor.execute("INSERT INTO pregunta_opcion (id_pregunta, id_opcion_respuesta) VALUES (?, ?)", (id, None))
        po_informe_ids.append(cursor.lastrowid) # Guardamos el ID (ej. 8, 9, 10)
        
    print(f"  [OK] Insertadas {len(preguntas_informe)} preguntas de informe (abiertas).")
    
    # ==========================================================
    # 4. JERARQUÍA DE EJECUCIÓN (Encuestas, Reportes, Informes)
    # ==========================================================

    # 4.1. Crear la EncuestaAsignatura
    cursor.execute("""
        INSERT INTO encuestas_asignaturas (id_encuesta_base, id_asignatura, fecha_inicio, fecha_fin, estado)
        VALUES (?, ?, ?, ?, ?)
    """, (encuesta_base_id, asignatura_id, date(2025, 10, 1), date(2025, 10, 31), 'abierta'))
    encuesta_asignatura_id = cursor.lastrowid
    print(f"  [OK] Insertada EncuestaAsignatura (para Alumno) ID: {encuesta_asignatura_id}")

    # 4.2. Crear el Reporte
    cursor.execute("INSERT INTO reportes (id_encuesta_asignatura) VALUES (?)", (encuesta_asignatura_id,))
    reporte_id = cursor.lastrowid
    print(f"  [OK] Insertado Reporte ID: {reporte_id}")

    # 4.3. Crear el InformeSinteticoCarrera (el "Padre")
    cursor.execute("""
        INSERT INTO informes_sinteticos_carreras (id_carrera, id_informe_sintetico, ciclo_lectivo, comision_asesora, sede, integrantes)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        carrera_id, informe_sintetico_base_id, "2025", 
        "Comisión APU", "Trelew", "Decano, Secretarios"
    ))
    informe_sintetico_carrera_id = cursor.lastrowid
    print(f"  [OK] Insertado InformeSinteticoCarrera (Padre) ID: {informe_sintetico_carrera_id}")

    # 4.4. Crear el InformeAsignatura (el "Hijo")
    cursor.execute("""
        INSERT INTO informes_asignaturas (
            sede, ciclo_lectivo, docente, cant_alumnos_insc, cant_comisiones_teoricas, 
            cant_comisiones_practicas, fecha_inicio, fecha_fin, estado, 
            id_informe_base, id_asignatura, id_reporte, id_informe_sintetico_carrera
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "tw", 2025, "Leonardo Ordoñez", 50, 1, 2, 
        date(2025, 8, 1), date(2025, 12, 1), 'abierto',
        informe_base_id,
        asignatura_id,
        reporte_id,
        informe_sintetico_carrera_id # Vínculo al Padre
    ))
    informe_asignatura_id = cursor.lastrowid
    print(f"  [OK] Insertado InformeAsignatura (Hijo) ID: {informe_asignatura_id}")

    # ==========================================================
    # 5. RESPUESTAS Y DETALLES (Alumno y Docente)
    # ==========================================================

    # 5.1. Respuesta del ALUMNO (a EncuestaAsignatura)
    cursor.execute("""
        INSERT INTO respuestas (id_persona, id_encuesta_asignatura, id_informe_asignatura) VALUES (?, ?, ?)
    """, (persona_id, encuesta_asignatura_id, None))
    respuesta_alumno_id = cursor.lastrowid
    print(f"  [OK] Insertada Respuesta (Alumno) ID: {respuesta_alumno_id}")

    # 5.2. Detalles de la Respuesta del ALUMNO
    # (Usamos los IDs de po_encuesta_data: 1, 3, 7)
    detalles_alumno = [
        (1, respuesta_alumno_id, None), # P1: Si
        (3, respuesta_alumno_id, None), # P2: Una
        (7, respuesta_alumno_id, None)  # P3: NPO
    ]
    cursor.executemany("INSERT INTO detalles_respuestas (id_pregunta_opcion, id_respuesta, texto_respuesta_abierta) VALUES (?, ?, ?)", detalles_alumno)
    print(f"  [OK] Insertados {len(detalles_alumno)} detalles de respuesta del Alumno.")

    # 5.3. Respuesta del DOCENTE (a InformeAsignatura)
    cursor.execute("""
        INSERT INTO respuestas (id_persona, id_encuesta_asignatura, id_informe_asignatura) VALUES (?, ?, ?)
    """, (persona_id, None, informe_asignatura_id))
    respuesta_docente_id = cursor.lastrowid
    print(f"  [OK] Insertada Respuesta (Docente) ID: {respuesta_docente_id}")
    
    # 5.4. Detalles de la Respuesta del DOCENTE
    # (Usamos los IDs de po_informe_ids: 8, 9, 10)
    detalles_docente = [
        (po_informe_ids[0], respuesta_docente_id, "Se necesitan 5 computadoras nuevas."),
        (po_informe_ids[1], respuesta_docente_id, "Se dictó el 95% de las horas."),
        (po_informe_ids[2], respuesta_docente_id, "Se logró el 100% de los contenidos.")
    ]
    cursor.executemany("INSERT INTO detalles_respuestas (id_pregunta_opcion, id_respuesta, texto_respuesta_abierta) VALUES (?, ?, ?)", detalles_docente)
    print(f"  [OK] Insertados {len(detalles_docente)} detalles de respuesta del Docente.")

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