import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from src.database import engine
from src.models import ModeloBase

# importamos los routers desde nuestros modulos
from src.personas.router import router as personas_router
from src.encuestas.router import router as encuestas_router
from src.variables.router import router as variables_router
from src.preguntas.router import router as preguntas_router
from src.opcionesRespuestas.router import router as opcionesRespuestas_router
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")


@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    ModeloBase.metadata.create_all(bind=engine)
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
app.include_router(encuestas_router)
app.include_router(variables_router)
app.include_router(preguntas_router)
app.include_router(opcionesRespuestas_router)