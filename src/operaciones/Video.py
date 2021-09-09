import time
import datetime

from pathlib import Path

from extra.SubProceso import EmpezarSubProceso

import MiLibrerias
logger = MiLibrerias.ConfigurarLogging(__name__)


def ConvertirVideo(Video):
    NombreArchivo = Path(Video).stem
    RutaArchivo = Path(Video).parent
    SufijoArchivo = Path(Video).suffix
    Salida = f"{NombreArchivo}_60{SufijoArchivo}"
    logger.info(f"Empezando a convertir {Video}")

    Inicio = time.time()
    comando = ['ffmpeg', '-i', Video, '-r', '60', '-y', Salida]
    EstadoPreceso = EmpezarSubProceso(comando)

    Final = time.time()
    Tiempo = round(Final - Inicio)
    Tiempo = str(datetime.timedelta(seconds=Tiempo))
    if EstadoPreceso == 0:
        logger.info(
            f"Termino de convertir {Video} a {Salida}, tardo: {Tiempo}")
    else:
        logger.warning(f"ERROR en convertir")
