import os


def ActualizarIconoFolder(Icono=None):
    """Asignar un icono a folder recursicamente para gtk."""
    if Icono is None:
        Icono=".icono.png"
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
                print(f"Asignando icono {Icono} a {ruta}")
                os.system(f"gio set {ruta} metadata::custom-icon {Icono}")

    print(f"Cantidad iconos asignados {cantidad}")
