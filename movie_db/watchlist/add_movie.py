from os import makedirs, path

from slugify import slugify
from yaml import dump as yaml_dump

from movie_db.watchlist.watchlist_item import WatchlistItem
from movie_db.watchlist.watchlist_path import WATCHLIST_PATH


def add_movie(movie: WatchlistItem) -> None:
    slug = slugify(movie.name)
    output = yaml_dump({
        'name': movie.name,
        'id': movie.id,
        'notes': movie.notes,
    })

    movies_path = path.join(WATCHLIST_PATH, 'movies')

    if not path.exists(movies_path):
        makedirs(movies_path)

    movie_file = path.join(movies_path, '{0}.yml'.format(slug))

    with open(movie_file, 'wt') as output_file:
        output_file.write(output)
