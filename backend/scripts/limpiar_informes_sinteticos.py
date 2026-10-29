#!/usr/bin/env python3
"""
Diagnóstico y limpieza opcional de informes sintéticos de carrera.

Por defecto NO modifica la base: sólo muestra qué haría.
Para aplicar cambios usar --aplicar.

Ejemplos (desde backend/):

    python scripts/limpiar_informes_sinteticos.py
    python scripts/limpiar_informes_sinteticos.py --aplicar --ciclo 2025
    python scripts/limpiar_informes_sinteticos.py --aplicar --ciclo 2025 --eliminar-basura

Qué considera un ciclo inválido:
  - vacío, nulo o no numérico
  - un año que no está cubierto por ningún período de encuestas_base
    (por ejemplo, 2024 si los períodos configurados son 2025-2028 y 2029-2032)

La migración actualiza el ciclo del informe sintético y el de sus informes
curriculares hijos. También completa id_respuesta cuando la relación existe
pero la FK directa quedó vacía.
"""
import argparse
import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "database.db")


def cargar_anios_validos(cur):
    anios = set()
    for row in cur.execute(
        "SELECT anio_inicio, anio_fin FROM encuestas_base "
        "WHERE anio_inicio IS NOT NULL AND anio_fin IS NOT NULL"
    ):
        inicio, fin = int(row[0]), int(row[1])
        if fin >= inicio:
            anios.update(range(inicio, fin + 1))
    return anios


def parse_anio(value):
    try:
        anio = int(str(value).strip())
        return anio if anio > 0 else None
    except (TypeError, ValueError):
        return None


def cargar_informes(cur):
    return cur.execute(
        """
        SELECT
            s.id,
            s.ciclo_lectivo,
            s.estado,
            s.id_respuesta,
            (SELECT COUNT(*) FROM informes_asignaturas ia
             WHERE ia.id_informe_sintetico_carrera = s.id) AS hijos,
            (SELECT COUNT(*) FROM respuestas r
             WHERE r.id_informe_sintetico_carrera = s.id) AS respuestas
        FROM informes_sinteticos_carreras s
        ORDER BY s.id
        """
    ).fetchall()


def main():
    parser = argparse.ArgumentParser(description="Limpieza de informes sintéticos")
    parser.add_argument(
        "--aplicar",
        action="store_true",
        help="Aplica los cambios (sin esta opción sólo se muestra el diagnóstico)",
    )
    parser.add_argument(
        "--ciclo",
        type=int,
        help="Ciclo lectivo al que se migrarán los informes con ciclo inválido",
    )
    parser.add_argument(
        "--eliminar-basura",
        action="store_true",
        help="Elimina informes sintéticos sin informes hijos y sin respuestas",
    )
    args = parser.parse_args()

    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    anios_validos = cargar_anios_validos(cur)
    if not anios_validos:
        raise SystemExit("No hay períodos configurados en encuestas_base.")

    informes = cargar_informes(cur)
    invalidos = []
    basura = []

    print(f"Base: {DB_PATH}")
    print(f"Años válidos según encuestas_base: {sorted(anios_validos)}")
    print("")

    for informe in informes:
        anio = parse_anio(informe["ciclo_lectivo"])
        valido = anio is not None and anio in anios_validos
        if not valido:
            invalidos.append(informe)
        if informe["hijos"] == 0 and informe["respuestas"] == 0:
            basura.append(informe)

        print(
            f"Informe {informe['id']}: ciclo={informe['ciclo_lectivo']!r} "
            f"estado={informe['estado']} hijos={informe['hijos']} "
            f"respuestas={informe['respuestas']} "
            f"{'OK' if valido else 'CICLO INVÁLIDO'}"
        )

    plan = []

    if invalidos:
        if args.ciclo is None:
            plan.append(
                f"Se migrarían {len(invalidos)} informes con ciclo inválido "
                "usando --ciclo <año>."
            )
        else:
            plan.append(
                f"Se migrarían {len(invalidos)} informes con ciclo inválido "
                f"a {args.ciclo}."
            )

    if args.eliminar_basura and basura:
        plan.append(
            f"Se eliminarían {len(basura)} informes sintéticos sin hijos ni respuestas: "
            f"{[i['id'] for i in basura]}."
        )

    print("")
    if not plan:
        print("No hay cambios para aplicar.")
    else:
        print("Plan:")
        for item in plan:
            print(f"  - {item}")

    if not args.aplicar:
        print("")
        print("Modo diagnóstico. Agregá --aplicar para ejecutar los cambios.")
        return

    if args.ciclo is not None and args.ciclo not in anios_validos:
        print(
            f"Advertencia: {args.ciclo} no está cubierto por encuestas_base; "
            "los informes migrados podrían seguir sin período visible."
        )

    with con:
        if args.ciclo is not None and invalidos:
            ids = [int(i["id"]) for i in invalidos]
            placeholders = ",".join("?" for _ in ids)
            cur.execute(
                f"UPDATE informes_sinteticos_carreras SET ciclo_lectivo = ? "
                f"WHERE id IN ({placeholders})",
                [str(args.ciclo), *ids],
            )
            cur.execute(
                f"UPDATE informes_asignaturas SET ciclo_lectivo = ? "
                f"WHERE id_informe_sintetico_carrera IN ({placeholders})",
                [args.ciclo, *ids],
            )
            print(f"Migrados {len(ids)} informes sintéticos a {args.ciclo}.")

        # Sincroniza la FK directa del informe con la respuesta ya existente.
        cur.execute(
            """
            UPDATE informes_sinteticos_carreras
            SET id_respuesta = (
                SELECT r.id FROM respuestas r
                WHERE r.id_informe_sintetico_carrera = informes_sinteticos_carreras.id
                ORDER BY r.id LIMIT 1
            )
            WHERE id_respuesta IS NULL
              AND EXISTS (
                SELECT 1 FROM respuestas r
                WHERE r.id_informe_sintetico_carrera = informes_sinteticos_carreras.id
              )
            """
        )
        if cur.rowcount:
            print(f"Sincronizados {cur.rowcount} id_respuesta.")

        if args.eliminar_basura and basura:
            ids = [int(i["id"]) for i in basura]
            placeholders = ",".join("?" for _ in ids)
            cur.execute(
                f"DELETE FROM informes_sinteticos_carreras WHERE id IN ({placeholders})",
                ids,
            )
            print(f"Eliminados {len(ids)} informes sintéticos sin hijos ni respuestas.")

    con.close()


if __name__ == "__main__":
    main()
