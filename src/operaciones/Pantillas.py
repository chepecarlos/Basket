import shutil
import os

import MisFunciones

logger = MisFunciones.ConfigurarLogging(__name__)

def CrearFolderVideo(NombreFolder):
    """Copia Folder Base de proyectos a directorio actual."""
    NombreFolder = NombreSinEspacios(NombreFolder)
    FolderBase = MisFunciones.ObtenerValor("data/Plantilla.json", "ProyectoEjemplo")
    if FolderBase is not None:
        NuevoFolder = os.path.join(os.getcwd(), NombreFolder)
        try:
            shutil.copytree(FolderBase, NuevoFolder)
            logger.info("Folder Creado")
        except OSError as err:
            logger.exception("Error: % s" % err)


def CrearArticulo(NombreArticulo):
    """Copia Articulo Base a directorio actual."""
    NombreArticulo = NombreSinEspacios(NombreArticulo)
    ArticuloBase = MisFunciones.ObtenerValor("data/Plantilla.json", "ArticuloBase")
    if ArticuloBase is not None:
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
