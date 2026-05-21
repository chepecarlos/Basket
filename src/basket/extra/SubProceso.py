import subprocess
import basket.miLibrerias as miLibrerias
import bpsrender

logger = miLibrerias.ConfigurarLogging(__name__)


def EmpezarSubProceso(Comando):
    """Crear nuevo Sub Proceso."""

    process = subprocess.Popen(Comando, stdout=subprocess.PIPE, universal_newlines=True)

    while True:
        output = process.stdout.readline()
        logger.info(output.strip())
        return_code = process.poll()
        if return_code is not None:
            logger.info(f"RETURN CODE {return_code}")
            for output in process.stdout.readlines():
                logger.info(output.strip())
            return return_code
