import os

import basket.miLibrerias as miLibrerias

logger = miLibrerias.ConfigurarLogging(__name__)


def ActualizarIconoFolder(Icono=None, Depuracion=False):
    """Asignar un icono a folder recursicamente para gtk."""
    if Icono is None:
        Icono = ".icono.png"
    logger.info(f"Usando el Archivo {Icono}")
    cantidad = 0

    FolderIgnorar = [".git", ".local", "venv", "node_modules", "BL_proxy", "bpsrender"]

    Ruta_Actual = os.getcwd()

    for ruta, directorios, archivos in os.walk(Ruta_Actual, topdown=True):

        for Folder in FolderIgnorar:
            if Folder in directorios:
                directorios.remove(Folder)

        for Archivo in archivos:
            if Archivo == Icono:
                cantidad += 1
                Comando = f"gio set {ruta} metadata::custom-icon {Icono}"
                if Depuracion:
                    logger.info(f"[{Icono}] {ruta}")
                os.system(Comando)

    logger.info(f"Cantidad iconos asignados {cantidad}")