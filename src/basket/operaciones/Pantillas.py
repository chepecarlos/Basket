import os
import shutil

import basket.miLibrerias as miLibrerias
from typing import Optional


logger = miLibrerias.ConfigurarLogging(__name__)


def CrearFolderVideo(nombreFolder: str, folder: Optional[str] = None) -> None:
    """Copia Folder Base de proyectos a directorio actual.

    Args:
        NombreFolder (str): Nombre del nuevo folder.
        Folder (str, optional): Directorio donde se creara el nuevo folder.
            Si no se especifica, se usa el directorio actual.
            Defaults to None.
    """
    archivo: str = "data/plantilla"
    atributo: str = "proyecto_ejemplo"
    nombreFolder: str = NombreSinEspacios(nombreFolder)
    folderBase: str = miLibrerias.ObtenerValor(archivo, atributo, depuracion=True)

    if folderBase is None:
        logger.warning(f"Error revisa: {archivo}[{atributo}]")
        exit()
        return

    if folder is None:
        folder = os.getcwd()
    nuevoFolder = os.path.join(folder, nombreFolder)

    try:
        shutil.copytree(folderBase, nuevoFolder)
        logger.info("Folder Creado")
    except OSError as err:
        logger.exception("Error: % s" % err)

    crearPaginaNotion(nuevoFolder)
    actualizarEstadoNotion(nuevoFolder)


def crearPaginaNotion(nuevoFolder: str) -> None:
    """Crear pagina en Notion para el nuevo proyecto."""
    from tooltube.minotion.minotion import crearNotion

    crearNotion(nuevoFolder)


def actualizarEstadoNotion(nuevoFolder: str) -> None:
    """Actualizar estado en Notion del nuevo proyecto."""
    from tooltube.tooltube_analisis import actualizarEstado

    actualizarEstado(nuevoFolder)


def CrearArticulo(NombreArticulo):
    """Copia Articulo Base a directorio actual."""
    archivo = "data/plantilla.json"
    atributo = "articulo_base"
    NombreArticulo = NombreSinEspacios(NombreArticulo)
    ArticuloBase = miLibrerias.ObtenerValor(archivo, atributo)
    if ArticuloBase is None:
        logger.warning(f"Error revisa: {archivo}[{atributo}]")
        exit()

    NuevoArticulo = os.path.join(os.getcwd(), NombreArticulo + ".md")
    try:
        shutil.copy2(ArticuloBase, NuevoArticulo)
        logger.info("Articulo Creado")
    except OSError as err:
        logger.exception("Error: % s" % err)


def NombreSinEspacios(Nombre: str) -> str:
    """Remplaza espacios en blanco por guiones bajos.

    Args:
        Nombre (str): Nombre a procesar.
    Raises:
        ValueError: Si el nombre es None.
    Returns:
        str: Nombre sin espacios.
    """
    if Nombre is not None:
        return Nombre.replace(" ", "_")
    raise ValueError("El nombre no puede ser None")
