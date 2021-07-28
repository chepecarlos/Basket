import shutil
import os


def CrearFolderVideo(NombreFolder):
    """Copia Folder Base de proyectos a directorio actual."""
    FolderBase = "/home/SudoData/ChepeCarlos@alsw.net/2.Contenido/2.Proyectos/0.ProyectoEjemplo"
    NuevoFolder = os.path.join(os.getcwd(), NombreFolder)
    try:
        shutil.copytree(FolderBase, NuevoFolder)
        print("Folder Creado")
    except OSError as err:
        print("Error: % s" % err)


def CrearArticulo(NombreArticulo):
    """Copia Articulo Base a directorio actual."""
    ArticuloBase = "/home/chepecarlos/1.Proyectos/1.Oficiales/1.NocheProgramacion/assets/template/video.md"
    NuevoArticulo = os.path.join(os.getcwd(), NombreArticulo + ".md")
    try:
        shutil.copy2(ArticuloBase, NuevoArticulo)
        print("Articulo Creado")
    except OSError as err:
        print("Error: % s" % err)
