from movie_db import _aka_titles, _credits, _movies, _people, _principals
from movie_db.logger import logger


@logger.catch
def orchestrate_update() -> None:
    _movies.update()
    _people.update()
    _credits.update()
    _aka_titles.update()
    _principals.update()
