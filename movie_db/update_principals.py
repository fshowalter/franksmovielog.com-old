from pathlib import Path
from typing import List

from principal import Principal
from queries.get_title_ids import get_title_ids
from utils.db import DB_DIR, db, transaction
from utils.download_imdb_file import download_imdb_file
from utils.extract_imdb_file import extract_imdb_file
from utils.humanize import intcomma
from utils.logger import logger

FILE_NAME = 'title.principals.tsv.gz'
TABLE_NAME = 'principals'


def update_principals():
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


def _validate_principals(connection, collection):
    inserted = connection.execute(
        'select count(*) from {0}'.format(TABLE_NAME),  # noqa: S608
        ).fetchone()[0]

    expected = len(collection)
    assert expected == inserted  # noqa: S101
    logger.log('Inserted {} {}.', intcomma(inserted), TABLE_NAME)


def _insert_principals(connection, aka_titles):
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
            aka_titles,
        )


def _recreate_principals_table(connection):
    logger.log('Recreating {} table...', TABLE_NAME)
    connection.executescript("""
      DROP TABLE IF EXISTS "{0}";
      CREATE TABLE "{0}" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "movie_id" TEXT NOT NULL,
        "person_id" TEXT NOT NULL,
        "sequence" INT NOT NULL,
        "category" TEXT,
        "job" TEXT,
        "characters" TEXT);
      """.format(TABLE_NAME),
    )


def _extract_principals(downloaded_file_path) -> List[Principal]:
    title_ids = get_title_ids()
    principals: List[Principal] = []

    for fields in extract_imdb_file(downloaded_file_path):
        if fields[0] in title_ids:
            for index, field_value in enumerate(fields):
                if field_value == r'\N':
                    fields[index] = None

            principals.append(Principal(
                movie_id=fields[0],
                sequence=fields[1],
                person_id=fields[2],
                category=fields[3],
                job=fields[4],
                characters=fields[5],
            ))

    logger.log('Extracted {} {}.', intcomma(len(principals)), TABLE_NAME)

    return principals
