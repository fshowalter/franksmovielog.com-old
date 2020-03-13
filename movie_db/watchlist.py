from os import makedirs, path

import inflect
import yaml
from slugify import slugify

from movie_db.logger import logger

WATCHLIST_PATH = 'watchlist'


class Item(yaml.YAMLObject):
    yaml_tag = None

    def __init__(self, imdb_id: str, name: str, frozen: bool = False):
        self.imdb_id = imdb_id
        self.name = name
        self.frozen = frozen


def add_director(director: Item) -> None:
    _write_watchlist_item(item_type='director', watchlist_item=director)


def add_performer(performer: Item) -> None:
    _write_watchlist_item(item_type='performer', watchlist_item=performer)


def add_writer(writer: Item) -> None:
    _write_watchlist_item(item_type='writer', watchlist_item=writer)


def _write_watchlist_item(item_type: str, watchlist_item: Item) -> str:
    inflection = inflect.engine()

    slug = slugify(watchlist_item.name)
    output = yaml.dump(
        watchlist_item,
        encoding='utf-8',
        allow_unicode=True,
        default_flow_style=False,
    )

    output_path = _ensure_output_file(
        path.join(WATCHLIST_PATH, inflection.plural(item_type)),
        slug,
    )

    with open(output_path, 'wb') as output_file:
        output_file.write(output)

    logger.log('Wrote {} ({}) to {}', watchlist_item.name, watchlist_item.imdb_id, output_path)

    return output_path


def _ensure_output_file(output_path: str, slug: str) -> str:
    if not path.exists(output_path):
        makedirs(output_path)

    return path.join(output_path, '{0}.yml'.format(slug))
