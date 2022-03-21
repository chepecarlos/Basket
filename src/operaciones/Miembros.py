import shutil

import MiLibrerias
import pandas as pd
from MiLibrerias import FuncionesArchivos

logger = MiLibrerias.ConfigurarLogging(__name__)


def archivo_miembros():
    folder_log = FuncionesArchivos.ObtenerFolderConfig()
    folder_miembros = FuncionesArchivos.UnirPath(folder_log, "miembros.csv")
    return folder_miembros


def url_miembros():
    logger.info("URL de Miembro https://studio.youtube.com/channel/UCS5yb75qx5GFOG-uV5JLYlQ/monetization/memberships")


def actualizar_miembros(archivo):
    logger.info(f"Salvad {archivo}")
    folder_miembros = archivo_miembros()
    shutil.copy(archivo, folder_miembros)
    logger.info("Se Actualizo lista de Miembros")


def actualizar_articulo(archivo):
    logger.info(f"Actualizando Articulo {archivo}")
    folder_miembros = archivo_miembros()
    data_miembros = pd.read_csv(folder_miembros)
    data_articulo = leer_archivo(archivo, data_miembros)
    if data_articulo is not None:
        salvar_archivo(archivo, data_articulo)
        logger.info("Ya se actualizo el archivo")
    else:
        logger.error("No se encontró miembros en el archivo")


def leer_archivo(archivo, data_miembros):

    with open(archivo) as f:
        lineas = f.readlines()

    nivelesMiembro = ("Maker ESP", "Maker Mega", "Maker Uno")
    nuevo = list()
    encontrado = False
    hay_miembros = False
    for linea in lineas:
        if encontrado and not linea.startswith(" "):
            encontrado = False

        if not encontrado:
            nuevo.append(linea)

        if linea.startswith("miembros:"):
            encontrado = True
            for nivel in nivelesMiembro:
                filtro = data_miembros["Nivel actual"] == nivel
                miembrosActuales = data_miembros[filtro]
                cantidad = len(miembrosActuales)
                if cantidad:
                    hay_miembros = True
                    print(f"Nivel {nivel} - {cantidad} ")
                    nombreMiembros = miembrosActuales["Miembro"]
                    nuevo.append(f"  - title: {nivel}\n")
                    nuevo.append("    items:\n")
                    for miembro in nombreMiembros:
                        nuevo.append(f"      - title: {miembro}\n")
            continue

    if not hay_miembros:
        return None

    documento = tuple(nuevo)
    documento = "".join(documento)
    return documento


def salvar_archivo(archivo, data):
    with open(archivo, "w") as out:
        out.write(data)
