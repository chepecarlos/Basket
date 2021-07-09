#!/home/chepecarlos/5.Programas/2.Heramientas/3.Basket/venv/bin/python
# -*- coding: utf-8 -*-

import logging
import argparse
import os

from operaciones.IconoFolder import ActualizarIconoFolder
from operaciones.OperacionesBlender import CrearProxy

from extra.FuncionesLogging import ConfigurarLogging

logger = logging.getLogger(__name__)
ConfigurarLogging(logger)

parser = argparse.ArgumentParser(description='Heramienta Asignar iconos a folder')
parser.add_argument('--icono', '-i', help="Actualizar Icono a folder gtk")
parser.add_argument('--blenderproxy', '-bp', help="Creando proxy de Blender", action="store_true")

parser.add_argument('--file', '-f', help="Archivo trabajar")

if __name__ == "__main__":

    args = parser.parse_args()
    logger.info("Iniciando programa Basket")
    if args.icono:
        if args.file:
            ActualizarIconoFolder(args.file)
        else:
            ActualizarIconoFolder()
    elif args.blenderproxy:
        print("Empezando a crear proxy")
        CrearProxy(os.getcwd())
    else:
        print("Opcion no encontrada, lee documentacion con -h")
