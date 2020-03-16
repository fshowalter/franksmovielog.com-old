import os
from enum import Enum
from glob import glob
from typing import Iterable, List, Optional, Sequence

import inflect
import yaml
from slugify import slugify
from typing_extensions import Literal, TypedDict

from movie_db import _imdb
from movie_db.logger import logger

WATCHLIST_PATH = 'watchlist'
inflection = inflect.engine()


class Types(Enum):
    DIRECTOR = 'director'  # noqa: WPS115
    PERFORMER = 'performer'  # noqa: WPS115
    WRITER = 'writer'  # noqa: WPS115
    COLLECTION = 'collection'  # noqa: WPS115


PersonTypes = Literal[Types.DIRECTOR, Types.PERFORMER, Types.WRITER]


def add_person(person_type: PersonTypes, imdb_id: str, name: str) -> None:
    item_path = _build_path_for_yaml_filename(person_type, slugify(name))
    _write(item_path=item_path, imdb_id=imdb_id, name=name)


def _build_path_for_yaml_filename(item_type: Types, name: str) -> str:
    plural_type = inflection.plural(item_type.value)
    return os.path.join(WATCHLIST_PATH, plural_type, f'{name}.yml')


Movie = TypedDict('Movie', {'imdb_id': str, 'year': int, 'title': str})


def _write(
    item_path: str,
    imdb_id: str,
    name: str,
    frozen: bool = False,
    titles: Optional[Sequence[Movie]] = None,
) -> str:
    if titles is None:
        titles = []

    output = yaml.dump(
        {
            'imdb_id': imdb_id,
            'name': name,
            'frozen': frozen,
            'titles': titles,
        },
        encoding='utf-8',
        allow_unicode=True,
        default_flow_style=False,
    )

    if not os.path.exists(os.path.dirname(item_path)):
        os.makedirs(os.path.dirname(item_path))

    with open(item_path, 'wb') as output_file:
        output_file.write(output)

    logger.log('Wrote {} ({}) to {} with {} titles', name, imdb_id, item_path, len(titles))

    return item_path


def scrape_credits_for_person(
    person: _imdb.Person,
    credit_type: Types,
    validator: _imdb.MovieValidator,
) -> Sequence[Movie]:
    titles: List[Movie] = []

    credit_types: List[str] = []
    if credit_type == Types.PERFORMER:
        credit_types = ['actor', 'actress']
    else:
        credit_types = [credit_type.value]

    for credit_key in credit_types:
        for movie in reversed(person.filmography[credit_key]):
            imdb_movie = _imdb.Movie(movie)

            if not validator.movie_in_db(imdb_movie):
                logger.log(
                    'Skipping {} ({}) for {} {}',
                    imdb_movie.title,
                    imdb_movie.year,
                    person.name,
                    imdb_movie.notes,
                )
                continue
            if validator.movie_is_silent(imdb_movie):
                logger.log(
                    'Skipping {} ({}) for {} (silent film)',
                    imdb_movie.title,
                    imdb_movie.year,
                    person.name,
                )
                continue
            titles.append({
                'imdb_id': imdb_movie.imdb_id,
                'title': imdb_movie.title,
                'year': imdb_movie.year,
            })

    return titles


@logger.catch
def update_people() -> None:
    validator = _imdb.MovieValidator()

    for watchlist_item in updatable_items():
        imdb_person = _imdb.Person(watchlist_item.imdb_id)
        titles = scrape_credits_for_person(
            person=imdb_person,
            credit_type=watchlist_item.item_type,
            validator=validator,
        )

        _write(
            item_path=watchlist_item.file_path,
            imdb_id=imdb_person.imdb_id,
            name=imdb_person.name,
            titles=titles,
        )


class WatchlistItem(object):
    def __init__(self, item_type: Types, file_path: str) -> None:
        yaml_object = None

        with open(file_path, 'r') as yaml_file:
            yaml_object = yaml.safe_load(yaml_file)

        self.imdb_id = yaml_object['id']
        self.name = yaml_object['name']
        self.frozen = yaml_object.get('frozen', False)  # noqa: WPS425
        self.item_type = item_type
        self.file_path = file_path


def updatable_items() -> Iterable[WatchlistItem]:
    for credit_type in Types:
        if credit_type == Types.COLLECTION:
            continue
        yaml_files_path = _build_path_for_yaml_filename(item_type=credit_type, name='*')
        for yaml_file_path in glob(yaml_files_path):
            watchlist_item = WatchlistItem(item_type=credit_type, file_path=yaml_file_path)
            if watchlist_item.frozen:
                continue
            yield watchlist_item


if __name__ == '__main__':
    update_people()
