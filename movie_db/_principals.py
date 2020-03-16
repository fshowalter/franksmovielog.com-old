from dataclasses import asdict, dataclass
from typing import List, Optional

from movie_db import _db, _downloader, _extractor, _validator, humanize, queries
from movie_db.logger import logger

FILE_NAME = 'title.principals.tsv.gz'
TABLE_NAME = 'principals'


class IMDbFileRowException(Exception):
    def __init__(self, row: List[Optional[str]], message: str):
        super().__init__(message)
        self.row = row


@dataclass
class Principal(object):
    def __init__(self, fields: List[Optional[str]]) -> None:
        if not fields[0]:
            raise IMDbFileRowException(fields, 'movie_id should not be null.')
        self.movie_id = fields[0]
        if not fields[1]:
            raise IMDbFileRowException(fields, 'sequence should not be null.')
        self.sequence = int(str(fields[1]))
        if not fields[2]:
            raise IMDbFileRowException(fields, 'person_id should not be null.')
        self.person_id = fields[2]

        self.category = fields[3]
        self.job = fields[4]
        self.characters = fields[5]


def update() -> None:
    logger.log('==== Begin updating {} ...', TABLE_NAME)

    downloaded_file_path = _downloader.download(FILE_NAME, _db.DB_DIR)

    for _ in _extractor.checkpoint(downloaded_file_path):
        principals = _extract_principals(downloaded_file_path)

        with _db.connect() as connection:
            _recreate_principals_table(connection)
            _insert_principals(connection, principals)
            _validator.validate_collection_to_table(connection, principals, TABLE_NAME)


def _insert_principals(connection: _db.Connection, principals: List[Principal]) -> None:
    logger.log('Inserting {}...', TABLE_NAME)

    with _db.transaction(connection):
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
            asdict(principals),
        )


def _recreate_principals_table(connection: _db.Connection) -> None:
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
    title_ids = queries.get_title_ids()
    principals: List[Principal] = []

    for fields in _extractor.extract(downloaded_file_path):
        if fields[0] in title_ids:
            principals.append(Principal(fields))

    logger.log('Extracted {} {}.', humanize.intcomma(len(principals)), TABLE_NAME)

    return principals
