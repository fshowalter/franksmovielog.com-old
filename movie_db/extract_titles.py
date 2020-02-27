"""Responsible for extracting the titles from IMDb data.
"""
import os
from process_file import process_file
from typing import List, Dict
from movie import Movie

TITLES_FILENAME = 'title.basics.tsv.gz'


def extract_titles(data_path) -> Dict[str, Movie]:
    """Responsible for extracting titles from an IMDb file.

    Arguments:
        data_path {str} -- The path to the IMDb data.

    Returns:
        dict -- The extracted titles keyed by IMDb ID.
    """
    titles: Dict[str, Movie] = {}
    titles_file = os.path.join(data_path, TITLES_FILENAME)

    def add_title_if_valid(line: List[str]) -> Dict[str, Movie]:
        if _title_is_valid(line):
            _add_title(line, titles)
        return titles

    return process_file(file=titles_file, callback=add_title_if_valid)


def _add_title(line: List[str], titles: Dict[str, Movie]):
    titles[line[0]] = _title_to_movie(title_line=line)


def _title_is_valid(title_line: List[str]) -> bool:
    if title_line[1] != 'movie':
        return False
    if title_line[4] == '1':
        return False
    if title_line[5] == '\\N':
        return False
    if 'Documentary' in title_line[8]:
        return False
    return True


def _title_to_movie(title_line: List[str]) -> Movie:
    return Movie(
        title=title_line[2],
        original_title=title_line[3],
        year=title_line[5],
        runtime_minutes=title_line[7])
