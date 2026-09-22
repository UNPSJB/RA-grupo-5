from datetime import date

import src.main  # noqa: F401 - registra todos los modelos SQLAlchemy
from sqlalchemy import select

from src.asignaturas.models import Asignatura
from src.carreras.models import Carrera
from src.cursadas.models import Cursada
from src.database import SessionLocal
from src.encuestas_asignaturas.models import EncuestaAsignatura, EstadoEncuesta
from src.encuestas_base.models import EncuestaBase
from src.pregunta_opcion.models import PreguntaOpcion
from src.personas.models import Persona
from src.reportes.models import Reporte
from src.respuestas.models import Respuesta
from src.detalle_respuesta.models import DetalleRespuesta
from src.seguridad.models import Role, RoleName
from src.seguridad.services import SeguridadService


PASSWORD = "1234"
DEMO_USERS = {
    99000001: ("Alumno", "Demo", "demo.alumno@example.test", RoleName.alumno),
    99000002: ("Docente", "Demo", "demo.docente@example.test", RoleName.docente),
    99000003: ("Departamento", "Demo", "demo.departamento@example.test", RoleName.departamento),
    99000004: ("Secretaria", "Demo", "demo.secretaria@example.test", RoleName.secretaria_academica),
    99000005: ("Administrador", "Demo", "demo.admin@example.test", RoleName.admin),
}


def get_or_create_persona(db, dni, data):
    nombre, apellido, email, role_name = data
    persona = db.scalar(select(Persona).where(Persona.dni == dni))
    if persona is None:
        persona = Persona(
            dni=dni,
            nombre=nombre,
            apellido=apellido,
            telefono=f"+549280{dni}",
            email=email,
            contacto_emergencia="Contacto demo",
        )
        db.add(persona)
        db.flush()
    persona.nombre = nombre
    persona.apellido = apellido
    persona.email = email
    persona.set_password(PASSWORD)
    role = db.scalar(select(Role).where(Role.name == role_name.value))
    persona.roles = [role]
    return persona


def get_or_create_cursada(db, persona_id, asignatura_id, ciclo_lectivo):
    cursada = db.scalar(
        select(Cursada).where(
            Cursada.id_persona == persona_id,
            Cursada.id_asignatura == asignatura_id,
            Cursada.ciclo_lectivo == ciclo_lectivo,
        )
    )
    if cursada is None:
        db.add(Cursada(
            id_persona=persona_id,
            id_asignatura=asignatura_id,
            ciclo_lectivo=ciclo_lectivo,
        ))


def get_or_create_encuesta(db, base_id, asignatura_id, ciclo_lectivo, estado, inicio, fin):
    encuesta = db.scalar(
        select(EncuestaAsignatura).where(
            EncuestaAsignatura.id_encuesta_base == base_id,
            EncuestaAsignatura.id_asignatura == asignatura_id,
            EncuestaAsignatura.ciclo_lectivo == ciclo_lectivo,
        )
    )
    if encuesta is None:
        encuesta = EncuestaAsignatura(
            id_encuesta_base=base_id,
            id_asignatura=asignatura_id,
            ciclo_lectivo=ciclo_lectivo,
            estado=estado,
            fecha_inicio=inicio,
            fecha_fin=fin,
        )
        db.add(encuesta)
        db.flush()
    else:
        encuesta.estado = estado
        encuesta.fecha_inicio = inicio
        encuesta.fecha_fin = fin
    return encuesta


def add_demo_response(db, persona_id, encuesta):
    existing = db.scalar(
        select(Respuesta).where(
            Respuesta.id_persona == persona_id,
            Respuesta.id_encuesta_asignatura == encuesta.id,
        )
    )
    if existing is not None:
        return existing

    base = db.get(EncuestaBase, encuesta.id_encuesta_base)
    respuesta = Respuesta(
        id_persona=persona_id,
        id_encuesta_asignatura=encuesta.id,
    )
    db.add(respuesta)
    db.flush()

    for variable in base.variables:
        for pregunta in variable.preguntas:
            opciones = list(pregunta.pregunta_opcion)
            if not opciones:
                continue
            opcion = next(
                (item for item in opciones if item.id_opcion_respuesta is not None),
                opciones[0],
            )
            texto = None
            if pregunta.tipo.value == "open":
                texto = "Respuesta demostrativa de la encuesta."
            db.add(DetalleRespuesta(
                id_pregunta_opcion=opcion.id,
                id_respuesta=respuesta.id,
                texto_respuesta_abierta=texto,
            ))
    return respuesta


def get_or_create_reporte(db, encuesta_id):
    reporte = db.scalar(
        select(Reporte).where(Reporte.id_encuesta_asignatura == encuesta_id)
    )
    if reporte is None:
        reporte = Reporte(id_encuesta_asignatura=encuesta_id)
        db.add(reporte)


def main():
    db = SessionLocal()
    try:
        SeguridadService(db).seed()

        personas = {
            dni: get_or_create_persona(db, dni, data)
            for dni, data in DEMO_USERS.items()
        }
        alumno = personas[99000001]
        docente = personas[99000002]

        asignaturas = db.scalars(select(Asignatura).order_by(Asignatura.id)).all()
        bases = db.scalars(select(EncuestaBase).order_by(EncuestaBase.id)).all()
        if len(asignaturas) < 2 or len(bases) < 3:
            raise RuntimeError("Se necesitan al menos 2 asignaturas y 3 encuestas base existentes.")

        materia_1, materia_2 = asignaturas[:2]
        base_vigente = bases[0]
        base_historica = bases[2]

        get_or_create_cursada(db, alumno.id, materia_1.id, 2026)
        get_or_create_cursada(db, alumno.id, materia_2.id, 2026)
        get_or_create_cursada(db, docente.id, materia_1.id, 2026)
        get_or_create_cursada(db, docente.id, materia_2.id, 2026)

        respondida = get_or_create_encuesta(
            db, base_vigente.id, materia_1.id, 2026, EstadoEncuesta.abierta,
            date(2026, 1, 1), date(2026, 12, 31),
        )
        pendiente = get_or_create_encuesta(
            db, base_vigente.id, materia_2.id, 2026, EstadoEncuesta.abierta,
            date(2026, 1, 1), date(2026, 12, 31),
        )
        historica = get_or_create_encuesta(
            db, base_historica.id, materia_1.id, 2029, EstadoEncuesta.cerrada,
            date(2029, 1, 1), date(2029, 12, 31),
        )

        add_demo_response(db, alumno.id, respondida)
        add_demo_response(db, alumno.id, historica)
        get_or_create_reporte(db, respondida.id)
        get_or_create_reporte(db, historica.id)

        db.commit()
        print("Datos demo creados o actualizados correctamente.")
        print("Usuario alumno: DNI 99000001 / contraseña 1234")
        print("Usuario docente: DNI 99000002 / contraseña 1234")
        print("Usuario departamento: DNI 99000003 / contraseña 1234")
        print("Usuario secretaria: DNI 99000004 / contraseña 1234")
        print("Usuario admin: DNI 99000005 / contraseña 1234")
        print(f"Encuesta respondida: {respondida.id}; pendiente: {pendiente.id}; histórica: {historica.id}")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()