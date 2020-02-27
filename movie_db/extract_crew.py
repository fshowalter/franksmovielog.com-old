import os
from typing import List, Dict
from movie import Movie
from person import Person
from process_file import process_file

CREW_FILE = 'title.crew.tsv.gz'


def extract_crew(titles: Dict[str, Movie], names: Dict[str, Person], data_path: str) -> Dict[str, Movie]:
    """Responsible for extracting crew from an IMDb file.

    Args:
        titles (dict): A list of valid IMDb titles.
        names (dict): A list of valid IMDb names.
        data_path (str): Path to the IMDb data.

    Returns:
        dict: The `titles` updated with `directors` and `writers` keys.
    """
    crew_file = os.path.join(data_path, CREW_FILE)

    def add_crew_if_valid(line: List[str]) -> Dict[str, Movie]:
        title_id = line[0]

        if title_id not in titles:
            return titles

        def name_is_valid(person_id: str):
            return person_id in names

        titles[title_id].directors.extend(list(filter(name_is_valid, line[1])))
        titles[title_id].writers.extend(list(filter(name_is_valid, line[2])))

        return titles

    return process_file(file=crew_file, callback=add_crew_if_valid)
