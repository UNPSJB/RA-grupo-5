from src.preguntas.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class PreguntaNoEncontrada(NotFound):
    DETAIL = ErrorCode.PREGUNTA_NO_ENCONTRADA