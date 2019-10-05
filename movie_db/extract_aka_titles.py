"""Responsible for extracting aka titles from IMDb data.
"""
import os
from process_file import process_file

AKA_TITLES_FILENAME = 'title.akas.tsv.gz'


def extract_aka_titles(titles, data_path):
    """Responbile for extracting aka titles from an IMDb file.

    Arguments:
        titles {dict} -- The valid titles to match.
        data_path {str} -- The path to the IMDb data.

    Returns:
        dict -- The titles, updated with aka titles.
    """
    aka_titles_file = os.path.join(data_path, AKA_TITLES_FILENAME)

    def _add_aka_title_if_valid(line):
        aka_title_id = line[0]
        if aka_title_id not in titles:
            return False

        if 'aka_titles' not in titles[aka_title_id]:
            titles[aka_title_id]['aka_titles'] = []

        titles[aka_title_id]['aka_titles'].append(line[2])
        return True

    return process_file(titles, aka_titles_file, _add_aka_title_if_valid)
