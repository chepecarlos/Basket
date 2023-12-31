import os

import basket.miLibrerias as miLibrerias

logger = miLibrerias.ConfigurarLogging(__name__)


def actualizarIconoFolder(icono=None, depuracion=False):
    """Asignar un icono a folder recursicamente para gtk."""
    if icono is None:
        icono = ".icono.png"
    logger.info(f"Usando el Archivo {icono}")
    cantidad = 0

    folderIgnorar = [".git", ".local", "venv", "node_modules", "BL_proxy", "bpsrender"]

    rutaActual = os.getcwd()

    for ruta, directorios, archivos in os.walk(rutaActual, topdown=True):

        for folder in folderIgnorar:
            if folder in directorios:
                directorios.remove(folder)

        for archivo in archivos:
            if archivo == icono:
                cantidad += 1
                Comando = f"gio set {ruta} -t string metadata::custom-icon {icono}"
                if depuracion:
                    logger.info(f"[{icono}] {ruta}")
                os.system(Comando)

    logger.info(f"Cantidad iconos asignados {cantidad}")


def actualizarIconoProyecto():
    pass
