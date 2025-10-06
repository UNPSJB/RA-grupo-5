from src.reportes.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class ReporteNoEncontrado(NotFound):
    DETAIL = ErrorCode.REPORTE_NO_ENCONTRADO