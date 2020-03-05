from pathlib import Path
from typing import List, NamedTuple, Union

from queries.get_title_ids import get_title_ids
from utils.db import DB_DIR, Connection, db, transaction
from utils.download_imdb_file import download_imdb_file
from utils.extract_imdb_file import extract_imdb_file
from utils.humanize import intcomma
from utils.logger import logger

FILE_NAME = 'title.akas.tsv.gz'
TABLE_NAME = 'aka_titles'


class AkaTitle(NamedTuple):
    movie_id: str
    sequence: int
    title: str
    region: Union[str, None]
    language: Union[str, None]
    types: Union[str, None]
    attributes: Union[str, None]
    is_original_title: Union[str, None]


def update_aka_titles() -> None:
    logger.log('==== Begin updating {} ...', TABLE_NAME)

    downloaded_file_path = download_imdb_file(FILE_NAME, DB_DIR)
    success_file = Path('{0}._success'.format(downloaded_file_path))

    if (success_file.exists()):
        logger.log('Found {} file. Skipping load.', success_file)
        return

    aka_titles = _extract_aka_titles(downloaded_file_path)

    with db() as connection:
        _recreate_aka_titles_table(connection)
        _insert_aka_titles(connection, aka_titles)
        _validate_aka_titles(connection, aka_titles)

    success_file.touch()


def _validate_aka_titles(connection: Connection, collection: List[AkaTitle]) -> None:
    inserted = connection.execute(
        'select count(*) from {0}'.format(TABLE_NAME),  # noqa: S608
        ).fetchone()[0]

    expected = len(collection)
    assert expected == inserted  # noqa: S101
    logger.log('Inserted {} {}.', intcomma(inserted), TABLE_NAME)


def _insert_aka_titles(connection: Connection, aka_titles: List[AkaTitle]) -> None:
    logger.log('Inserting {}...', TABLE_NAME)

    with transaction(connection):
        connection.executemany(
            """
            INSERT INTO aka_titles(
              movie_id,
              sequence,
              title,
              region,
              language,
              types,
              attributes,
              is_original_title)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)""",
            aka_titles,
        )


def _recreate_aka_titles_table(connection: Connection) -> None:
    logger.log('Recreating {} table...', TABLE_NAME)
    connection.executescript("""
      DROP TABLE IF EXISTS "{0}";
      CREATE TABLE "{0}" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "movie_id" TEXT NOT NULL REFERENCES movies(id) DEFERRABLE INITIALLY DEFERRED,
        "sequence" INT NOT NULL,
        "title" TEXT NOT NULL,
        "region" TEXT,
        "language" TEXT,
        "types" TEXT,
        "attributes" TEXT,
        is_original_title BOOLEAN DEFAULT FALSE);
      """.format(TABLE_NAME),
    )


def _extract_aka_titles(downloaded_file_path: str) -> List[AkaTitle]:
    title_ids = get_title_ids()
    aka_titles: List[AkaTitle] = []

    for fields in extract_imdb_file(downloaded_file_path):
        if fields[0] in title_ids:
            aka_titles.append(AkaTitle(
                movie_id=fields[0],
                sequence=int(fields[1]),
                title=fields[2],
                region=fields[3],
                language=fields[4],
                types=fields[5],
                attributes=fields[6],
                is_original_title=fields[7],
            ))

    logger.log('Extracted {} {}.', intcomma(len(aka_titles)), TABLE_NAME)

    return aka_titles
