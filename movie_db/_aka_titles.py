from dataclasses import asdict, dataclass
from typing import List, Optional

from movie_db import _db, _downloader, _extractor, _validator, humanize, queries
from movie_db.logger import logger

FILE_NAME = 'title.akas.tsv.gz'
TABLE_NAME = 'aka_titles'


@dataclass  # noqa: WPS230
class AkaTitle(object):
    def __init__(self, fields: List[Optional[str]]) -> None:
        self.movie_id = str(fields[0])
        self.sequence = int(str(fields[1]))
        self.title = str(fields[2])
        self.region = fields[3]
        self.language = fields[4]
        self.types = fields[5]
        self.attributes = fields[6]
        self.is_original_title = fields[7]


def update() -> None:
    logger.log('==== Begin updating {} ...', TABLE_NAME)

    downloaded_file_path = _downloader.download(FILE_NAME, _db.DB_DIR)

    for _ in _extractor.checkpoint(downloaded_file_path):
        aka_titles = _extract_aka_titles(downloaded_file_path)

        with _db.connect() as connection:
            _recreate_aka_titles_table(connection)
            _insert_aka_titles(connection, aka_titles)
            _validator.validate_collection_to_table(connection, aka_titles, TABLE_NAME)


def _insert_aka_titles(connection: _db.Connection, aka_titles: List[AkaTitle]) -> None:
    logger.log('Inserting {}...', TABLE_NAME)

    with _db.transaction(connection):
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
            asdict(aka_titles),
        )


def _recreate_aka_titles_table(connection: _db.Connection) -> None:
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
    title_ids = queries.get_title_ids()
    aka_titles: List[AkaTitle] = []

    for fields in _extractor.extract(downloaded_file_path):
        if fields[0] in title_ids:
            aka_titles.append(AkaTitle(fields))

    logger.log('Extracted {} {}.', humanize.intcomma(len(aka_titles)), TABLE_NAME)

    return aka_titles
