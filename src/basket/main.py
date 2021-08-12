import logging
import argparse
import os

from MiLogging.MiLogging import ConfigurarLogging

from operaciones.IconoFolder import ActualizarIconoFolder
from operaciones.OperacionesPantillas import CrearFolderVideo, CrearArticulo
from operaciones.OperacionesBlender import CrearProxy, RenderizarVideo, BorrarTemporalesBender, SuvirVideo

def main():
    logger = logging.getLogger(__name__)
    ConfigurarLogging(logger)

    parser = argparse.ArgumentParser(description='Heramientas Automatizacion de ALSW')
    parser.add_argument('--icono', '-i', help="Actualizar Icono a folder gtk", action="store_true")
    parser.add_argument('--blender_proxy', '-bp', help="Creando proxy de Blender", action="store_true")
    parser.add_argument('--blender_renderizar', '-br', help="Renderizar video con Blender", action="store_true")
    parser.add_argument('--blender_borrar', '-bb', help="Borrar Temporales de Blender", action="store_true")
    parser.add_argument('--blender_completo', '-bc', help="Renderiza video Blender y sube a youtube", action="store_true")
    parser.add_argument('--proyectovideo', '-p', help="Crear Folder proyecto de Video")
    parser.add_argument('--proyectoarticulo', '-a', help="Crear articulo base")
    parser.add_argument('--file', '-f', help="Archivo trabajar")

    args = parser.parse_args()
    if args.icono:
        ActualizarIconoFolder(args.file)
    elif args.blender_completo:
        if args.file:
            VideoTerminado = RenderizarVideo(args.file)
            if VideoTerminado:
                VideoSuvido = SuvirVideo(args.file)
    elif args.blender_proxy:
        logger.info("Empezando a crear proxy")
        CrearProxy(os.getcwd())
    elif args.blender_renderizar:
        logger.info("Empezando a Renderizar video")
        if args.file:
            RenderizarVideo(args.file)
    elif args.blender_borrar:
        logger.info("Borrar temporales de Blender")
        BorrarTemporalesBender('BL_proxy')
        BorrarTemporalesBender('bpsrender')
    elif args.proyectovideo:
        print(f"Nombre del folder {args.proyectovideo}")
        CrearFolderVideo(args.proyectovideo)
    elif args.proyectoarticulo:
        print(f"Nombre del Archivo {args.proyectoarticulo}")
        CrearArticulo(args.proyectoarticulo)
    else:
        logger.info("Opcion no encontrada, lee documentacion con -h")

if __name__ == "__main__":
    main()
    exit()