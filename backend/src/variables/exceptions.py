from src.variables.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class VariableNoEncontrada(NotFound):
    DETAIL = ErrorCode.VARIABLE_NO_ENCONTRADA

class VariableAsociadaAEncuesta(BadRequest):
    DETAIL = ErrorCode.VARIABLE_ASOCIADA_A_ENCUESTA