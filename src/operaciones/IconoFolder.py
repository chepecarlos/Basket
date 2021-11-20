import os

import MiLibrerias

logger = MiLibrerias.ConfigurarLogging(__name__)

def ActualizarIconoFolder(Icono=None, Depuracion=False):
    """Asignar un icono a folder recursicamente para gtk."""
    if Icono is None:
        Icono=".icono.png"
    logger.info(f"Usando el Archivo {Icono}")
    cantidad = 0

    FolderIgnorar = [".git", "venv", "node_modules", "BL_proxy", "bpsrender"]

    Ruta_Actual = os.getcwd()

    for ruta, directorios, archivos in os.walk(Ruta_Actual, topdown=True):

        for Folder in FolderIgnorar:
            if Folder in directorios:
                directorios.remove(Folder)

        for Archivo in archivos:
            if Archivo == Icono:
                cantidad += 1
                if Depuracion:
                    logger.info(f"[{Icono}]{ruta}")
                os.system(f"gio set {ruta} metadata::custom-icon {Icono}")

    logger.info(f"Cantidad iconos asignados {cantidad}")
