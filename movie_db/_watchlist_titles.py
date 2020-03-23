from dataclasses import asdict, dataclass
from typing import List, Optional, Type

from movie_db import _table_base, _watchlist
from movie_db.logger import logger

TABLE_NAME = 'watchlist_titles'


@dataclass
class WatchlistTitle(object):
    movie_imdb_id: str
    director_imdb_id: Optional[str] = None
    performer_imdb_id: Optional[str] = None
    writer_imdb_id: Optional[str] = None
    collection_name: Optional[str] = None

    @classmethod
    def titles_for_item_type(cls, item_type: Type[_watchlist.Base]) -> List['WatchlistTitle']:
        titles: List['WatchlistTitle'] = []
        watchlist_items = item_type.all_items()
        for watchlist_item in watchlist_items:
            for title in watchlist_item.titles:
                watchlist_title = WatchlistTitle(movie_imdb_id=title.imdb_id)
                cls.set_identifier_for_collection_type(watchlist_item, watchlist_title)
                titles.append(watchlist_title)
        return titles

    @classmethod
    def set_identifier_for_collection_type(
        cls,
        watchlist_item: _watchlist.Base,
        watchlist_title: 'WatchlistTitle',
    ) -> None:
        if isinstance(watchlist_item, _watchlist.Collection):
            watchlist_title.collection_name = watchlist_item.name  # noqa: WPS601
        if isinstance(watchlist_item, _watchlist.Director):
            watchlist_title.director_imdb_id = watchlist_item.imdb_id  # noqa: WPS601
        if isinstance(watchlist_item, _watchlist.Performer):
            watchlist_title.performer_imdb_id = watchlist_item.imdb_id  # noqa: WPS601
        if isinstance(watchlist_item, _watchlist.Writer):
            watchlist_title.writer_imdb_id = watchlist_item.imdb_id  # noqa: WPS601


class WatchlistTitlesTable(_table_base.TableBase):
    def __init__(self) -> None:
        super().__init__(TABLE_NAME)

    def drop_and_create(self) -> None:
        ddl = """
        DROP TABLE IF EXISTS "{0}";
        CREATE TABLE "{0}" (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            "movie_imdb_id" TEXT NOT NULL
                REFERENCES movies(imdb_id) DEFERRABLE INITIALLY DEFERRED,
            "director_imdb_id" TEXT
                REFERENCES people(imdb_id) DEFERRABLE INITIALLY DEFERRED,
            "performer_imdb_id" TEXT
                REFERENCES people(imdb_id) DEFERRABLE INITIALLY DEFERRED,
            "writer_imdb_id" TEXT
                REFERENCES people(imdb_id) DEFERRABLE INITIALLY DEFERRED,
            "collection_name" TEXT);
        """.format(TABLE_NAME)

        super()._drop_and_create(ddl)

    def insert(self, titles: List[WatchlistTitle]) -> None:
        ddl = """
          INSERT INTO {0}(
              movie_imdb_id,
              director_imdb_id,
              performer_imdb_id,
              writer_imdb_id,
              collection_name)
          VALUES(
              :movie_imdb_id,
              :director_imdb_id,
              :performer_imdb_id,
              :writer_imdb_id,
              :collection_name);
        """.format(TABLE_NAME)

        parameter_seq = [asdict(title) for title in titles]

        super()._insert(ddl=ddl, parameter_seq=parameter_seq)
        super()._add_index('movie_imdb_id')
        super()._add_index('director_imdb_id')
        super()._add_index('performer_imdb_id')
        super()._add_index('writer_imdb_id')
        super()._validate(titles)


@logger.catch
def update() -> None:
    logger.log('==== Begin updating {}...', TABLE_NAME)

    watchlist_titles_table = WatchlistTitlesTable()
    watchlist_titles_table.drop_and_create()

    item_types: List[Type[_watchlist.Base]] = [
        _watchlist.Collection,
        _watchlist.Director,
        _watchlist.Performer,
        _watchlist.Writer,
    ]

    titles: List[WatchlistTitle] = []

    for item_type in item_types:
        titles.extend(WatchlistTitle.titles_for_item_type(item_type))
    watchlist_titles_table.insert(titles)


if __name__ == '__main__':
    update()
