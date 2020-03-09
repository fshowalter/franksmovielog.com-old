from os import makedirs, path

from slugify import slugify
from yaml import dump as yaml_dump

from movie_db.watchlist.watchlist_item import WatchlistItem
from movie_db.watchlist.watchlist_path import WATCHLIST_PATH


def write_watchlist_item(entity_type: str, slug: str, watchlist_item: WatchlistItem) -> str:
    slug = slugify(slug)
    output = yaml_dump(
        {
            'id': watchlist_item.id,
            'name': watchlist_item.name,
            'notes': watchlist_item.notes,
            'title_ids_to_exclude': list(watchlist_item.title_ids_to_exclude),
        },
        default_flow_style=False,
    )

    output_path = _ensure_output_file(path.join(WATCHLIST_PATH, entity_type), slug)

    with open(output_path, 'wt') as output_file:
        output_file.write(output)

    return output_path


def _ensure_output_file(output_path: str, slug: str) -> str:
    if not path.exists(output_path):
        makedirs(output_path)

    return path.join(output_path, '{0}.yml'.format(slug))
