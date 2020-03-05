from __future__ import annotations

import sys as _sys
import types
from typing import Any, Tuple, Type, Union

import loguru
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
    def __init__(self, _logger: loguru.Logger):
        self.logger = _logger

    def log(self, message: str, *args: Any, **kwargs: Any) -> None:
        message_with_color = message

        if message.startswith('==== '):
            message_with_color = message.replace(
                '====', '<yellow>====</yellow>',
            ).replace('{}', '<yellow>{}</yellow>')
        else:
            message_with_color = message.replace('{}', '<green>{}</green>')

        self.logger.opt(colors=True, depth=1).info(message_with_color, *args, **kwargs)

    def catch(
        self,
        exception: Union[Type[BaseException], Tuple[Type[BaseException], ...]] = Exception,  # noqa: WPS221, E501, TAE002
        *,
        level: str = 'ERROR',
        reraise: bool = False,
        message: str = "An error has been caught in function '{record[function]}', " +
            "process '{record[process].name}' ({record[process].id}), " +
            "thread '{record[thread].name}' ({record[thread].id}):",
    ) -> loguru.Catcher:
        return self.logger.catch(exception=exception, level=level, reraise=reraise, message=message)


logger: ExtendedLogger = ExtendedLogger(_base_logger.opt(colors=True))
