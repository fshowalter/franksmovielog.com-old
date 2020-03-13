from movie_db import _aka_titles, _crew, _names, _principals, _titles
from movie_db.logger import logger


@logger.catch
def download_and_update() -> None:
    _titles.update()
    _names.update()
    _crew.update()
    _aka_titles.update()
    _principals.update()
