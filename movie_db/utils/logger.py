import sys as _sys
import types

from loguru import logger as _base_logger

LOGGER_CONFIG = types.MappingProxyType({
    'handlers': [
        {
            'sink': _sys.stdout,
            'format': '<green>{elapsed}</green> | ' +
            '<level>{message}</level> ' +
            '(<cyan>{file}</cyan>:<cyan>{line}</cyan>)',
        },
    ],
})

_base_logger.configure(**LOGGER_CONFIG)


class ExtendedLogger(object):
    def __init__(self, _logger):
        self.logger = _logger

    def log(self, message, *args, **kwargs):
        message_with_color = message.replace('{}', '<green>{}</green>')
        return self.logger.opt(colors=True, depth=1).info(message_with_color, *args, **kwargs)

    def catch(
        self,
        exception=Exception,
        *,
        level='ERROR',
        reraise=False,
        message="An error has been caught in function '{record[function]}', " +
            "process '{record[process].name}' ({record[process].id}), " +
            "thread '{record[thread].name}' ({record[thread].id}):",
    ):
        return self.logger.catch(exception)


logger = ExtendedLogger(_base_logger.opt(colors=True))
