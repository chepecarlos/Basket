import matplotlib.pyplot as plt
import pandas as pd

import basket.miLibrerias as miLibrerias

logger = miLibrerias.ConfigurarLogging(__name__)


def graficaSun(Archivo):

    data = pd.read_csv(Archivo)

    etiquetaFecha = data.columns[0]

    data[etiquetaFecha] = pd.to_datetime(data[etiquetaFecha])

    inicioMes = []
    etiquetaMes = []
    for dia in data[etiquetaFecha]:
        if dia.is_month_start:
            inicioMes.append(dia)
            etiquetaMes.append(f"{dia.month}/{dia.year}")

    data.sort_values(etiquetaFecha, inplace=True)

    etiqueta = data.columns[1]
    fechas = data[etiquetaFecha]
    valores = data[etiqueta]

    # como crear un dataframe vacillo
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

    offset = 10
    bbox = dict(boxstyle="round", fc="0.8")
    arrowprops = dict(arrowstyle="->", connectionstyle="angle,angleA=0,angleB=90,rad=10")

    [min30, max30] = encontrarMaxMin(sum30[30:])
    grafica30 = axs[0]
    grafica30.plot(fechas, valores, label=etiqueta)
    grafica30.plot(fechas, sum7, label=f"Suma7")
    grafica30.plot(fechas, sum30, label=f"Suma30")
    grafica30.grid(axis="both", color="gray", linestyle="dashed")
    grafica30.set_xlabel(etiquetaFecha)
    grafica30.set_ylabel(etiqueta)
    grafica30.legend(loc="upper left")
    # graficaAbajo.annotate(
    #     f"Anonacion Especial",
    #     xy=(fechas[0], valores[0]),
    #     # xycoords="figure pixels",
    #     xytext=(0.5 * offset, -offset),
    #     textcoords="offset points",
    #     bbox=bbox,
    #     arrowprops=arrowprops,
    # )
    # logger.info(fechas)
    grafica30.hlines(max30, fechas.iloc[30], fechas.iloc[-1], colors="#000000")
    grafica30.hlines(min30, fechas.iloc[30], fechas.iloc[-1], colors="#ff0000")

    # grafica30.vlines([fechas[0]], 0, 1, transform=graficaAbajo.get_xaxis_transform(), colors="r")

    [min30, max30] = encontrarMaxMin(sum7[30:])
    grafica7 = axs[1]
    grafica7.plot(fechas, valores, label=etiqueta)
    grafica7.plot(fechas, sum7, label=f"Suma7")
    grafica7.grid(axis="both", color="gray", linestyle="dashed")
    grafica7.set_xlabel(etiquetaFecha)
    grafica7.set_ylabel(etiqueta)
    grafica7.legend(loc="upper left")
    grafica7.hlines(max30, fechas.iloc[7], fechas.iloc[-1], colors="#000000")
    grafica7.hlines(min30, fechas.iloc[7], fechas.iloc[-1], colors="#ff0000")

    [min30, max30] = encontrarMaxMin(valores)
    graficaNormal = axs[2]
    graficaNormal.plot(fechas, valores, label=etiqueta)
    graficaNormal.grid(axis="both", color="gray", linestyle="dashed")
    graficaNormal.set_xlabel(etiquetaFecha)
    graficaNormal.set_ylabel(etiqueta)
    graficaNormal.legend(loc="upper left")
    graficaNormal.hlines(max30, fechas.iloc[0], fechas.iloc[-1], colors="#000000")
    graficaNormal.hlines(min30, fechas.iloc[0], fechas.iloc[-1], colors="#ff0000")

    plt.xticks(inicioMes, etiquetaMes)
    plt.gcf().autofmt_xdate()

    plt.tight_layout()
    fig.suptitle(f"Gráfica suma7 y suma30 de {etiqueta}", y=0.99, fontsize=10)
    plt.show()


def encontrarMaxMin(valores):
    max30 = valores[0]
    min30 = valores[0]
    for valor in valores:
        if min30 < valor:
            min30 = valor
        if max30 > valor:
            max30 = valor
    logger.info(f"max {max30} - min {min30}")
    return (min30, max30)
