from pathlib import Path
from typing import Iterable, List, NamedTuple, Tuple

from queries.get_title_ids import get_title_ids
from utils.db import DB_DIR, Connection, db, transaction
from utils.download_imdb_file import download_imdb_file
from utils.extract_imdb_file import extract_imdb_file
from utils.humanize import intcomma
from utils.logger import logger

FILE_NAME = 'title.crew.tsv.gz'
DIRECTING_CREDITS_TABLE_NAME = 'directing_credits'
WRITING_CREDITS_TABLE_NAME = 'writing_credits'


class Credit(NamedTuple):
    movie_id: str
    person_id: str
    sequence: int


def update_directing_and_writing_credits() -> None:
    logger.log(
        '==== Begin updating {} and {}...',
        DIRECTING_CREDITS_TABLE_NAME,
        WRITING_CREDITS_TABLE_NAME,
    )

    downloaded_file_path = download_imdb_file(FILE_NAME, DB_DIR)
    success_file = Path('{0}._success'.format(downloaded_file_path))

    if (success_file.exists()):
        logger.log('Found {} file. Skipping load.', success_file)
        return

    directing_credits, writing_credits = _extract_credits(downloaded_file_path)

    with db() as connection:
        _recreate_credits_table(connection, DIRECTING_CREDITS_TABLE_NAME)
        _insert_to_credits_table(connection, directing_credits, DIRECTING_CREDITS_TABLE_NAME)
        _validate_credits(connection, directing_credits, DIRECTING_CREDITS_TABLE_NAME)
        _recreate_credits_table(connection, WRITING_CREDITS_TABLE_NAME)
        _insert_to_credits_table(connection, writing_credits, WRITING_CREDITS_TABLE_NAME)
        _validate_credits(connection, writing_credits, WRITING_CREDITS_TABLE_NAME)

    success_file.touch()


def _validate_credits(connection: Connection, collection: List[Credit], table_name: str) -> None:
    inserted = connection.execute(
        'select count(*) from {0}'.format(table_name),  # noqa: S608
        ).fetchone()[0]

    expected = len(collection)
    assert expected == inserted  # noqa: S101
    logger.log('Inserted {} {}.', intcomma(inserted), table_name)


def _insert_to_credits_table(
    connection: Connection,
    credits: Iterable[Credit],
    table_name: str,
) -> None:
    logger.log('Inserting {}...', table_name)

    with transaction(connection):
        connection.executemany(
            'INSERT INTO {0}(movie_id, person_id, sequence) VALUES(?, ?, ?)'.format(table_name),
            credits,
        )


def _recreate_credits_table(connection: Connection, table_name: str) -> None:
    logger.log('Recreating {} table...', table_name)
    connection.executescript("""
      DROP TABLE IF EXISTS "{0}";
      CREATE TABLE "{0}" (
        "movie_id" varchar(255) NOT NULL REFERENCES movies(id) DEFERRABLE INITIALLY DEFERRED,
        "person_id" varchar(255) NOT NULL REFERENCES people(id) DEFERRABLE INITIALLY DEFERRED,
        "sequence" INT NOT NULL,
        PRIMARY KEY (movie_id, person_id)) WITHOUT ROWID;
      """.format(table_name),
    )


def _extract_credits(
    downloaded_file_path: str,
) -> Tuple[List[Credit], List[Credit]]:
    title_ids = get_title_ids()
    directing_credits: List[Credit] = []
    writing_credits: List[Credit] = []

    for fields in extract_imdb_file(downloaded_file_path):
        title_id = fields[0]
        if title_id in title_ids:
            directing_credits.extend(_fields_to_credits(fields, 1))
            writing_credits.extend(_fields_to_credits(fields, 2))

    logger.log('Extracted {} {}.', intcomma(len(directing_credits)), DIRECTING_CREDITS_TABLE_NAME)
    logger.log('Extracted {} {}.', intcomma(len(writing_credits)), WRITING_CREDITS_TABLE_NAME)

    return (directing_credits, writing_credits)


def _fields_to_credits(fields: List[str], credit_index: int) -> List[Credit]:
    credits = []
    for sequence, person_id in enumerate(fields[credit_index].split(',')):
        credits.append(Credit(
            movie_id=fields[0],
            person_id=person_id,
            sequence=sequence,
        ))

    return credits
