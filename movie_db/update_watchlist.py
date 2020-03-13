from glob import glob
from os import path

from yaml import Loader
from yaml import load as yaml_load

from movie_db.watchlist.watchlist_path import WATCHLIST_PATH


def update_watchlist() -> None:
    directors = []

    for yaml_file_path in glob(path.join(WATCHLIST_PATH, 'directors', '*.yml')):
        with open(yaml_file_path, 'r') as yaml_file:
            directors.append(yaml_load(yaml_file, Loader=Loader)['id'])
