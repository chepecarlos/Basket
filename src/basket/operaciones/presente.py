import basket.miLibrerias as miLibrerias
import pyclip

logger = miLibrerias.ConfigurarLogging(__name__)


def cargarPresente(archivo):
    Data = miLibrerias.ObtenerArchivo(archivo, False)
    if Data is None:
        logger.warning("Erro no hay Presente")
        return
    texto = "asistencia:\n"
    for id in Data:
        texto += "  - title: " + Data[id] + "\n"
        texto += "    canal: " + id + "\n"
    print(texto)
    logger.info("Ya copia en portapapeles")
    pyclip.copy(texto)
