import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from src.database import engine
from src import models


from src.personas.router import router as personas_router 
from src.encuestas_base.router import router as encuestas_base_router
from src.informes_base.router import router as informes_base_router
from src.reportes.router import router as reportes_router
from src.variables.router import router as variables_router
from src.preguntas.router import router as preguntas_router
from src.opciones_respuesta.router import router as opciones_respuestas_router
from src.asignaturas.router import router as asignaturas_router
from src.encuestas_asignaturas.router import router as encuestas_asignaturas_router
from src.respuestas.router import router as respuestas_router
from src.detalle_respuesta.router import router as detalle_respuesta_router
from src.pregunta_opcion.router import router as pregunta_opcion_router
from src.informes_asignaturas.router import router as informes_asignaturas_router
from src.informes_sinteticos_base.router import router as informes_sinteticos_base_router
from src.carreras.router import router as carreras_router
from src.informe_sintetico_carrera.router import router as informe_sintetico_carrera_router

from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")


@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    models.ModeloBase.metadata.create_all(bind=engine)
    yield


app = FastAPI(root_path=ROOT_PATH, lifespan=db_creation_lifespan)

origins = [
    "http://localhost:5173", # para recibir requests desde app React (puerto: 5173)
]


app.add_middleware( #analiza la Request, se define una estructura para la Request
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# asociamos los routers a nuestra app
app.include_router(personas_router)
app.include_router(encuestas_base_router)
app.include_router(variables_router)
app.include_router(preguntas_router)
app.include_router(opciones_respuestas_router)
app.include_router(asignaturas_router)
app.include_router(encuestas_asignaturas_router)
app.include_router(informes_base_router)
app.include_router(reportes_router)
app.include_router(respuestas_router)
app.include_router(detalle_respuesta_router)
app.include_router(pregunta_opcion_router)
app.include_router(informes_asignaturas_router)
app.include_router(informes_sinteticos_base_router)
app.include_router(carreras_router)
app.include_router(informe_sintetico_carrera_router)