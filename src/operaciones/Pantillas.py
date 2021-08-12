import shutil
import os

from extra.FuncionesArchivos import ObtenerValor


def CrearFolderVideo(NombreFolder):
    """Copia Folder Base de proyectos a directorio actual."""
    NombreFolder = NombreSinEspacios(NombreFolder)
    FolderBase = ObtenerValor("data/Plantilla.json", "ProyectoEjemplo")
    if FolderBase is not None:
        NuevoFolder = os.path.join(os.getcwd(), NombreFolder)
        try:
            shutil.copytree(FolderBase, NuevoFolder)
            print("Folder Creado")
        except OSError as err:
            print("Error: % s" % err)


def CrearArticulo(NombreArticulo):
    """Copia Articulo Base a directorio actual."""
    NombreArticulo = NombreSinEspacios(NombreArticulo)
    ArticuloBase = ObtenerValor("data/Plantilla.json", "ArticuloBase")
    if ArticuloBase is not None:
        NuevoArticulo = os.path.join(os.getcwd(), NombreArticulo + ".md")
        try:
            shutil.copy2(ArticuloBase, NuevoArticulo)
            print("Articulo Creado")
        except OSError as err:
            print("Error: % s" % err)

def NombreSinEspacios(Nombre):
    if Nombre is not None:
        return Nombre.replace(" ", "_")
    return None
