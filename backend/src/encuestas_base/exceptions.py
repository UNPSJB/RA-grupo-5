from src.encuestas_base.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class EncuestaBaseNoEncontrada(NotFound):
    DETAIL = ErrorCode.ENCUESTA_BASE_NO_ENCONTRADA
