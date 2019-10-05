"""Responsible for extracting the names from IMDb data.
"""
import os
import re
from process_file import process_file

NAME_FILE = 'name.basics.tsv.gz'
NAME_REGEX = re.compile(r'^([^\s]*)\s(.*)$')


def extract_names(data_path):
    """Responsible for extracting names from an IMDb file.

    Arguments:
        data_path {str} -- The path to the IMDb data.

    Returns:
        dict -- The names keyed by IMDb ID.
    """
    names = {}
    names_file = os.path.join(data_path, NAME_FILE)

    def _add_name(line):
        if len(line) < 3:
            return False
        names[line[0]] = _format_name(line)
        return True

    return process_file(names, names_file, _add_name)


def _format_name(line):
    match = NAME_REGEX.split(line[1])
    if len(match) == 1:
        match = ['', match[0], None, '']

    return {
        'full_name': line[1],
        'last_name': match[2],
        'first_name': match[1],
    }
