from movie_db.utils.logger import logger
from movie_db.watchlist.watchlist_item import WatchlistItem
from movie_db.watchlist.write_watchlist_item import write_watchlist_item


def add_director(director: WatchlistItem) -> None:
    director_file = write_watchlist_item(
        entity_type='directors',
        watchlist_item=director,
        slug=director.name,
    )

    logger.log('Wrote {} ({}) to {}', director.name, director.id, director_file)
