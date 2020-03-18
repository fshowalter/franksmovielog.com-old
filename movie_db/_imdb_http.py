from collections import ChainMap
from typing import Set

import imdb

silent_ids: Set[str] = set()
imdb_scraper = imdb.IMDb(reraiseExceptions=True)


class Movie(object):
    def __init__(self, movie: imdb.Movie.Movie) -> None:
        self.year = movie.get('year', '????')
        self.title = movie['title']
        self.imdb_id = f'tt{movie.movieID}'
        self.movie_object = movie
        self.notes = movie.notes


class Person(object):
    def __init__(self, imdb_id: str) -> None:
        self.imdb_id = imdb_id
        imdb_person = imdb_scraper.get_person(imdb_id[2:])
        self.name = imdb_person['name']
        self.filmography = dict(ChainMap(*imdb_person['filmography']))


def movie_is_silent(movie: Movie) -> bool:
    if movie.imdb_id in silent_ids:
        return True

    imdb_scraper.update(movie.movie_object, info=['technical'])
    sound_mixes = movie.movie_object['technical']['sound mix']
    if len(sound_mixes) == 1:
        if sound_mixes[0] == 'Silent':
            silent_ids.add(movie.imdb_id)
            return True
    return False
