import os
import shutil

import basket.miLibrerias as miLibrerias

logger = miLibrerias.ConfigurarLogging(__name__)


def CrearFolderVideo(NombreFolder):
    """Copia Folder Base de proyectos a directorio actual."""
    archivo = "data/plantilla.json"
    atributo = "proyecto_ejemplo"
    NombreFolder = NombreSinEspacios(NombreFolder)
    FolderBase = miLibrerias.ObtenerValor(archivo, atributo)

    if FolderBase is None:
        logger.warning(f"Error revisa: {archivo}[{atributo}]")
        return

    NuevoFolder = os.path.join(os.getcwd(), NombreFolder)
    try:
        shutil.copytree(FolderBase, NuevoFolder)
        logger.info("Folder Creado")
    except OSError as err:
        logger.exception("Error: % s" % err)


def CrearArticulo(NombreArticulo):
    """Copia Articulo Base a directorio actual."""
    archivo = "data/plantilla.json"
    atributo = "articulo_base"
    NombreArticulo = NombreSinEspacios(NombreArticulo)
    ArticuloBase = miLibrerias.ObtenerValor(archivo, atributo)
    if ArticuloBase is None:
        logger.warning(f"Error revisa: {archivo}[{atributo}]")

    NuevoArticulo = os.path.join(os.getcwd(), NombreArticulo + ".md")
    try:
        shutil.copy2(ArticuloBase, NuevoArticulo)
        logger.info("Articulo Creado")
    except OSError as err:
        logger.exception("Error: % s" % err)


def NombreSinEspacios(Nombre):
    if Nombre is not None:
        return Nombre.replace(" ", "_")
    return None
