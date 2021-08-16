"""Librerias para mandar mensajes de telegram"""
import telegram

from telegram import ParseMode

from .FuncionesArchivos import ObtenerValor

from .FuncionesLogging import ConfigurarLogging

logger = ConfigurarLogging(__name__)


def EnviarMensajeTelegram(Mensaje):
    """Envia un mensaje por telegram."""
    Token = ObtenerValor("data/TelegramBot.json", 'Token_Telegram')
    ID_Chat = ObtenerValor("data/TelegramBot.json", 'ID_Chat')
    if Token is None or ID_Chat is None:
        logger.error("No hay token de telegram")
        return

    bot = telegram.Bot(token=Token)
    bot.send_message(chat_id=ID_Chat, text=Mensaje, parse_mode=ParseMode.HTML)
