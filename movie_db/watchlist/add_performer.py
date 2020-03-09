from os import makedirs, path

from slugify import slugify
from yaml import dump as yaml_dump

from movie_db.watchlist.watchlist_item import WatchlistItem
from movie_db.watchlist.watchlist_path import WATCHLIST_PATH


def add_performer(performer: WatchlistItem) -> None:
    slug = slugify(performer.name)
    output = yaml_dump({
        'name': performer.name,
        'id': performer.id,
    })

    performers_path = path.join(WATCHLIST_PATH, 'performers')

    if not path.exists(performers_path):
        makedirs(performers_path)

    performer_file = path.join(performers_path, '{0}.yml'.format(slug))

    with open(performer_file, 'wt') as output_file:
        output_file.write(output)
