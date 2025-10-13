from src.informes_curriculares.constants import ErrorCode
from src.exceptions import NotFound

class InformeNoEncontrado(NotFound):
    DETAIL = ErrorCode.INFORME_NO_ENCONTRADO
