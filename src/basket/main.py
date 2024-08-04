import argparse
import os
from pathlib import Path

import basket.miLibrerias as miLibrerias
import basket.operaciones.Miembros as MiembrosYT
from basket.operaciones.presente import cargarPresente

from .operaciones import usuario
from .operaciones.graficaSun import graficaSun
from .operaciones.IconoFolder import actualizarIconoFolder
from .operaciones.OperacionesBlender import BorrarTemporalesBender, CrearProxy, RenderizarVideo, SubirVideo
from .operaciones.Pantillas import CrearArticulo, CrearFolderVideo
from .operaciones.Video import ConvertirVideo
from .operaciones.convertir import convertir_wav
from .operaciones.subtitulo import crearSubtituloSBV

def main():
    logger = miLibrerias.ConfigurarLogging(__name__)

    parser = argparse.ArgumentParser(description="Heramientas Automatizacion de ALSW")
    parser.add_argument("--icono", "-i", help="Actualizar Icono a folder gtk", action="store_true")

    parser.add_argument("--blender_proxy", "-bp", help="Creando proxy de Blender", action="store_true")
    parser.add_argument("--blender_renderizar", "-br", help="Renderizar video con Blender")
    parser.add_argument("--blender_borrar", "-bb", help="Borrar Temporales de Blender", action="store_true")
    parser.add_argument("--blender_completo", "-bc", help="Renderiza video Blender y sube a youtube")
    parser.add_argument("--blender_subtitulo", "-bs", help="Renderiza video Blender y crea subtitulo.sbv")
    
    parser.add_argument("--canal", "-c", help="Especifica Canal")

    parser.add_argument("--video", "-v", help="Convertir video a 60 fps", action="store_true")
    parser.add_argument("--grafica", "-g", help="Crecar Grafica 7 y 30 Dias")

    parser.add_argument("--usuario", help="Cambiar usuario sistema")

    parser.add_argument("--proyectovideo", "-p", help="Crear Folder proyecto de Video")
    parser.add_argument("--proyectoarticulo", "-a", help="Crear articulo base")

    parser.add_argument("--file", "-f", help="Archivo trabajar")
    parser.add_argument("--depuracion", "-d", help="Activar depuracion", action="store_true")

    parser.add_argument("--url_miembro", help="Actualiza base de datos de miembros", action="store_true")
    parser.add_argument("--actualizar_miembro", "-am", help="Actualiza base de datos de miembros")
    parser.add_argument("--miembro", "-m", help="Agrega miembros a un archivo de NocheProgramacion")

    parser.add_argument("--presente", help="copia a papelera los asistentes del Envivo")

    args = parser.parse_args()
    if args.icono:
        logger.info("Refrescar Iconos")
        actualizarIconoFolder(args.file, args.depuracion)
    elif args.blender_completo:
        Canal = None
        if args.canal:
            Canal = args.canal
            logger.info(f"Subiendo a {Canal}")

        VideoTerminado = RenderizarVideo(args.blender_completo)
        if VideoTerminado:
            VideoSubido = SubirVideo(args.blender_completo, Canal)
    elif args.blender_proxy:
        logger.info("Empezando a crear proxy")
        CrearProxy(os.getcwd())
    elif args.blender_renderizar:
        logger.info("Empezando a Renderizar video")
        if args.blender_renderizar:
            RenderizarVideo(args.blender_renderizar)
    elif args.blender_borrar:
        logger.info("Borrar temporales de Blender")
        BorrarTemporalesBender("BL_proxy")
        BorrarTemporalesBender("bpsrender")
    elif args.blender_subtitulo:
        if ".blend" in args.blender_subtitulo:
            VideoMP4 = RenderizarVideo(args.blender_subtitulo)
        elif ".mp4" in args.blender_subtitulo:
            VideoMP4 = args.blender_subtitulo
        else:
            print(f"Error en Archivo {args.blender_subtitulo}")
            return
        
        if VideoMP4:
            audioWav = convertir_wav(VideoMP4)  
        if audioWav:
            print("Creando archivo subtitulo")
            crearSubtituloSBV(audioWav)
    elif args.proyectovideo:
        logger.info(f"Nombre del folder {args.proyectovideo}")
        CrearFolderVideo(args.proyectovideo)
        actualizarIconoFolder(args.file, args.depuracion)
    elif args.proyectoarticulo:
        logger.info(f"Nombre del Archivo {args.proyectoarticulo}")
        CrearArticulo(args.proyectoarticulo)
    elif args.video:
        if args.file:
            ConvertirVideo(args.file)
    elif args.grafica:
        graficaSun(args.grafica)
    elif args.usuario:
        usuario.SalvarUsuario(args.usuario)
    elif args.url_miembro:
        MiembrosYT.url_miembros()
    elif args.actualizar_miembro:
        MiembrosYT.actualizar_miembros(args.actualizar_miembro)
    elif args.miembro:
        MiembrosYT.actualizar_articulo(args.miembro)
    elif args.presente:
        cargarPresente(args.presente)
    else:
        logger.info("Opción no encontrada, lee documentación con -h")


if __name__ == "__main__":
    main()
    exit()
