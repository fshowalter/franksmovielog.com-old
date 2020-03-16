from glob import glob
from os import makedirs, path
from typing import List

from imdb import IMDb
from slugify import slugify
from yaml import Loader
from yaml import dump as yaml_dump
from yaml import load as yaml_load

from movie_db.queries.get_title_ids import get_title_ids
from movie_db.utils.logger import logger
from movie_db.watchlist.watchlist_path import WATCHLIST_PATH

# WATCHLIST_PATH = 'watchlist'


def write_watchlist_items(items_to_write) -> str:
    slug = slugify('Hammer Films')
    output = yaml_dump(
        items_to_write,
        default_flow_style=False,
    )

    output_path = _ensure_output_file(path.join(WATCHLIST_PATH, 'collections'), slug)

    with open(output_path, 'wt') as output_file:
        output_file.write(output)

    return output_path


def _ensure_output_file(output_path: str, slug: str) -> str:
    if not path.exists(output_path):
        makedirs(output_path)

    return path.join(output_path, '{0}.yml'.format(slug))


# create an instance of the IMDb class
ia = IMDb()
title_ids = get_title_ids()
hammer_movies = ia.search_movie_advanced(title='co0060069', results=250, sort='year')
yaml_output = {
    'id': 'co0060069',
    'name': 'Hammer Films',
    'titles': [],
}


for movie in hammer_movies:
    title_id = 'tt{0}'.format(movie.movieID)
    if title_id not in title_ids:
        continue
    year = int(movie.get('year'))
    if year < 1956:
        continue
    if year > 1976:
        continue

    genres = set(movie.get('genres'))

    if 'Comedy' in genres:
        if 'Horror' not in genres:
            if 'Thriller' not in genres:
                continue

    yaml_output['titles'].append({
        'id': title_id,
        'title': str(movie.get('title')),
        'year': movie.get('year'),
    })

    logger.log('{} ({})', movie.get('title'), year)

write_watchlist_items(yaml_output)
