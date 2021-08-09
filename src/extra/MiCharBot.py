import os
import sys
import telegram
from pathlib import Path

from telegram import ParseMode

from extra.FuncionesArchivos import ObtenerValor

# ArchivoConfig = os.path.join(Path.home(), '.config/elgatoalsw')


def EnviarMensaje(Mensaje):
    """Envia un mensaje por telegram."""
    Token = ObtenerValor("data/TelegramBot.json", 'Token_Telegram')
    ID_Chat = ObtenerValor("data/TelegramBot.json", 'ID_Chat')
    bot = telegram.Bot(token=Token)
    bot.send_message(chat_id=ID_Chat, text=Mensaje, parse_mode=ParseMode.HTML)
