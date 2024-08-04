import speech_recognition as sr
import os
from pydub import AudioSegment
from basket.miLibrerias.FuncionesArchivos import EscribirArchivo


def crearSubtituloSBV(archivo: str, segundos: int = 2):

    audio = AudioSegment.from_file(archivo)
    millisegundo = int(1000 * segundos)
    partes = [audio[i:i + millisegundo]
              for i in range(0, len(audio), millisegundo)]
    folderAudios = "audio_temporal"

    if not os.path.isdir(folderAudios):
        os.mkdir(folderAudios)

    textoCompleto = ""

    for i, parteAudio in enumerate(partes, start=1):

        archivoParte = os.path.join(folderAudios, f"parte_{i}.wav")
        parteAudio.export(archivoParte, format="wav")

        try:
            texto = extraerAudio(archivoParte)
        except sr.UnknownValueError as e:
            print("Error:", str(e))
        else:
            textoCompleto += f"{trasformarHoras(segundos*(i-1))},{trasformarHoras(segundos*i)}\n"
            textoCompleto += f"{texto}\n\n"
            print(f" Procesando: {i}/{len(partes)}", end="\r")
    print()
    EscribirArchivo("subtitulo.txt", textoCompleto)
    os.rename('subtitulo.txt', 'subtitulo.sbv')


def extraerAudio(archivo: str) -> str:
    r = sr.Recognizer()
    with sr.AudioFile(archivo) as archivoAudio:
        audio = r.record(archivoAudio)
        texto = r.recognize_google(audio, language="es-ES")
    return texto


def trasformarHoras(segundos: int) -> str:
    hora: int = 0
    minuto: int = 0
    segundo: int = 0
    milisegundo: int = 0

    minuto = (segundos - (segundos % 60))/60
    hora = (minuto - (minuto % 60))/60
    minuto = minuto % 60
    segundo = segundos % 60

    return f"{int(hora)}:{int(minuto)}:{int(segundo)}.{int(milisegundo)}"
