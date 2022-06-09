import matplotlib.pyplot as plt
import pandas as pd


def graficaSun(Archivo):

    data = pd.read_csv(Archivo)
    etiquetaFecha = data.columns[0]

    data[etiquetaFecha] = pd.to_datetime(data[etiquetaFecha])
    data.sort_values(etiquetaFecha, inplace=True)

    etiqueta = data.columns[1]
    fechas = data[etiquetaFecha]
    valores = data[etiqueta]

    sum7 = []
    sum30 = []
    cantidad = len(valores)
    for id in range(len(valores)):
        sum7.append(0)
        sum30.append(0)
        for j in range(id - 6, id + 1):
            if j >= 0 and j < cantidad:
                sum7[id] += valores[j]
        for j in range(id - 29, id + 1):
            if j >= 0 and j < cantidad:
                sum30[id] += valores[j]

    fig, axs = plt.subplots(3, 1)

    axs[0].plot(fechas, valores, label=etiqueta)
    axs[0].plot(fechas, sum7, label=f"Suma7 {etiqueta}")
    axs[0].plot(fechas, sum30, label=f"Suma30 {etiqueta}")
    axs[0].grid(axis="y", color="gray", linestyle="dashed")
    axs[0].set_xlabel(etiquetaFecha)
    axs[0].set_ylabel(etiqueta)
    axs[0].legend(loc="upper left")

    axs[1].plot(fechas, valores, label=etiqueta)
    axs[1].plot(fechas, sum7, label=f"Suma7 {etiqueta}")
    axs[1].grid(axis="y", color="gray", linestyle="dashed")
    axs[1].set_xlabel(etiquetaFecha)
    axs[1].set_ylabel(etiqueta)
    axs[1].legend(loc="upper left")

    axs[2].plot(fechas, valores, label=etiqueta)
    axs[2].grid(axis="y", color="gray", linestyle="dashed")
    axs[2].set_xlabel(etiquetaFecha)
    axs[2].set_ylabel(etiqueta)
    axs[2].legend(loc="upper left")

    plt.gcf().autofmt_xdate()

    plt.tight_layout()
    fig.suptitle(f"Gráfica suma7 y suma30 de {etiqueta}", y=0.99, fontsize=10)
    plt.show()
