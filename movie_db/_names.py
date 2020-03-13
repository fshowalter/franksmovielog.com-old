import re
from dataclasses import dataclass
from typing import Dict, List, Optional, Set

from movie_db import _db, _downloader, _extractor, _validator, humanize, queries
from movie_db.logger import logger

FILE_NAME = 'name.basics.tsv.gz'
TABLE_NAME = 'people'
NAME_REGEX = re.compile(r'^([^\s]*)\s(.*)$')


@dataclass  # noqa: WPS230
class Name(object):
    def __init__(self, fields: List[Optional[str]]) -> None:
        match = NAME_REGEX.split(str(fields[1]))
        if len(match) == 1:
            match = ['', match[0], '', '']

        self.imdb_id = fields[0]
        self.full_name = fields[1]
        self.last_name = match[2]
        self.first_name = match[1]
        self.birth_year = fields[2]
        self.death_year = fields[3]
        self.primary_profession = fields[4]
        self.known_for_title_ids = fields[5]


def update() -> None:
    logger.log('==== Begin updating {}...', TABLE_NAME)

    downloaded_file_path = _downloader.download(FILE_NAME, _db.DB_DIR)

    for _ in _extractor.checkpoint(downloaded_file_path):
        people = _extract_people(downloaded_file_path)

        with _db.connect() as connection:
            _recreate_people_table(connection)
            _insert_people(connection, people)
            _add_indexes(connection)
            _validator.validate_collection_to_table(connection, people, TABLE_NAME)


def _add_indexes(connection: _db.Connection) -> None:
    connection.execute('CREATE INDEX "index_people_on_full_name" ON "people" ("full_name");')


def _insert_people(connection: _db.Connection, people: Dict[str, Name]) -> None:
    logger.log('Inserting {}...', TABLE_NAME)

    with _db.transaction(connection):
        connection.executemany("""
            INSERT INTO people(
              id,
              full_name,
              last_name,
              first_name,
              birth_year,
              death_year,
              primary_profession,
              known_for_title_ids)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)""",
                               [
                                   (
                                       person.imdb_id,
                                       person.full_name,
                                       person.last_name,
                                       person.first_name,
                                       person.birth_year,
                                       person.death_year,
                                       person.primary_profession,
                                       person.known_for_title_ids,
                                   ) for person in people.values()
                               ])


def _recreate_people_table(connection: _db.Connection) -> None:
    logger.log('Recreating {} table...', TABLE_NAME)
    connection.executescript("""
      DROP TABLE IF EXISTS "people";
      CREATE TABLE "people" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "full_name" varchar(255) NOT NULL,
        "last_name" varchar(255),
        "first_name" varchar(255),
        "birth_year" TEXT,
        "death_year" TEXT,
        "primary_profession" TEXT,
        "known_for_title_ids" TEXT);
      """)


def _extract_people(downloaded_file_path: str) -> Dict[str, Name]:
    people: Dict[str, Name] = {}
    title_ids = queries.get_title_ids()

    for fields in _extractor.extract(downloaded_file_path):
        if _has_valid_known_for_title_ids(fields[5], title_ids):
            people[str(fields[0])] = Name(fields)

    logger.log('Extracted {} {}.', humanize.intcomma(len(people)), TABLE_NAME)
    return people


def _has_valid_known_for_title_ids(
    known_for_title_ids: Optional[str],
    valid_title_ids: Set[str],
) -> bool:
    if known_for_title_ids is None:
        return False

    for title_id in known_for_title_ids.split(','):
        if title_id in valid_title_ids:
            return True

    return False
