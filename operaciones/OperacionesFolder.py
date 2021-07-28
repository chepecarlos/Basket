import shutil 
import os

def CrearFolderVideo(NombreFolder):
    """Copia Folder Base de proyectos a directorio Actual."""

    FolderBase = "/home/SudoData/ChepeCarlos@alsw.net/2.Contenido/2.Proyectos/0.ProyectoEjemplo"
    FolderActua =  os.path.join(os.getcwd(), NombreFolder)
    try:
        shutil.copytree(FolderBase, FolderActua)
        print("Folder Creado")
    except OSError as err:
        print("Error: % s" % err)
    