from typing import Sized

from movie_db import _db, humanize
from movie_db.logger import logger


def validate_collection_to_table(
    connection: _db.Connection,
    collection: Sized,
    table: str,
) -> None:
    inserted = connection.execute(
        'select count(*) from {0}'.format(table),  # noqa: S608
        ).fetchone()[0]

    expected = len(collection)
    assert expected == inserted  # noqa: S101
    logger.log('Inserted {} {}.', humanize.intcomma(inserted), table)
