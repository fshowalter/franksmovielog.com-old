import re
from pathlib import Path
from typing import Dict, NamedTuple, Union

from utils.db import DB_DIR, Connection, db, transaction
from utils.download_imdb_file import download_imdb_file
from utils.extract_imdb_file import extract_imdb_file
from utils.humanize import intcomma
from utils.logger import logger

FILE_NAME = 'name.basics.tsv.gz'
TABLE_NAME = 'people'
NAME_REGEX = re.compile(r'^([^\s]*)\s(.*)$')


class Person(NamedTuple):
    full_name: str
    last_name: str
    first_name: str
    birth_year: Union[str, None]
    death_year: Union[str, None]
    primary_profession: str
    known_for_title_ids: str


def update_people() -> None:
    logger.log('==== Begin updating {}...', TABLE_NAME)

    downloaded_file_path = download_imdb_file(FILE_NAME, DB_DIR)
    success_file = Path('{0}._success'.format(downloaded_file_path))

    if (success_file.exists()):
        logger.log('Found {} file. Skipping load.', success_file)
        return

    people = _extract_people(downloaded_file_path)
    inserted = 0

    with db() as connection:
        _recreate_people_table(connection)
        _insert_people(connection, people)
        _add_indexes(connection)
        inserted = connection.execute(
            'select count(*) from {0}'.format(TABLE_NAME),  # noqa: S608
            ).fetchone()[0]

    _validate_inserted(inserted, people)
    success_file.touch()


def _add_indexes(connection: Connection) -> None:
    connection.execute('CREATE INDEX "index_people_on_full_name" ON "people" ("full_name");')


def _validate_inserted(inserted: int, collection: Dict[str, Person]) -> None:
    expected = len(collection)
    assert expected == inserted  # noqa: S101
    logger.log('Inserted {} {}.', intcomma(inserted), TABLE_NAME)


def _insert_people(connection: Connection, people: Dict[str, Person]) -> None:
    logger.log('Inserting {}...', TABLE_NAME)

    with transaction(connection):
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
                                       imdb_id,
                                       person.full_name,
                                       person.last_name,
                                       person.first_name,
                                       person.birth_year,
                                       person.death_year,
                                       person.primary_profession,
                                       person.known_for_title_ids,
                                   ) for (imdb_id, person) in people.items()
                               ])


def _recreate_people_table(connection: Connection) -> None:
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


def _extract_people(downloaded_file_path: str) -> Dict[str, Person]:
    people: Dict[str, Person] = {}

    for fields in extract_imdb_file(downloaded_file_path):
        match = NAME_REGEX.split(fields[1])
        if len(match) == 1:
            match = ['', match[0], '', '']

        people[fields[0]] = Person(
            full_name=fields[1],
            last_name=match[2],
            first_name=match[1],
            birth_year=fields[2],
            death_year=fields[3],
            primary_profession=fields[4],
            known_for_title_ids=fields[5],
        )

    logger.log('Extracted {} {}.', intcomma(len(people)), TABLE_NAME)
    return people
