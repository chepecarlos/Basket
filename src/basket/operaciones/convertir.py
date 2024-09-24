from pydub import AudioSegment
import basket.miLibrerias as miLibrerias

logger = miLibrerias.ConfigurarLogging(__name__)


def convertir_wav(archivo: str):
    if not (".mp4" in archivo):
        return False

    nombreArchivo = archivo.replace(".mp4", ".waw")
    logger.info(f"Creando audio {nombreArchivo}")
    dataAudio = AudioSegment.from_file(archivo, format="mp4")
    dataAudio.export(nombreArchivo, format="wav")
    return nombreArchivo
