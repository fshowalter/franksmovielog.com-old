from collections import ChainMap
from typing import Set

import imdb

from movie_db import queries


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
        self.imdb_scraper = imdb.IMDb(reraiseExceptions=True)
        imdb_person = imdb.IMDb().get_person(imdb_id[2:])
        self.name = imdb_person['name']
        self.filmography = dict(ChainMap(*imdb_person['filmography']))


class MovieValidator(object):
    def __init__(self) -> None:
        self.valid_title_ids = queries.get_title_ids()
        self.imdb_scraper = imdb.IMDb(reraiseExceptions=True)
        self.silent_ids: Set[str] = set()

    def movie_in_db(self, movie: imdb.Movie) -> bool:
        title_id = f'tt{movie.movieID}'
        return title_id in self.valid_title_ids

    def movie_is_silent(self, movie: imdb.Movie) -> bool:
        if movie.movieID in self.silent_ids:
            return True

        self.imdb_scraper.update(movie, info=['technical'])
        sound_mixes = movie['technical']['sound mix']
        if len(sound_mixes) == 1:
            if sound_mixes[0] == 'Silent':
                self.silent_ids.add(movie.movieID)
                return True
        return False
