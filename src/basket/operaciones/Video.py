import datetime
import time
from pathlib import Path

import basket.miLibrerias as miLibrerias
from basket.extra.SubProceso import EmpezarSubProceso

logger = miLibrerias.ConfigurarLogging(__name__)

# Cortar Video de inicio y fin
# ffmpeg -i "Fin_de_Semana_Mecatrónico_2.0_Día_1_60.mkv" -ss 01:08:40 -to 2:27:48 -vcodec copy -acodec copy "ChepeCarlos_1.mkv"
#  basket-video -cortar -f video.mkv -i 01:08:40 -f 2:27:48
#  basket-video -c -f video.mkv -i 01:08:40 -f 2:27:48

# basket-video -t -f video.mkd -fps 60


def ConvertirVideo(Video):
    NombreArchivo = Path(Video).stem
    RutaArchivo = Path(Video).parent
    SufijoArchivo = Path(Video).suffix
    Salida = f"{NombreArchivo}_60{SufijoArchivo}"
    logger.info(f"Empezando a convertir {Video}")

    Inicio = time.time()
    comando = ["ffmpeg", "-i", Video, "-r", "60", "-y", Salida]
    EstadoPreceso = EmpezarSubProceso(comando)

    Final = time.time()
    Tiempo = round(Final - Inicio)
    Tiempo = str(datetime.timedelta(seconds=Tiempo))
    if EstadoPreceso == 0:
        logger.info(f"Termino de convertir {Video} a {Salida}, tardo: {Tiempo}")
    else:
        logger.warning(f"ERROR en convertir")
