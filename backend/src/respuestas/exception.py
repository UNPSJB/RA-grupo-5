from src.respuestas.constants import ErrorCode
from src.exceptions import NotFound, BadRequest 

class RespuestaNoEncontrada(NotFound):
    DETAIL = ErrorCode.RESPUESTA_NO_ENCONTRADA
    