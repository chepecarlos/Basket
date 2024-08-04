from pydub import AudioSegment

def convertir_wav(archivo: str):
    if not (".mp4" in archivo):
        return False
        
    nombreArchivo = archivo.split(".")
    nombreArchivo = f"{nombreArchivo[0]}.waw"
    print(f"Creando {nombreArchivo}")
    dataAudio = AudioSegment.from_file(archivo, format="mp4")                  
    dataAudio.export(nombreArchivo, format="wav")
    return nombreArchivo
