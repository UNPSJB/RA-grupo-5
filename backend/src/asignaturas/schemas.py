from pydantic import BaseModel, EmailStr
from typing import List


class AsignaturaBase(BaseModel):
    nombre: str
    nombre_docente: str


class AsignaturaCreate(AsignaturaBase):
    pass


class AsignaturaUpdate(AsignaturaBase):
    pass


class AsignaturaRead(AsignaturaBase):
    id: int
    model_config = {"from_attributes": True}
