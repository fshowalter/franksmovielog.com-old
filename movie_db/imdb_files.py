from movie_db.internal import aka_titles, crew_credits, movies, people, principals
from movie_db.logger import logger


@logger.catch
def orchestrate_update() -> None:
    movies.update()
    people.update()
    crew_credits.update()
    aka_titles.update()
    principals.update()
