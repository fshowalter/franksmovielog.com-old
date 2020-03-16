from dataclasses import dataclass
from typing import Dict, List, Optional

from movie_db import _db, _downloader, _extractor, _validator, humanize
from movie_db.logger import logger

FILE_NAME = 'title.basics.tsv.gz'
TABLE_NAME = 'movies'


@dataclass
class Title(object):
    def __init__(self, fields: List[Optional[str]]) -> None:
        self.imdb_id = fields[0]
        self.title = fields[2]
        self.original_title = bool(fields[3])
        self.year = fields[5]
        self.runtime_minutes = fields[7]


def update() -> None:
    logger.log('==== Begin updating {}...', TABLE_NAME)

    downloaded_file_path = _downloader.download(FILE_NAME, _db.DB_DIR)

    for _ in _extractor.checkpoint(downloaded_file_path):
        movies = _extract_movies(downloaded_file_path)

        with _db.connect() as connection:
            _recreate_movies_table(connection)
            _insert_movies(connection, movies)
            _validator.validate_collection_to_table(connection, movies, TABLE_NAME)


def _insert_movies(connection: _db.Connection, movies: Dict[str, Title]) -> None:
    logger.log('Inserting {}...', TABLE_NAME)

    with _db.transaction(connection):
        connection.executemany("""
            INSERT INTO movies(id, title, year, runtime_minutes)
            VALUES(?, ?, ?, ?)""",
                               [
                                   (
                                       movie.imdb_id,
                                       movie.title,
                                       movie.year,
                                       movie.runtime_minutes,
                                   ) for movie in movies.values()
                               ])

    connection.execute('CREATE INDEX "index_{0}_on_title" ON "{0}" ("title");'.format(TABLE_NAME))


def _recreate_movies_table(connection: _db.Connection) -> None:
    logger.log('Recreating {} table...', TABLE_NAME)
    connection.executescript("""
        DROP TABLE IF EXISTS "movies";
        CREATE TABLE "movies" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "title" TEXT NOT NULL,
            "year" INT NOT NULL,
            "runtime_minutes" INT);
        """)


def _extract_movies(downloaded_file_path: str) -> Dict[str, Title]:
    movies: Dict[str, Title] = {}

    for fields in _extractor.extract(downloaded_file_path):
        if _title_is_valid(fields):
            movies[str(fields[0])] = Title(fields)

    logger.log('Extracted {} {}.', humanize.intcomma(len(movies)), TABLE_NAME)
    return movies


def _title_is_valid(title_line: List[Optional[str]]) -> bool:
    if title_line[1] != 'movie':
        return False
    if title_line[4] == '1':
        return False
    if title_line[5] is None:
        return False
    return True
