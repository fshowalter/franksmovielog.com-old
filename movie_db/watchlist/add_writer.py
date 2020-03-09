from os import makedirs, path

from slugify import slugify
from yaml import dump as yaml_dump

from movie_db.watchlist.watchlist_item import WatchlistItem
from movie_db.watchlist.watchlist_path import WATCHLIST_PATH


def add_writer(writer: WatchlistItem) -> None:
    slug = slugify(writer.name)
    output = yaml_dump({
        'name': writer.name,
        'id': writer.id,
    })

    writers_path = path.join(WATCHLIST_PATH, 'writers')

    if not path.exists(writers_path):
        makedirs(writers_path)

    writer_file = path.join(writers_path, '{0}.yml'.format(slug))

    with open(writer_file, 'wt') as output_file:
        output_file.write(output)
