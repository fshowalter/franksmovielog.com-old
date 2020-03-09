from imdb import IMDb
from glob import glob
from typing import List
from os import path

from yaml import load as yaml_load, Loader

WATCHLIST_PATH = 'watchlist'

Directors: List[str] = []

for yaml_file_path in glob(path.join(WATCHLIST_PATH, 'directors', '*.yml')):
    with open(yaml_file_path, 'r') as yaml_file:
        Directors.append(yaml_load(yaml_file, Loader=Loader)['id'])

# create an instance of the IMDb class
ia = IMDb()

director = ia.get_person(Directors[0].replace('nm', ''))
print(director)
