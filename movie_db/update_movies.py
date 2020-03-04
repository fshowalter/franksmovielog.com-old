from pathlib import Path
from typing import Dict, List

from movie import Movie
from utils.db import DB_DIR, db, transaction
from utils.download_imdb_file import download_imdb_file
from utils.extract_imdb_file import extract_imdb_file
from utils.humanize import intcomma
from utils.logger import logger

FILE_NAME = 'title.basics.tsv.gz'
TABLE_NAME = 'movies'


def update_movies():
    logger.log('==== Begin updating {}...', TABLE_NAME)

    downloaded_file_path = download_imdb_file(FILE_NAME, DB_DIR)
    success_file = Path('{0}._success'.format(downloaded_file_path))

    if (success_file.exists()):
        logger.log('Found {} file. Skipping load.', success_file)
        return

    movies = _extract_movies(downloaded_file_path)
    inserted = 0

    with db() as connection:
        _recreate_movies_table(connection)
        _insert_movies(connection, movies)
        inserted = connection.execute(
            'select count(*) from {0}'.format(TABLE_NAME),  # noqa: S608
            ).fetchone()[0]

    _validate_inserted(inserted, movies)
    success_file.touch()


def _validate_inserted(inserted, collection):
    expected = len(collection)
    assert expected == inserted  # noqa: S101
    logger.log('Inserted {} {}.', intcomma(inserted), TABLE_NAME)


def _insert_movies(connection, movies):
    logger.log('Inserting {}...', TABLE_NAME)

    with transaction(connection):
        connection.executemany("""
            INSERT INTO movies(id, title, year, runtime_minutes)
            VALUES(?, ?, ?, ?)""",
                               [
                                   (
                                       imdb_id,
                                       movie.title,
                                       movie.year,
                                       movie.runtime_minutes,
                                   ) for (imdb_id, movie) in movies.items()
                               ])


def _recreate_movies_table(connection):
    logger.log('Recreating {} table...', TABLE_NAME)
    connection.executescript("""
        DROP TABLE IF EXISTS "movies";
        CREATE TABLE "movies" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "title" TEXT NOT NULL,
            "year" INT NOT NULL,
            "runtime_minutes" INT);
        """)


def _extract_movies(downloaded_file_path):
    movies: Dict[str, Movie] = {}

    for fields in extract_imdb_file(downloaded_file_path):
        if _title_is_valid(fields):
            movies[fields[0]] = Movie(
                title=fields[2],
                original_title=fields[3],
                year=fields[5],
                runtime_minutes=fields[7],
            )

    logger.log('Extracted {} {}.', intcomma(len(movies)), TABLE_NAME)
    return movies


def _title_is_valid(title_line: List[str]) -> bool:
    if title_line[1] != 'movie':
        return False
    if title_line[4] == '1':
        return False
    if title_line[5] == r'\N':
        return False
    return True
