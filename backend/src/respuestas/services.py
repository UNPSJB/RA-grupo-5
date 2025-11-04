from genericpath import exists
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.sql import exists as sa_exists
from sqlalchemy.orm import Session, joinedload
from src.respuestas.models import Respuesta
from src.respuestas import schemas
from src.pregunta_opcion.models import PreguntaOpcion
from src.preguntas.models import Pregunta
from src.detalle_respuesta.models import DetalleRespuesta
from src.informes_asignaturas.models import InformeAsignatura, EstadoInforme


def crear_respuesta(db: Session, respuesta: schemas.RespuestaCreate) -> Respuesta:
    # ¿Esta respuesta es sobre un informe_asignatura (informe curricular) o sobre una encuesta?
    es_informe = respuesta.id_informe_asignatura is not None
    
    if es_informe:
        # 1) ¿existe ya una respuesta para este informe? ya_existe=true
        ya_existe = db.scalar(
            select(sa_exists().where(Respuesta.id_informe_asignatura == respuesta.id_informe_asignatura))
        )
        if ya_existe:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Este informe curricular ya tiene una respuesta registrada.",
            )

        # 2) ¿el informe ya está cerrado?
        informe = db.get(InformeAsignatura, respuesta.id_informe_asignatura)
        if informe is None:
            raise HTTPException(status_code=404, detail="Informe curricular no encontrado para responder")

        if informe.estado == EstadoInforme.cerrado:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El informe curricular ya fue cerrado; no se admiten nuevas respuestas.",
            )

    # recolecto todos los id_pregunta_opcion que vienen en los detalles
    po_ids = [detalle.id_pregunta_opcion for detalle in respuesta.detalles]

    # traigo metadatos de cada pregunta_opcion que vino
    query = (
        select(
            PreguntaOpcion.id,
            Pregunta.tipo,
            Pregunta.obligatoria,
            Pregunta.id_informe_curricular_base,
        )
        .join(Pregunta, PreguntaOpcion.id_pregunta == Pregunta.id)
        .where(PreguntaOpcion.id.in_(po_ids))
    )

    pregunta_info = {
        po_id: {
            "tipo": tipo,
            "obligatoria": obligatoria,
            "es_de_informe": id_informe_curricular_base is not None,
        }
        for po_id, tipo, obligatoria, id_informe_curricular_base in db.execute(query).all()
    }

    # 1. Creo la respuesta "cabecera"
    db_respuesta = Respuesta(
        id_persona=respuesta.id_persona,
        id_encuesta_asignatura=respuesta.id_encuesta_asignatura,
        id_informe_asignatura=respuesta.id_informe_asignatura,
    )
    db.add(db_respuesta)
    db.flush()  # tenemos db_respuesta.id

    lista_detalles = []

    # 2. Valido y armo cada detalle de la respuesta
    for detalle_schema in respuesta.detalles:
        po_id = detalle_schema.id_pregunta_opcion
        info = pregunta_info.get(po_id)
        texto_recibido = detalle_schema.texto_respuesta_abierta

        if info is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"El conector de preguta ID {po_id} no existe",
            )

        tipo_pregunta = info["tipo"]
        es_obligatoria = info["obligatoria"]

        # Validación 1: si la pregunta NO es 'open', no permitimos texto libre
        if (
            tipo_pregunta != "open"
            and texto_recibido is not None
            and texto_recibido.strip() != ""
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No se permite texto libre para la pregunta {po_id}, no es de tipo abierto",
            )

        # Validación 2: si la pregunta ES open + obligatoria, debe venir texto
        if (
            tipo_pregunta == "open"
            and es_obligatoria
            and (texto_recibido is None or texto_recibido.strip() == "")
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El texto es obligatorio para la pregunta {po_id}",
            )

        db_detalle = DetalleRespuesta(
            **detalle_schema.model_dump(),
            id_respuesta=db_respuesta.id,
        )
        lista_detalles.append(db_detalle)

    # 3. Inserto todos los detalles en bloque
    db.add_all(lista_detalles)

    # 4. Si esta respuesta corresponde a un informe_asignatura,
    #    cerramos ese informe automáticamente.  ### NUEVO
    if es_informe and respuesta.id_informe_asignatura is not None:
        informe = db.get(
            InformeAsignatura, respuesta.id_informe_asignatura
        )
        if informe is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Informe curricular no encontrado para cerrar",
            )

        # solo si aún está 'abierto', lo pasamos a 'cerrado'
        if informe.estado != EstadoInforme.cerrado:
            informe.estado = EstadoInforme.cerrado

        # no hacemos flush separado porque el commit final ya lo guarda

    # 5. Confirmo todo
    db.commit()
    db.refresh(db_respuesta)

    return db_respuesta




def listar_respuestas(db: Session,
    persona_id: Optional[int] = None,
    encuesta_asignatura_id: Optional[int] = None,
    informe_asignatura_id: Optional[int] = None
) -> List[Respuesta]:
    query = (
        select(Respuesta)
        .options(joinedload(Respuesta.detalles))
    )

    if persona_id is not None:
        query = query.where(Respuesta.id_persona == persona_id)

    if encuesta_asignatura_id is not None:
        query = query.where(Respuesta.id_encuesta_asignatura == encuesta_asignatura_id)
    
    if informe_asignatura_id is not None:
        query = query.where(Respuesta.id_informe_asignatura == informe_asignatura_id)
        
    return db.scalars(query).unique().all()

def leer_respuesta(db: Session, respuesta_id: int) -> Respuesta:
    
    query = (
        select(Respuesta)
        .where(Respuesta.id == respuesta_id)
        .options(joinedload(Respuesta.detalles)) 
    )
    db_respuesta = db.scalar(query)
    
    if db_respuesta is None:
        raise HTTPException(status_code=404, detail="Respuesta no encontrada")
    return db_respuesta
