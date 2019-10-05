"""Responsible for extracting the titles from IMDb data.
"""
import os
from process_file import process_file

TITLES_FILENAME = 'title.basics.tsv.gz'


def extract_titles(data_path):
    """Responsible for extracting titles from an IMDb file.

    Arguments:
        data_path {str} -- The path to the IMDb data.

    Returns:
        dict -- The extracted titles keyed by IMDb ID.
    """
    titles = {}
    titles_file = os.path.join(data_path, TITLES_FILENAME)

    def _add_title_if_valid(line):
        if _title_is_valid(line):
            _add_title(line, titles)
            return True
        return False

    return process_file(titles, titles_file, _add_title_if_valid)


def _add_title(line, titles):
    titles[line[0]] = _format_title(line)


def _title_is_valid(title_line):
    if len(title_line) != 9:
        return False
    if title_line[1] != 'movie':
        return False
    if title_line[4] == '1':
        return False
    if 'Documentary' in title_line[8]:
        return False
    return True


def _format_title(title_line):
    return {
        'title': title_line[2],
        'original_title': title_line[3],
        'year': title_line[5],
        'runtime_minutes': title_line[7]
    }
