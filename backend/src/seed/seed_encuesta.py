from sqlalchemy.orm import Session
from src.encuestas.models import Encuesta, Ciclo
from src.variables.models import Variable
from src.preguntas.models import Pregunta, TipoPreguntaEnum
from src.opciones_respuestas.models import OpcionRespuesta

from backend.src.database import engine, Base  # Asumo que tenés esto
from sqlalchemy.exc import IntegrityError

# Crea las tablas si no existen
Base.metadata.create_all(bind=engine)

def seed_encuesta_template():
    db = Session(bind=engine)

    # Verificamos si ya existe la encuesta para no duplicar
    encuesta_existente = db.query(Encuesta).filter_by(ciclo=Ciclo.ciclo_basico).first()
    if encuesta_existente:
        print("La encuesta plantilla ya existe, no se creará de nuevo.")
        db.close()
        return

    # 1️⃣ Creamos la encuesta
    encuesta = Encuesta(ciclo=Ciclo.ciclo_basico)

    # 2️⃣ Creamos variables
    variable1 = Variable(nombre="Satisfacción general", codigo="VAR001", encuesta=encuesta)
    variable2 = Variable(nombre="Interés en asignaturas", codigo="VAR002", encuesta=encuesta)

    # 3️⃣ Creamos preguntas para variable1
    pregunta1 = Pregunta(
        texto_pregunta="¿Estás satisfecho con la cursada?",
        tipo=TipoPreguntaEnum.boolean,
        obligatoria=True,
        variable=variable1
    )
    pregunta2 = Pregunta(
        texto_pregunta="¿Qué te pareció la organización?",
        tipo=TipoPreguntaEnum.single_choice,
        obligatoria=True,
        variable=variable1
    )

    # 4️⃣ Opciones para pregunta2
    opcion1 = OpcionRespuesta(texto_opcion="Excelente", pregunta=pregunta2)
    opcion2 = OpcionRespuesta(texto_opcion="Regular", pregunta=pregunta2)
    opcion3 = OpcionRespuesta(texto_opcion="Mala", pregunta=pregunta2)

    # 5️⃣ Preguntas para variable2
    pregunta3 = Pregunta(
        texto_pregunta="Selecciona las asignaturas que más te interesan",
        tipo=TipoPreguntaEnum.multiple_choice,
        obligatoria=False,
        variable=variable2
    )
    opcion4 = OpcionRespuesta(texto_opcion="Matemática", pregunta=pregunta3)
    opcion5 = OpcionRespuesta(texto_opcion="Historia", pregunta=pregunta3)
    opcion6 = OpcionRespuesta(texto_opcion="Física", pregunta=pregunta3)

    # 6️⃣ Agregamos todo al session
    db.add(encuesta)

    try:
        db.commit()
        print("Encuesta plantilla creada correctamente.")
    except IntegrityError:
        db.rollback()
        print("Ocurrió un error al crear la encuesta plantilla.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_encuesta_template()
