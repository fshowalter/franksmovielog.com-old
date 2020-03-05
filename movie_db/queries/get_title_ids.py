from typing import Set

from utils.db import db


def get_title_ids() -> Set[str]:
    with db() as connection:
        cursor = connection.cursor()
        cursor.row_factory = lambda cursor, row: row[0]
        return set(cursor.execute('select id from movies').fetchall())
