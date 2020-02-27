import os
import re
from typing import Dict, List
from process_file import process_file
from person import Person

NAME_FILE = 'name.basics.tsv.gz'
NAME_REGEX = re.compile(r'^([^\s]*)\s(.*)$')


def extract_names(data_path: str) -> Dict[str, Person]:
    """Responsible for extracting names from an IMDb file.

    Args:
        data_path (str): The path to the IMDb files.

    Returns:
        dict: The names keyed by IMDb ID.s
    """
    names: Dict[str, Person] = {}
    names_file = os.path.join(data_path, NAME_FILE)

    def add_name(line: List[str]) -> Dict[str, Person]:
        names[line[0]] = _line_to_person(line)
        return names

    return process_file(file=names_file, callback=add_name)


def _line_to_person(line: List[str]) -> Person:
    match = NAME_REGEX.split(line[1])
    if len(match) == 1:
        match = ['', match[0], '', '']

    return Person(
        full_name=line[1],
        last_name=match[2],
        first_name=match[1])
