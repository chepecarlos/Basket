import csv
from xml.dom import minidom

import basket.miLibrerias as miLibrerias
from basket.miLibrerias import FuncionesArchivos

logger = miLibrerias.ConfigurarLogging(__name__)


def transformarSubtitulos(archivo):
    logger.info("Empezando a transformar Subtitulos")
    documento = minidom.parse(archivo)
    lineas = documento.getElementsByTagName("p")

    archivoSubtitulo = "subtitulo.csv"

    with open(archivoSubtitulo, "w", encoding="UTF8") as f:
        escribir = csv.writer(f)

        for linea in lineas:
            inicio = linea.getAttribute("begin")
            fin = linea.getAttribute("end")
            mensaje = linea.firstChild.data
            print(f"Inicio: {linea.getAttribute('begin')}")
            print(f"Final:  {linea.getAttribute('end')}")
            print(f"Texto:  {linea.firstChild.data}")
            print("-" * 40)

            data = [inicio, fin, mensaje]

            escribir.writerow(data)
        pass
