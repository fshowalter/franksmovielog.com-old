from dataclasses import asdict, dataclass
from typing import List, Optional, Sequence

from movie_db import _db, _imdb_s3_downloader, _imdb_s3_extractor, _movies, _table_base, humanize
from movie_db.logger import logger

FILE_NAME = 'title.principals.tsv.gz'
TABLE_NAME = 'principals'


class IMDbFileRowException(Exception):
    def __init__(self, row: List[Optional[str]], message: str):
        super().__init__(message)
        self.row = row


@dataclass
class Principal(object):
    movie_imdb_id: str
    person_imdb_id: str
    sequence: int
    category: Optional[str]
    job: Optional[str]
    characters: Optional[str]

    def __init__(self, fields: List[Optional[str]]) -> None:
        if not fields[0]:
            raise IMDbFileRowException(fields, 'movie_imdb_id should not be null.')
        self.movie_imdb_id = str(fields[0])
        if not fields[1]:
            raise IMDbFileRowException(fields, 'sequence should not be null.')
        self.sequence = int(str(fields[1]))
        if not fields[2]:
            raise IMDbFileRowException(fields, 'person_imdb_id should not be null.')
        self.person_imdb_id = str(fields[2])

        self.category = fields[3]
        self.job = fields[4]
        self.characters = fields[5]


class PrincipalsTable(_table_base.TableBase):
    def __init__(self) -> None:
        super().__init__(TABLE_NAME)

    def drop_and_create(self) -> None:
        ddl = """
        DROP TABLE IF EXISTS "{0}";
        CREATE TABLE "{0}" (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            "movie_imdb_id" TEXT NOT NULL REFERENCES movies(imdb_id) DEFERRABLE INITIALLY DEFERRED,
            "person_imdb_id" TEXT NOT NULL REFERENCES people(imdb_id) DEFERRABLE INITIALLY DEFERRED,
            "sequence" INT NOT NULL,
            "category" TEXT,
            "job" TEXT,
            "characters" TEXT);
        """.format(self.table_name)

        super()._drop_and_create(ddl)

    def insert(self, principals: Sequence[Principal]) -> None:
        ddl = """
            INSERT INTO "{0}" (
                movie_imdb_id,
                person_imdb_id,
                sequence,
                category,
                job,
                characters)
            VALUES (
                :movie_imdb_id,
                :person_imdb_id,
                :sequence,
                :category,
                :job,
                :characters)""".format(self.table_name)  # noqa: S608

        parameter_seq = [asdict(principal) for principal in principals]

        super()._insert(ddl=ddl, parameter_seq=parameter_seq)
        super()._add_index('category')
        super()._validate(principals)


def update() -> None:
    logger.log('==== Begin updating {} ...', TABLE_NAME)

    downloaded_file_path = _imdb_s3_downloader.download(FILE_NAME, _db.DB_DIR)

    for _ in _imdb_s3_extractor.checkpoint(downloaded_file_path):
        principals = _extract_principals(downloaded_file_path)
        principals_table = PrincipalsTable()
        principals_table.drop_and_create()
        principals_table.insert(principals)


def _extract_principals(downloaded_file_path: str) -> List[Principal]:
    title_ids = _movies.title_ids()
    principals: List[Principal] = []

    for fields in _imdb_s3_extractor.extract(downloaded_file_path):
        if fields[0] in title_ids:
            principals.append(Principal(fields))

    logger.log('Extracted {} {}.', humanize.intcomma(len(principals)), TABLE_NAME)

    return principals
