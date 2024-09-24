from pydub import AudioSegment
import basket.miLibrerias as miLibrerias
import os

logger = miLibrerias.ConfigurarLogging(__name__)


def convertir_wav(archivo: str):
    if not (".mp4" in archivo):
        return False

    if not os.path.exists(archivo):
        logger.error(f"No se encontro el Archivo {archivo}")
        exit()

    nombreArchivo = archivo.replace(".mp4", ".waw")
    logger.info(f"Creando audio {nombreArchivo}")
    dataAudio = AudioSegment.from_file(archivo, format="mp4")
    dataAudio.export(nombreArchivo, format="wav")
    return nombreArchivo
