"""Responsible for extracting the crew from IMDb data.
"""
import os
from process_file import process_file

CREW_FILE = 'title.crew.tsv.gz'


def extract_crew(titles, names, data_path):
    """Responsible for extracting crew from an IMDb file.

    Arguments:
        titles {dict} -- The valid titles to match.
        names {dict} -- The valid names to match.
        data_path {str} -- The path to the IMDb data.

    Returns:
        dict -- The titles with crew added.
    """
    crew_file = os.path.join(data_path, CREW_FILE)

    def _add_crew_if_valid(line):
        title_id = line[0]

        if title_id not in titles:
            return False

        def _name_is_valid(person_id):
            return person_id in names

        titles[title_id]['directors'] = filter(_name_is_valid, line[1])
        titles[title_id]['writers'] = filter(_name_is_valid, line[2])

        return True

    return process_file(names, crew_file, _add_crew_if_valid)
