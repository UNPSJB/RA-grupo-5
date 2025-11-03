from src.informes_curriculares_base.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class InformeBaseNoEncontrado(NotFound):
    DETAIL = ErrorCode.INFORME_BASE_NO_ENCONTRADO