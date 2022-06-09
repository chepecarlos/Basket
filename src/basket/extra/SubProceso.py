import subprocess

def EmpezarSubProceso(Comando):
    """Crear nuevo Sub Proceso."""
    process = subprocess.Popen(Comando, stdout=subprocess.PIPE, universal_newlines=True)

    while True:
        output = process.stdout.readline()
        print(output.strip())
        return_code = process.poll()
        if return_code is not None:
            print(f'RETURN CODE {return_code}')
            for output in process.stdout.readlines():
                print(output.strip())
            return return_code
            break
