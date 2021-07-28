#!/home/chepecarlos/5.Programas/2.Heramientas/3.Basket/venv/bin/python
# -*- coding: utf-8 -*-

import logging
import argparse
import os

from operaciones.IconoFolder import ActualizarIconoFolder
from operaciones.OperacionesBlender import CrearProxy, RenderizarVideo, BorrarTemporalesBender, SuvirVideo

from extra.FuncionesLogging import ConfigurarLogging

logger = logging.getLogger(__name__)
ConfigurarLogging(logger)

parser = argparse.ArgumentParser(description='Heramienta Asignar iconos a folder')
parser.add_argument('--icono', '-i', help="Actualizar Icono a folder gtk")
parser.add_argument('--blenderproxy', '-bp', help="Creando proxy de Blender", action="store_true")
parser.add_argument('--blenderrenderizar', '-br', help="Crea el video Final", action="store_true")
parser.add_argument('--blenderborrar', '-bb', help="Borrar Temporales", action="store_true")
parser.add_argument('--blendercompleto', '-bc', help="Renderiza video y sube a youtube", action="store_true")

parser.add_argument('--file', '-f', help="Archivo trabajar")

if __name__ == "__main__":

    args = parser.parse_args()
    logger.info("Iniciando programa Basket")
    if args.icono:
        if args.file:
            ActualizarIconoFolder(args.file)
        else:
            ActualizarIconoFolder()
    elif args.blendercompleto:
        if args.file:
            VideoTerminado = RenderizarVideo(args.file)
            if VideoTerminado:
                VideoSuvido = SuvirVideo(args.file)
    elif args.blenderproxy:
        logger.info("Empezando a crear proxy")
        CrearProxy(os.getcwd())
    elif args.blenderrenderizar:
        logger.info("Empezando a Renderizar video")
        if args.file:
            RenderizarVideo(args.file)
    elif args.blenderborrar:
        logger.info("Borrar temporales de Blender")
        BorrarTemporalesBender('BL_proxy')
        BorrarTemporalesBender('bpsrender')
    else:
        logger.info("Opcion no encontrada, lee documentacion con -h")
