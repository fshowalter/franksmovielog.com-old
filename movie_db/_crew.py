from dataclasses import asdict, dataclass
from typing import Iterable, List, Optional, Tuple

from movie_db import _db, _downloader, _extractor, _validator, humanize, queries
from movie_db.logger import logger

FILE_NAME = 'title.crew.tsv.gz'
DIRECTING_CREDITS_TABLE_NAME = 'directing_credits'
WRITING_CREDITS_TABLE_NAME = 'writing_credits'


@dataclass
class Credit(object):
    def __init__(self, movie_id: str, person_id: str, sequence: str) -> None:
        self.movie_id = movie_id
        self.person_id = person_id
        self.sequence = sequence


def update() -> None:
    logger.log(
        '==== Begin updating {} and {}...',
        DIRECTING_CREDITS_TABLE_NAME,
        WRITING_CREDITS_TABLE_NAME,
    )

    downloaded_file_path = _downloader.download(FILE_NAME, _db.DB_DIR)

    for _ in _extractor.checkpoint(downloaded_file_path):
        directing_credits, writing_credits = _extract_credits(downloaded_file_path)

        with _db.connect() as connection:
            _recreate_credits_table(connection, DIRECTING_CREDITS_TABLE_NAME)
            _insert_to_credits_table(
                connection,
                directing_credits,
                DIRECTING_CREDITS_TABLE_NAME,
            )
            _validator.validate_collection_to_table(
                connection,
                directing_credits,
                DIRECTING_CREDITS_TABLE_NAME,
            )
            _recreate_credits_table(connection, WRITING_CREDITS_TABLE_NAME)
            _insert_to_credits_table(
                connection,
                writing_credits,
                WRITING_CREDITS_TABLE_NAME,
            )
            _validator.validate_collection_to_table(
                connection,
                writing_credits,
                WRITING_CREDITS_TABLE_NAME,
            )


def _insert_to_credits_table(
    connection: _db.Connection,
    credits: Iterable[Credit],
    table_name: str,
) -> None:
    logger.log('Inserting {}...', table_name)

    with _db.transaction(connection):
        connection.executemany(
            'INSERT INTO {0}(movie_id, person_id, sequence) VALUES(?, ?, ?)'.format(table_name),
            asdict(credits),
        )

    connection.execute(
        """
        CREATE INDEX "index_{0}_on_person_id" ON "{0}" ("person_id");
        """.format(table_name),
    )


def _recreate_credits_table(connection: _db.Connection, table_name: str) -> None:
    logger.log('Recreating {} table...', table_name)
    connection.executescript("""
      DROP TABLE IF EXISTS "{0}";
      CREATE TABLE "{0}" (
        "movie_id" varchar(255) NOT NULL REFERENCES movies(id) DEFERRABLE INITIALLY DEFERRED,
        "person_id" varchar(255) NOT NULL REFERENCES people(id) DEFERRABLE INITIALLY DEFERRED,
        "sequence" INT NOT NULL,
        PRIMARY KEY (movie_id, person_id));
      """.format(table_name),
    )


def _extract_credits(
    downloaded_file_path: str,
) -> Tuple[List[Credit], List[Credit]]:
    title_ids = queries.get_title_ids()
    directing_credits: List[Credit] = []
    writing_credits: List[Credit] = []

    for fields in _extractor.extract(downloaded_file_path):
        title_id = fields[0]
        if title_id in title_ids:
            directing_credits.extend(_fields_to_credits(fields, 1))
            writing_credits.extend(_fields_to_credits(fields, 2))

    logger.log(
        'Extracted {} {}.',
        humanize.intcomma(len(directing_credits)),
        DIRECTING_CREDITS_TABLE_NAME,
    )
    logger.log(
        'Extracted {} {}.',
        humanize.intcomma(len(writing_credits)),
        WRITING_CREDITS_TABLE_NAME,
    )

    return (directing_credits, writing_credits)


def _fields_to_credits(fields: List[Optional[str]], credit_index: int) -> List[Credit]:
    credits: List[Credit] = []

    if fields[credit_index] is None:
        return credits

    for sequence, person_id in enumerate(str(fields[credit_index]).split(',')):
        credits.append(Credit(
            movie_id=str(fields[0]),
            person_id=person_id,
            sequence=str(sequence),
        ))

    return credits
