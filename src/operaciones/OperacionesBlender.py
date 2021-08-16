from extra.SubProceso import EmpezarSubProceso
import time
import datetime
import os
import shutil
import logging

import MiLibrerias
logger = MiLibrerias.ConfigurarLogging(__name__)

def CrearProxy(Directorio):
    MiLibrerias.EnviarMensajeTelegram(
        f"<b>Empezar</b> a crear Proxy de {Directorio}")

    Inicio = time.time()
    comando = ['bpsproxy']
    EstadoPreceso = EmpezarSubProceso(comando)

    Final = time.time()
    Tiempo = round(Final - Inicio)
    Tiempo = str(datetime.timedelta(seconds=Tiempo))
    if EstadoPreceso == 0:
        logger.info(f"Finalizo creacion de proxy {Tiempo} {Directorio}")
        MiLibrerias.EnviarMensajeTelegram(
            f"<b>Finalizo</b> creacion de proxy {Tiempo} - {Directorio}")
    else:
        logger.warning(
            f"ERROR {EstadoPreceso} creacion de proxy {Tiempo} {Directorio} ")
        MiLibrerias.EnviarMensajeTelegram(
            f"<b>ERROR</b> {EstadoPreceso} creacion de proxy {Tiempo} - {Directorio}")


def RenderizarVideo(Archivo):
    if not Archivo.endswith(".blend"):
        Archivo += ".blend"
    MiLibrerias.EnviarMensajeTelegram(
        f"Empezar a <b>Rendizar Video</b> {Archivo}")
    logger.info(f"Empezar a <b>Rendizar Video</b> {Archivo}")

    Inicio = time.time()
    comando = ['bpsrender', Archivo]
    EstadoPreceso = EmpezarSubProceso(comando)

    Final = time.time()
    Tiempo = round(Final - Inicio)
    Tiempo = str(datetime.timedelta(seconds=Tiempo))
    if EstadoPreceso == 0:
        logger.info(f"Finalizo la renderizacion {Tiempo} {Archivo}")
        MiLibrerias.EnviarMensajeTelegram(
            f"<b>Finalizo</b> la renderizacion " + Tiempo + " - " + Archivo)
        return True
    else:
        logger.info(
            f"ERROR {EstadoPreceso} la renderizacion {Tiempo} {Archivo} ")
        MiLibrerias.EnviarMensajeTelegram(
            f"<b>ERROR</b> {EstadoPreceso} la renderizacion {Tiempo} - {Archivo}")

    return False


def BorrarTemporalesBender(Directorio):
    """Borrar Archivos Temprales de Edicion de video en Blender."""
    logger.info(f"Emezando a borrar {Directorio}")

    Ruta_Actual = os.getcwd()
    num_directorios = 0

    for ruta, directorios, archivos in os.walk(Ruta_Actual, topdown=True):
        for directorio in directorios:
            if(directorio == Directorio):
                num_directorios += 1
                logger.info(f"Borrando {ruta}/{directorio}")
                shutil.rmtree(os.path.join(ruta, directorio))
    logger.info(f'Borrado {num_directorios} de {Directorio}')


def SuvirVideo(Archivo):
    """Sube video a Youtube."""
    if not Archivo.endswith(".mp4"):
        Archivo += ".mp4"

    MiLibrerias.EnviarMensajeTelegram(
        f"<b>Empezar</b> a subir video a YouTube - {Archivo}")

    Inicio = time.time()
    comando = ['tooltube.py', "-u", "-f", Archivo]
    EstadoPreceso = EmpezarSubProceso(comando)

    Final = time.time()
    Tiempo = round(Final - Inicio)
    Tiempo = str(datetime.timedelta(seconds=Tiempo))
    if EstadoPreceso == 0:
        logger.info(f"Se suvio el video {Tiempo} {Archivo}")
        MiLibrerias.EnviarMensajeTelegram(
            f"Video <b>Suvido</b> a Youtube {Archivo} Tardo: { Tiempo}")
        return True
    else:
        logger.info(
            f"ERROR {EstadoPreceso} no se puedo subir el video {Tiempo} {Archivo}")
        MiLibrerias.EnviarMensajeTelegram(
            f"<b>ERROR</b> {EstadoPreceso} no se puedo subir el video {Tiempo} - {Archivo}")

    return False
