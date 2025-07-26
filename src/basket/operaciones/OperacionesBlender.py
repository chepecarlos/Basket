import datetime
import os
import shutil
import time

import basket.miLibrerias as miLibrerias
from basket.extra.SubProceso import EmpezarSubProceso

logger = miLibrerias.ConfigurarLogging(__name__)


def CrearProxy(Directorio):
    miLibrerias.EnviarMensajeTelegram(f"*Empezar* a crear Proxy de {Directorio}")

    Inicio = time.time()
    comando = ["bpsproxy"]
    EstadoPreceso = EmpezarSubProceso(comando)

    Final = time.time()
    Tiempo = round(Final - Inicio)
    Tiempo = str(datetime.timedelta(seconds=Tiempo))
    if EstadoPreceso == 0:
        logger.info(f"Finalizo creacion de proxy {Tiempo} {Directorio}")
        miLibrerias.EnviarMensajeTelegram(f"*Finalizo* creacion de proxy {Tiempo} - {Directorio}")
    else:
        logger.warning(f"ERROR {EstadoPreceso} creacion de proxy {Tiempo} {Directorio} ")
        miLibrerias.EnviarMensajeTelegram(f"*ERROR* {EstadoPreceso} creacion de proxy {Tiempo} - {Directorio}")


def RenderizarVideo(Archivo: str)-> bool:
    """Renderizar Video con Blender."""
    # TODO ver si archivo existe 
    if not Archivo.endswith(".blend"):
        Archivo += ".blend"
    miLibrerias.EnviarMensajeTelegram(f"Empezar a *Rendizar Video* {Archivo}")
    logger.info(f"Empezar a *Renderizar Video* {Archivo}")

    Inicio = time.time()
    comando = ["bpsrender", "-vvv", Archivo]
    EstadoPreceso = EmpezarSubProceso(comando)

    Final = time.time()
    Tiempo = round(Final - Inicio)
    Tiempo = str(datetime.timedelta(seconds=Tiempo))
    if EstadoPreceso == 0:
        logger.info(f"Finalizo la renderizacion {Tiempo} {Archivo}")
        miLibrerias.EnviarMensajeTelegram(f"*Finalizo* la renderizacion " + Tiempo + " - " + Archivo)
        return True
    else:
        logger.info(f"ERROR {EstadoPreceso} la renderizacion {Tiempo} {Archivo} ")
        miLibrerias.EnviarMensajeTelegram(f"*ERROR* {EstadoPreceso} la renderizacion {Tiempo} - {Archivo}")

    return False

def RenderizarAudio(Archivo: str)-> bool:
    """Renderizar Audio con Blender."""
    # TODO ver si archivo existe 
    if not Archivo.endswith(".blend"):
        Archivo += ".blend"
    miLibrerias.EnviarMensajeTelegram(f"Empezar a *Rendizar Audio* {Archivo}")
    logger.info(f"Empezar a *Renderizar Audio* {Archivo}")

    Inicio = time.time()
    comando = ["bpsrender", "-m", "-vvv", Archivo]
    EstadoPreceso = EmpezarSubProceso(comando)

    Final = time.time()
    Tiempo = round(Final - Inicio)
    Tiempo = str(datetime.timedelta(seconds=Tiempo))
    if EstadoPreceso == 0:
        logger.info(f"Finalizo la renderizacion {Tiempo} {Archivo}")
        miLibrerias.EnviarMensajeTelegram(f"*Finalizo* la renderizacion " + Tiempo + " - " + Archivo)
        return True
    else:
        logger.info(f"ERROR {EstadoPreceso} la renderizacion {Tiempo} {Archivo} ")
        miLibrerias.EnviarMensajeTelegram(f"*ERROR* {EstadoPreceso} la renderizacion {Tiempo} - {Archivo}")

    return False

def BorrarTemporalesBender(Directorio):
    """Borrar Archivos Temprales de Edicion de video en Blender."""
    logger.info(f"Emezando a borrar {Directorio}")

    Ruta_Actual = os.getcwd()
    num_directorios = 0

    for ruta, directorios, archivos in os.walk(Ruta_Actual, topdown=True):
        for directorio in directorios:
            if directorio == Directorio:
                num_directorios += 1
                logger.info(f"Borrando {ruta}/{directorio}")
                shutil.rmtree(os.path.join(ruta, directorio))
    logger.info(f"Borrado {num_directorios} de {Directorio}")


def remove_suffix(input_string, suffix):
    if suffix and input_string.endswith(suffix):
        return input_string[: -len(suffix)]
    return input_string


def SubirVideo(Archivo, Canal=None):
    """Sube video a Youtube."""
    # if ytArchivo)
    # print(f"tipo: {type(Archivo)}")
    if Archivo.endswith(".blend"):
        Archivo = remove_suffix(Archivo, ".blend")
        # Archivo = Archivo.removesuffix(".blend")
        # BUG: problema con python 3.8.x necesario 3.9.x
        # https://stackoverflow.com/questions/66683630/removesuffix-returns-error-str-object-has-no-attribute-removesuffix
        print(f"Quitando .blend {Archivo}")

    if not Archivo.endswith(".mp4"):
        Archivo += ".mp4"

    miLibrerias.EnviarMensajeTelegram(f"*Empezar* a subir video a YouTube - {Archivo}")

    Inicio = time.time()
    if Canal is not None:
        comando = ["tooltube", "--uploader", Archivo, "--cana", Canal]
        logger.info(f"Canal: {Canal}")
    else:
        comando = ["tooltube", "--uploader", Archivo]
        
    EstadoPreceso = EmpezarSubProceso(comando)

    Final = time.time()
    Tiempo = round(Final - Inicio)
    Tiempo = str(datetime.timedelta(seconds=Tiempo))
    if EstadoPreceso == 0:
        logger.info(f"Se subió el video {Tiempo} {Archivo}")
        miLibrerias.EnviarMensajeTelegram(f"Video *Subido* a Youtube {Archivo} Tardo: { Tiempo}")
        return True
    else:
        logger.info(f"ERROR {EstadoPreceso} no se puedo subir el video {Tiempo} {Archivo}")
        miLibrerias.EnviarMensajeTelegram(
            f"*ERROR* {EstadoPreceso} no se puedo subir el video {Tiempo} - {Archivo}"
        )

    return False
