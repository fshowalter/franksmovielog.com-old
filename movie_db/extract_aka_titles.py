import os
from movie import Movie
from typing import Dict, List
from process_file import process_file

AKA_TITLES_FILENAME = 'title.akas.tsv.gz'


def extract_aka_titles(titles: Dict[str, Movie], data_path: str) -> Dict[str, Movie]:
    """Responbile for extracting aka titles from an IMDb file.

    Args:
        titles (dict): A list of valid titles.
        data_path (str): Location of the IMDb files.

    Returns:
        dict: The `titles` updates with an `aka_titles` key.
    """
    aka_titles_file = os.path.join(data_path, AKA_TITLES_FILENAME)

    def add_aka_title_if_valid(line: List[str]) -> Dict[str, Movie]:
        aka_title_id = line[0]
        if aka_title_id not in titles:
            return titles

        if titles[aka_title_id].title == line[2]:
            return titles

        if titles[aka_title_id].original_title == line[2]:
            return titles

        titles[aka_title_id].aka_titles.add(line[2])
        return titles

    return process_file(file=aka_titles_file, callback=add_aka_title_if_valid)
