import utils.formatter as formatter
from download_imdb_file import download_imdb_file
from process_file import process_file
from typing import List, Dict
from movie import Movie
import utils.cache as cache

TITLES_FILENAME = 'title.basics.tsv.gz'


def update_titles(data_path: str):
    print(formatter.h1(f"Updating {formatter.identifier('titles')}"))
    imdb_file = _download_file(data_path)
    _extract_data(imdb_file)


def _extract_data(imdb_file: str) -> Dict[str, Movie]:
    cached_data = cache.read(imdb_file)
    if cached_data:
        return cached_data

    titles: Dict[str, Movie] = {}

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


def _download_file(data_path: str) -> str:
    download_imdb_file(download_directory=data_path, file_to_download=TITLES_FILENAME)
