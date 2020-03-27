import abc
from typing import Any, Dict, List, Sized

from movie_db.internal import db, humanize
from movie_db.logger import logger


class TableBase(abc.ABC):
    def __init__(self, table_name: str) -> None:
        self.table_name = table_name

    def _add_index(self, column: str) -> None:
        with db.connect() as connection:
            connection.executescript(
                """
                DROP INDEX IF EXISTS "index_{0}_on_{1}";
                CREATE INDEX "index_{0}_on_{1}" ON "{0}" ("{1}");
                """.format(self.table_name, column),
            )

    def _drop_and_create(self, ddl: str) -> None:
        with db.connect() as connection:
            logger.log('Recreating {} table...', self.table_name)
            connection.executescript(ddl)

    def _insert(self, ddl: str, parameter_seq: List[Dict[str, Any]]) -> None:
        logger.log('Inserting {}...', self.table_name)

        with db.connect() as connection:
            with db.transaction(connection):
                connection.executemany(ddl, parameter_seq)

    def _validate(self, collection: Sized) -> None:
        with db.connect() as connection:
            inserted = connection.execute(
                'select count(*) from {0}'.format(self.table_name),  # noqa: S608
            ).fetchone()[0]

            expected = len(collection)
            assert expected == inserted  # noqa: S101
            logger.log('Inserted {} {}.', humanize.intcomma(inserted), self.table_name)
