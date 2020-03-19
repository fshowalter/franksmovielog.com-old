from collections import ChainMap
from typing import Optional, Set

import imdb

silent_ids: Set[str] = set()
no_sound_mix_ids: Set[str] = set()
imdb_scraper = imdb.IMDb(reraiseExceptions=True)


class Movie(object):  # noqa: WPS230
    def __init__(self, movie: imdb.Movie.Movie) -> None:
        self.year = movie.get('year', '????')
        self.title = movie['title']
        self.imdb_id = f'tt{movie.movieID}'
        self.movie_object = movie
        self.notes = movie.notes
        self.is_silent: Optional[bool] = None

        if self.imdb_id in no_sound_mix_ids:
            self.has_sound_mix = False
        elif self.imdb_id in silent_ids:
            self.has_sound_mix = True
            self.is_silent = True
        else:
            imdb_scraper.update(movie, info=['technical'])
            if movie_has_sound_mix(self):
                self.has_sound_mix = True
                self.is_silent = movie_is_silent(self)
            else:
                self.has_sound_mix = False
                self.is_silent = None


class Person(object):
    def __init__(self, imdb_id: str) -> None:
        self.imdb_id = imdb_id
        imdb_person = imdb_scraper.get_person(imdb_id[2:])
        self.name = imdb_person['name']
        self.filmography = dict(ChainMap(*imdb_person['filmography']))
        self.filmography['performer'] = self.filmography.get(
            'actor', [],
        ) + self.filmography.get(
            'actress', [],
        )


def movie_has_sound_mix(movie: Movie) -> bool:
    if movie.imdb_id in no_sound_mix_ids:
        return False

    if 'sound mix' in movie.movie_object['technical']:
        return True
    else:
        no_sound_mix_ids.add(movie.imdb_id)

    return False


def movie_is_silent(movie: Movie) -> bool:
    if movie.imdb_id in silent_ids:
        return True

    sound_mixes = movie.movie_object['technical']['sound mix']
    if len(sound_mixes) == 1:
        if sound_mixes[0] == 'Silent':
            silent_ids.add(movie.imdb_id)
            return True
    return False
