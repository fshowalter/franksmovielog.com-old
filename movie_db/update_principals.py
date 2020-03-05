from pathlib import Path
from typing import List, NamedTuple, Union

from queries.get_title_ids import get_title_ids
from utils.db import DB_DIR, Connection, db, transaction
from utils.download_imdb_file import download_imdb_file
from utils.extract_imdb_file import extract_imdb_file
from utils.humanize import intcomma
from utils.logger import logger

FILE_NAME = 'title.principals.tsv.gz'
TABLE_NAME = 'principals'


class Principal(NamedTuple):
    movie_id: str
    person_id: str
    sequence: int
    category: Union[str, None]
    job: Union[str, None]
    characters: Union[str, None]


def update_principals() -> None:
    logger.log('==== Begin updating {} ...', TABLE_NAME)

    downloaded_file_path = download_imdb_file(FILE_NAME, DB_DIR)
    success_file = Path('{0}._success'.format(downloaded_file_path))

    if (success_file.exists()):
        logger.log('Found {} file. Skipping load.', success_file)
        return

    principals = _extract_principals(downloaded_file_path)

    with db() as connection:
        _recreate_principals_table(connection)
        _insert_principals(connection, principals)
        _validate_principals(connection, principals)

    success_file.touch()


def _validate_principals(connection: Connection, collection: List[Principal]) -> None:
    inserted = connection.execute(
        'select count(*) from {0}'.format(TABLE_NAME),  # noqa: S608
        ).fetchone()[0]

    expected = len(collection)
    assert expected == inserted  # noqa: S101
    logger.log('Inserted {} {}.', intcomma(inserted), TABLE_NAME)


def _insert_principals(connection: Connection, principals: List[Principal]) -> None:
    logger.log('Inserting {}...', TABLE_NAME)

    with transaction(connection):
        connection.executemany(
            """
            INSERT INTO {0}(
              movie_id,
              sequence,
              person_id,
              category,
              job,
              characters)
            VALUES(?, ?, ?, ?, ?, ?)""".format(TABLE_NAME),
            principals,
        )


def _recreate_principals_table(connection: Connection) -> None:
    logger.log('Recreating {} table...', TABLE_NAME)
    connection.executescript("""
      DROP TABLE IF EXISTS "{0}";
      CREATE TABLE "{0}" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "movie_id" TEXT NOT NULL REFERENCES movies(id) DEFERRABLE INITIALLY DEFERRED,
        "person_id" TEXT NOT NULL REFERENCES people(id) DEFERRABLE INITIALLY DEFERRED,
        "sequence" INT NOT NULL,
        "category" TEXT,
        "job" TEXT,
        "characters" TEXT);
      """.format(TABLE_NAME),
    )


def _extract_principals(downloaded_file_path: str) -> List[Principal]:
    title_ids = get_title_ids()
    principals: List[Principal] = []

    for fields in extract_imdb_file(downloaded_file_path):
        if fields[0] in title_ids:

            principals.append(Principal(
                movie_id=fields[0],
                sequence=int(fields[1]),
                person_id=fields[2],
                category=_field_or_none(fields[3]),
                job=_field_or_none(fields[4]),
                characters=_field_or_none(fields[5]),
            ))

    logger.log('Extracted {} {}.', intcomma(len(principals)), TABLE_NAME)

    return principals


def _field_or_none(field: str) -> Union[str, None]:
    if field == r'\N':
        return None
    return field
