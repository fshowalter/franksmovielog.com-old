#! /usr/bin/env python3

import html
import os
import re
from dataclasses import dataclass
from datetime import date
from glob import glob
from typing import Optional, Sequence

import yaml
from prompt_toolkit.formatted_text import HTML

from movie_db import queries, viewings
from movie_db.cli import _ask, _radio_list, main
from movie_db.logger import logger

TITLE_REGEX = re.compile(r'^(.*)\s\(\d{4}\)$')


@dataclass
class OldViewing(object):
    title: str
    venue: str
    number: int
    date: date
    file_path: str

    def title_without_year(self) -> str:
        match = TITLE_REGEX.match(self.title)
        if match:
            return match.group(1)
        return self.title

    @classmethod
    def load(cls, yaml_file_path: str) -> 'OldViewing':
        yaml_object = None

        with open(yaml_file_path, 'r') as yaml_file:
            yaml_object = yaml.safe_load(yaml_file)

        return cls(
            title=yaml_object[':title'],
            venue=yaml_object[':venue'],
            number=yaml_object[':number'],
            date=yaml_object[':date'],
            file_path=yaml_file_path,
        )


def _prompt_for_new_title(viewing: OldViewing) -> Optional[str]:
    prompt_text = HTML(
        f'Viewing <cyan>{viewing.number}</cyan> - <cyan>{viewing.title}</cyan> Title: ',
    )
    return _ask.prompt(prompt_text)


def _select_movie_for_viewing(viewing: OldViewing) -> Optional[queries.MovieSearchResult]:
    movie = None

    first = True
    query: Optional[str] = viewing.title_without_year()

    while movie is None:

        if not first:
            query = _prompt_for_new_title(viewing)
            if query is None:
                break

        else:
            first = False

        search_results = queries.search_movies_by_title(str(query))

        movie = _radio_list.prompt(
            title=HTML(
                'Viewing <cyan>{0}</cyan> - <cyan>{1}</cyan>: '.format(
                    viewing.number, html.escape(viewing.title),
                ),
            ),
            options=build_options_for_select_movie_for_collection(search_results),
        )

    return movie


def build_options_for_select_movie_for_collection(
    search_results: Sequence[queries.MovieSearchResult],
) -> _radio_list.MovieSearchOptions:
    options = _radio_list.MovieSearchOptions([
        (None, 'Search again'),
    ])

    for search_result in search_results:
        option = HTML(
            '<cyan>{0} ({1})</cyan> ({2})'.format(
                html.escape(search_result.title),
                search_result.year,
                ', '.join(html.escape(principal) for principal in search_result.principals),
            ),
        )

        options.append((search_result, option))

    return options


@logger.catch
def fix_viewings() -> None:
    for yaml_file_path in glob(os.path.join('viewings-old', '*.yml')):
        old_viewing = OldViewing.load(yaml_file_path)
        movie = _select_movie_for_viewing(old_viewing)
        if movie:
            new_viewing = viewings.Viewing(
                imdb_id=movie.imdb_id,
                title=movie.title,
                year=movie.year,
                venue=old_viewing.venue,
                sequence=old_viewing.number,
                date=old_viewing.date,
                file_path=None,
            )
            new_viewing.save()
            os.remove(yaml_file_path)


if __name__ == '__main__':
    fix_viewings()
   # main.prompt()
