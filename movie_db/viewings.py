import operator
import os
import re
from dataclasses import asdict, dataclass
from datetime import date
from glob import glob
from typing import Any, List, Optional, Sequence, Tuple

import yaml
from slugify import slugify

from movie_db import _table_base, humanize
from movie_db.logger import logger

TABLE_NAME = 'viewings'
TITLE_AND_YEAR_REGEX = re.compile(r'^(.*)\s\((\d{4})\)$')
SEQUENCE = 'sequence'


class ViewingError(Exception):
    def __init__(self, message: str) -> None:
        self.message = message


@dataclass
class Viewing(object):
    imdb_id: str
    title: str
    venue: str
    sequence: int
    date: date
    year: int
    file_path: Optional[str]

    @classmethod
    def load(cls, yaml_file_path: str) -> 'Viewing':
        yaml_object = None

        with open(yaml_file_path, 'r') as yaml_file:
            yaml_object = yaml.safe_load(yaml_file)

        title, year = cls.split_title_and_year(yaml_object['title'])

        return cls(
            imdb_id=yaml_object['imdb_id'],
            title=title,
            year=year,
            venue=yaml_object['venue'],
            sequence=yaml_object[SEQUENCE],
            date=yaml_object['date'],
            file_path=yaml_file_path,
        )

    @property
    def title_with_year(self) -> str:
        return f'{self.title} ({self.year})'

    @classmethod
    def split_title_and_year(cls, title_and_year: str) -> Tuple[str, int]:
        match = TITLE_AND_YEAR_REGEX.match(title_and_year)
        if match:
            return (match.group(1), int(match.group(2)))
        raise ViewingError(f'Unable to parse {title_and_year} for title and year')

    def save(self) -> str:
        file_path = self.file_path

        if not file_path:
            slug = slugify(f'{self.sequence:04} {self.title_with_year}')
            file_path = os.path.join(TABLE_NAME, f'{slug}.yml')
            if not os.path.exists(os.path.dirname(file_path)):
                os.makedirs(os.path.dirname(file_path))

        with open(file_path, 'wb') as output_file:
            output_file.write(self.to_yaml())

        self.file_path = file_path

        logger.log('Wrote {}', self.file_path)

        return file_path

    def to_yaml(self) -> Any:
        return yaml.dump(  # type: ignore
            {
                SEQUENCE: self.sequence,
                'date': self.date,
                'imdb_id': self.imdb_id,
                'title': self.title_with_year,
                'venue': self.venue,
            },
            encoding='utf-8',
            allow_unicode=True,
            default_flow_style=False,
            sort_keys=False,
        )


class ViewingsTable(_table_base.TableBase):
    def __init__(self) -> None:
        super().__init__(TABLE_NAME)

    def drop_and_create(self) -> None:
        ddl = """
        DROP TABLE IF EXISTS "{0}";
        CREATE TABLE "movies" (
            "id"
            "movie_imdb_id" TEXT NOT NULL REFERENCES movies(id) DEFERRABLE INITIALLY DEFERRED,
            "date" DATE NOT NULL,
            "sequence" INT NOT NULL,
            "venue" TEXT NOT NULL);
        """.format(TABLE_NAME)

        super()._drop_and_create(ddl)

    def insert(self, viewings: Sequence[Viewing]) -> None:
        ddl = """
          INSERT INTO viewings(movie_imdb_id, date, sequence, venue)
          VALUES(:imdb_id, :date, :sequence, :venue);
        """
        parameter_seq = [asdict(viewing) for viewing in viewings]

        super()._insert(ddl=ddl, parameter_seq=parameter_seq)
        super()._add_index(SEQUENCE)
        super()._add_index('venue')
        super()._add_index('movie_imdb_id')
        super()._validate(viewings)


def update() -> None:
    logger.log('==== Begin updating {}...', TABLE_NAME)

    viewings = _load_viewings()
    viewings_table = ViewingsTable()
    viewings_table.drop_and_create()
    viewings_table.insert(viewings)


def add(imdb_id: str, title: str, venue: str, viewing_date: date, year: int) -> Viewing:
    existing_viewings = _load_viewings()
    next_sequence = len(existing_viewings) + 1

    last_viewing = existing_viewings[-1]

    if last_viewing.sequence != (next_sequence - 1):
        raise ViewingError(
            'Last viewing ({0} has sequence {1} but next sequence is {2}'.format(
                existing_viewings[-1:],
                last_viewing.sequence,
                next_sequence,
            ),
        )

    viewing = Viewing(
        imdb_id=imdb_id,
        title=title,
        venue=venue,
        date=viewing_date,
        year=year,
        sequence=next_sequence,
        file_path=None,
    )

    viewing.save()

    return viewing


def venues() -> Sequence[str]:
    viewings = _load_viewings()
    venue_items = list(dict.fromkeys([viewing.venue for viewing in viewings]).keys())
    venue_items.sort()
    return venue_items


def _load_viewings() -> Sequence[Viewing]:
    viewings: List[Viewing] = []
    for yaml_file_path in glob(os.path.join(TABLE_NAME, '*.yml')):
        viewings.append(Viewing.load(yaml_file_path))

    viewings.sort(key=operator.attrgetter(SEQUENCE))

    logger.log('Loaded {} {}.', humanize.intcomma(len(viewings)), TABLE_NAME)
    return viewings