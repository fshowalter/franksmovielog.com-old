"""Responsible for extracting the principals from IMDb data.
"""
import os
from process_file import process_file

PRINCIPALS_FILE = 'title.principals.tsv.gz'


def extract_principals(titles, names, data_path):
    """Responsible for extracting principals from an IMDb file.

    Arguments:
        titles {dict} -- The valid titles to match.
        names {dict} -- The valid names to match.
        data_path {str} -- The path to the IMDb data.

    Returns:
        dict -- The titles with principals keyed by order.
    """
    principals_file = os.path.join(data_path, PRINCIPALS_FILE)

    def _add_principal_if_valid(line):
        title_id = line[0]

        if title_id not in titles:
            return False

        person_id = line[2]

        if person_id not in names:
            return False

        if 'principals' not in titles[title_id]:
            titles[title_id]['principals'] = {}

        titles[title_id]['principals'][line[1]] = _format_principal(line)
        return True

    return process_file(titles, principals_file, _add_principal_if_valid)


def _format_principal(line):
    return {
        'person_id': line[2],
        'category': line[3],
        'job': line[4],
        'characters': line[5],
    }
