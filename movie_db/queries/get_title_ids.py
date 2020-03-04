from typing import Set

from utils.db import db


def get_title_ids() -> Set[str]:
    with db() as connection:
        connection.row_factory = lambda cursor, row: row[0]
        return set(connection.execute('select id from movies').fetchall())
