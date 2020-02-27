import os
from typing import List, Dict
from mypy_extensions import TypedDict
from process_file import process_file
from movie import Movie, Principal
from person import Person

PRINCIPALS_FILE = 'title.principals.tsv.gz'


TitleMeta = TypedDict('TitleMeta', {'principals': List[Principal]}, total=False)


def extract_principals(
        titles: Dict[str, Movie],
        names: Dict[str, Person],
        data_path: str) -> Dict[str, Movie]:
    """Responsible for extracting principals from an IMDb file.

    Args:
        titles (dict): A list of valid IMDb titles.
        names (dict): A list of valid IMDb names.
        data_path (str): Path to the IMDb data.

    Returns:
        dict: The `titles` updated with principals.
    """
    principals_file = os.path.join(data_path, PRINCIPALS_FILE)

    def add_principal_if_valid(line: List[str]) -> Dict[str, Movie]:
        title_id = line[0]
        person_id = line[2]

        if title_id not in titles:
            return titles

        if person_id not in names:
            return titles

        titles[title_id].principals.append(_line_to_principal(line))
        return titles

    return process_file(file=principals_file, callback=add_principal_if_valid)


def _line_to_principal(line: List[str]) -> Principal:
    return Principal(
        person_id=line[2],
        sequence=line[1],
        category=line[3],
        job=line[4],
        characters=line[5]
    )
