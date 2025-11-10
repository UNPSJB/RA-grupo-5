from src.variables.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class VariableEncontrada(NotFound):
    DETAIL = ErrorCode.VARIABLE_NO_ENCONTRADA